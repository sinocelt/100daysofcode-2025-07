#!/usr/bin/env node
// mastodonPost.js
// CLI for posting to Mastodon with 0–4 images.
// Usage examples are shown at the bottom.

const fs = require('fs');
const path = require('path');
const { postToMastodon } = require('./mastodonPoster');

/* ----------------------------- tiny arg parser ---------------------------- */

function parseArgs(argv) {
  // returns { _: [], flags: { key: value | true } }
  const out = { _: [], flags: {} };
  const args = argv.slice(2);
  let i = 0;
  while (i < args.length) {
    const a = args[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) {
        const key = a.slice(2, eq);
        const val = a.slice(eq + 1);
        pushFlag(out.flags, key, val);
        i += 1;
      } else {
        const key = a.slice(2);
        const next = args[i + 1];
        if (!next || next.startsWith('--')) {
          pushFlag(out.flags, key, true);
          i += 1;
        } else {
          pushFlag(out.flags, key, next);
          i += 2;
        }
      }
    } else {
      out._.push(a);
      i += 1;
    }
  }
  return out;
}

function pushFlag(flags, key, val) {
  if (key in flags) {
    if (!Array.isArray(flags[key])) {
      flags[key] = [flags[key]];
    }
    flags[key].push(val);
  } else {
    flags[key] = val;
  }
}

/* ----------------------------- helper utils ------------------------------ */

function toArrayMaybe(v) {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  return [v];
}

function splitCSV(s) {
  if (!s || typeof s !== 'string') return [];
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

function fileExists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

/* ------------------------------ read content ----------------------------- */

async function readTextFromFileOrStdin(flags) {
  // Priority: --text-file; else if stdin is piped, read stdin; else empty string
  const textFile = flags['text-file'];
  if (textFile) {
    const abs = path.resolve(String(textFile));
    if (!fileExists(abs)) {
      throw new Error(`Text file not found: ${abs}`);
    }
    return fs.readFileSync(abs, 'utf8');
  }

  // If piped input (not a TTY), read stdin
  if (!process.stdin.isTTY) {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
  }

  return '';
}

/* ---------------------------------- main --------------------------------- */

async function main() {
  const { flags } = parseArgs(process.argv);

  // Config via flags or env
  const token = flags.token || process.env.MASTODON_TOKEN;
  const apiUrl = flags['api-url'] || process.env.MASTODON_API_URL;

  if (!token || !apiUrl) {
    printHelp();
    console.error('\nERROR: Missing Mastodon credentials.');
    console.error('Provide --token and --api-url, or set env MASTODON_TOKEN and MASTODON_API_URL.\n');
    process.exit(1);
  }

  // Read text (file or stdin)
  let postText = String(flags.text || '');
  if (!postText) {
    postText = await readTextFromFileOrStdin(flags);
  }
  // Trim but allow empty if images are present (module enforces at least one of text/images)
  postText = postText.trim();

  // Gather images (0–4)
  // Option A: --image path --image path ...
  // Option B: --images "a.jpg,b.png,c.webp"
  const imageFlags = toArrayMaybe(flags.image);
  const imagesCSV = splitCSV(flags.images);
  let images = [...imageFlags, ...imagesCSV].map(String).map((p) => p.trim()).filter(Boolean);

  // Cap at 4 images
  if (images.length > 4) {
    console.warn(`⚠️ You provided ${images.length} images; Mastodon will accept 4. Keeping the first 4.`);
    images = images.slice(0, 4);
  }

  // Alt text alignment (optional)
  // Pass multiple --alt flags, e.g. --alt "desc1" --alt "desc2"
  const altTexts = toArrayMaybe(flags.alt).map(String);

  // Visibility/sensitive/spoiler
  const visibility = flags.visibility || undefined; // 'public'|'unlisted'|'private'|'direct'
  const sensitive = !!flags.sensitive;
  const spoiler_text = flags.spoiler ? String(flags.spoiler) : undefined;

  // Post
  const result = await postToMastodon(
    {
      post_text: postText,
      image_paths: images,
      alt_texts: altTexts,
      visibility,
      sensitive,
      spoiler_text,
    },
    {
      access_token: token,
      masto_api_url: apiUrl,
    }
  );

  if (result.success) {
    console.log('✅', result.message);
    process.exit(0);
  } else {
    console.error('❌ Error:', result.error);
    process.exit(2);
  }
}

function printHelp() {
  const h = `
Mastodon CLI Poster

USAGE:
  node mastodonPost.js --token <TOKEN> --api-url <INSTANCE_URL> [options]

CONFIG:
  --token <TOKEN>         Mastodon access token (or set env MASTODON_TOKEN)
  --api-url <URL>         Instance base, e.g. https://mastodon.cloud (or env MASTODON_API_URL)
                          (You can include or omit /api/v1; it will be normalized.)

CONTENT:
  --text "<text>"         Post text (optional if you provide at least one image)
  --text-file <path>      Read post text from a file (overrides --text)
  (stdin)                 If --text-file not given and stdin is piped, text is read from stdin

IMAGES (0–4 accepted; extras are ignored):
  --image <path>          Add one image; repeat for multiple
  --images "a.jpg,b.png"  Comma-separated list of images (alternative to multiple --image)
  --alt "<text>"          Alt text aligning with images (repeat for each image you want alt text for)

OPTIONS:
  --visibility <v>        One of: public | unlisted | private | direct
  --sensitive             Mark media as sensitive (NSFW)
  --spoiler "<text>"      Content warning / spoiler text

EXAMPLES:
  # Text from file, one image
  node mastodonPost.js --token $MASTODON_TOKEN --api-url https://mastodon.cloud \\
    --text-file post.txt --image img1.jpg

  # Multiple images with alt text
  node mastodonPost.js --token $MASTODON_TOKEN --api-url https://mastodon.cloud \\
    --text "Look at these!" \\
    --image a.jpg --alt "A photo of A" \\
    --image b.png --alt "B, the sequel"

  # CSV images and stdin text
  cat message.txt | node mastodonPost.js --token $MASTODON_TOKEN --api-url https://mastodon.social \\
    --images "1.jpg,2.jpg,3.jpg,4.jpg" --visibility unlisted

  # Sensitive + spoiler/CW
  node mastodonPost.js --token $MASTODON_TOKEN --api-url https://example.instance \\
    --text "Some content" --image pic.png --sensitive --spoiler "CW: description"
`;
  console.log(h.trim());
}

if (require.main === module) {
  main().catch((e) => {
    console.error('Unexpected error:', e?.message || e);
    process.exit(99);
  });
}
