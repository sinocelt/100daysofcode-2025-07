#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import sqlite3
from pathlib import Path
import argparse
from typing import Iterator, Dict

# CC-CEDICT line format:
# Traditional Simplified [pinyin] /def1/def2/.../
LINE_RE = re.compile(
    r"""^
    (?P<trad>\S+)\s+
    (?P<simp>\S+)\s+
    \[(?P<pinyin>[^\]]+)\]\s+
    /(?P<defs>.+)/\s*$
    """,
    re.VERBOSE
)

def iter_entries(txt_path: Path) -> Iterator[Dict]:
    """
    Yield parsed CC-CEDICT entries as dicts.
    Skips any line starting with '#' or '#!' (comments/metadata).
    """
    with txt_path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if not line:
                continue
            if line.startswith("#") or line.startswith("#!"):
                # Skip headers/metadata; DO NOT delete them from the source file.
                continue
            m = LINE_RE.match(line)
            if not m:
                # Non-conforming line; skip it quietly.
                continue
            trad = m.group("trad")
            simp = m.group("simp")
            pinyin = m.group("pinyin").strip()  # numeric tones e.g. xue2 xi2
            raw_defs = m.group("defs")
            defs = [d for d in raw_defs.split("/") if d]
            yield {
                "trad": trad,
                "simp": simp,
                "pinyin": pinyin,
                "defs": defs,
                "raw_defs": raw_defs,
            }

SCHEMA_SQL = """
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;

DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS definitions;

CREATE TABLE entries (
  id           INTEGER PRIMARY KEY,
  trad         TEXT NOT NULL,
  simp         TEXT NOT NULL,
  pinyin_num   TEXT NOT NULL,
  defs_joined  TEXT NOT NULL
);

-- Denormalized: carry headwords/pinyin into definitions
CREATE TABLE definitions (
  entry_id     INTEGER NOT NULL,
  def_index    INTEGER NOT NULL,
  trad         TEXT NOT NULL,
  simp         TEXT NOT NULL,
  pinyin_num   TEXT NOT NULL,
  definition   TEXT NOT NULL,
  PRIMARY KEY (entry_id, def_index),
  FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
);

CREATE INDEX idx_entries_trad    ON entries(trad);
CREATE INDEX idx_entries_simp    ON entries(simp);
CREATE INDEX idx_entries_pinyin  ON entries(pinyin_num);

CREATE INDEX idx_def_trad        ON definitions(trad);
CREATE INDEX idx_def_simp        ON definitions(simp);
CREATE INDEX idx_def_pinyin      ON definitions(pinyin_num);
CREATE INDEX idx_def_definition  ON definitions(definition);
"""

# Optional FTS5 (fast full-text search). If not supported, we skip it gracefully.
FTS_SQL = """
CREATE VIRTUAL TABLE IF NOT EXISTS defs_fts USING fts5(
  definition,
  content='definitions',
  content_rowid='rowid'
);
"""

def build_db(db_path: Path, txt_path: Path):
    if not txt_path.exists():
        raise FileNotFoundError(f"Input not found: {txt_path}")

    con = sqlite3.connect(str(db_path))
    cur = con.cursor()

    # Create schema
    cur.executescript(SCHEMA_SQL)
    con.commit()

    # Speed up bulk inserts
    cur.execute("PRAGMA cache_size=-200000;")   # ~200 MB if available
    cur.execute("PRAGMA temp_store=MEMORY;")
    cur.execute("BEGIN;")

    entries_count = 0
    defs_count = 0
    try:
        for e in iter_entries(txt_path):
            cur.execute(
                "INSERT INTO entries (trad, simp, pinyin_num, defs_joined) VALUES (?, ?, ?, ?)",
                (e["trad"], e["simp"], e["pinyin"], e["raw_defs"])
            )
            entry_id = cur.lastrowid
            entries_count += 1

            if e["defs"]:
                rows = [
                    (entry_id, i, e["trad"], e["simp"], e["pinyin"], d)
                    for i, d in enumerate(e["defs"])
                ]
                cur.executemany(
                    "INSERT INTO definitions (entry_id, def_index, trad, simp, pinyin_num, definition) "
                    "VALUES (?, ?, ?, ?, ?, ?)",
                    rows
                )
                defs_count += len(rows)

        con.commit()
    except Exception:
        con.rollback()
        con.close()
        raise

    # Try FTS5 in the same connection
    fts_enabled = False
    try:
        cur.executescript(FTS_SQL)
        cur.execute("DELETE FROM defs_fts;")
        cur.execute("INSERT INTO defs_fts(rowid, definition) SELECT rowid, definition FROM definitions;")
        con.commit()
        fts_enabled = True
    except sqlite3.Error:
        # FTS not compiled in or other issue — ignore
        pass

    # Close write connection BEFORE VACUUM to avoid "cannot VACUUM from within a transaction"
    con.close()

    # Run VACUUM in a fresh, autocommit connection (safe)
    try:
        con2 = sqlite3.connect(str(db_path))
        con2.execute("VACUUM;")
        con2.close()
    except sqlite3.Error:
        # VACUUM is optional; if it fails, the DB still works.
        pass

    print(f"Done. Wrote {entries_count} entries and {defs_count} definitions to {db_path}.")
    print("FTS5 index:", "enabled" if fts_enabled else "not available (skipped)")

def main():
    ap = argparse.ArgumentParser(description="Build a SQLite DB from CC-CEDICT.")
    ap.add_argument("--input", "-i", default="cc-cedict.txt", help="Path to CC-CEDICT UTF-8 text file.")
    ap.add_argument("--db", "-o", default="cedict.sqlite", help="Output SQLite database path.")
    args = ap.parse_args()

    build_db(Path(args.db), Path(args.input))

if __name__ == "__main__":
    main()

