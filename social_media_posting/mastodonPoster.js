// mastodonPoster.js
// Modernized Mastodon posting helper (CommonJS, async/await).
// - Supports 0–4 images + text
// - Keeps your random short waits
// - Preserves your config shape { access_token, masto_api_url }
// - Provides BOTH a modern API (postToMastodon) and a backward-compatible wrapper (mastodonFunction)
// - Depends on the "mastodon" npm package you already used

// npm i mastodon
const fs = require('fs');
const path = require('path');
const Masto = require('mastodon');

/**
 * Small promisified sleep with fractional milliseconds support.
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Return a random float in [min, max], rounded to 4 decimals (for logs).
 * @param {number} min
 * @param {number} max
 */
function randomWaitSeconds(min = 0.5, max = 1.5) {
  const r = Math.random() * (max - min) + min;
  return parseFloat(r.toFixed(4));
}

/**
 * Normalize API base URL to end with /api/v1/
 * Accepts values like:
 *   https://mastodon.cloud
 *   https://mastodon.cloud/
 *   https://mastodon.cloud/api/v1
 *   https://mastodon.cloud/api/v1/
 * @param {string} base
 */
function normalizeApiUrl(base) {
  if (!base || typeof base !== 'string') {
    throw new Error('mastodonConfigObject.masto_api_url is required and must be a string');
  }
  let url = base.trim();
  if (!url.endsWith('/')) url += '/';
  if (!/\/api\/v1\/$/.test(url)) {
    if (/\/api\/v1\/?$/.test(url)) {
      if (!url.endsWith('/')) url += '/';
      return url;
    }
    url += 'api/v1/';
  }
  return url;
}

/**
 * Create a Mastodon client instance.
 * @param {{ access_token: string, masto_api_url: string, timeout_ms?: number }} cfg
 */
function createClient(cfg) {
  if (!cfg || typeof cfg !== 'object') {
    throw new Error('mastodonConfigObject is required');
  }
  const access_token = cfg.access_token;
  const api_url = normalizeApiUrl(cfg.masto_api_url);
  const timeout_ms = cfg.timeout_ms ?? 60_000;

  if (!access_token || typeof access_token !== 'string') {
    throw new Error('mastodonConfigObject.access_token is required and must be a string');
  }

  return new Masto({
    access_token,
    api_url,
    timeout_ms,
  });
}

/**
 * Upload one media file to Mastodon.
 * Returns the media ID string, or null if the file path is falsy.
 * Throws if path is provided but missing/invalid.
 * @param {InstanceType<typeof Masto>} M
 * @param {string|null|undefined} filePath
 * @param {string|null|undefined} [altText]
 */
async function uploadOneMedia(M, filePath, altText) {
  if (!filePath) return null;

  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Mastodon media file not found: ${abs}`);
  }

  const waitS = randomWaitSeconds(0.5, 1.5);
  console.log(`🐘 Waiting ${waitS}s before uploading: ${abs}`);
  await sleep(waitS * 1000);

  const stream = fs.createReadStream(abs);
  const payload = { file: stream };
  if (altText && typeof altText === 'string') {
    payload.description = altText.slice(0, 1500);
  }

  const res = await M.post('media', payload);
  const id = res?.data?.id;
  if (!id) {
    throw new Error(`Mastodon returned no media id for: ${abs}`);
  }
  console.log(`✅ Uploaded media to Mastodon: ${abs} -> id ${id}`);
  return id;
}

/**
 * Post a status with optional media IDs.
 * @param {InstanceType<typeof Masto>} M
 * @param {{
 *   status?: string,
 *   media_ids?: string[],
 *   visibility?: 'public'|'unlisted'|'private'|'direct',
 *   sensitive?: boolean,
 *   spoiler_text?: string
 * }} opts
 */
// async function postStatus(M, opts) {
//   const body = {
//     status: opts.status ?? '',
//     media_ids: Array.isArray(opts.media_ids) ? opts.media_ids.filter(Boolean) : undefined,
//     visibility: opts.visibility || 'public',
//     sensitive: Boolean(opts.sensitive),
//     spoiler_text: opts.spoiler_text || undefined,
//   };

//   const waitS = randomWaitSeconds(0.5, 1.5);
//   console.log(`🐘 All media ready. Waiting ${waitS}s before posting status…`);
//   await sleep(waitS * 1000);

//   await M.post('statuses', body);
//   console.log('🎉 Mastodon post created successfully.');
// }

// async function postStatus(M, opts) {
//   const mediaIds = Array.isArray(opts.media_ids)
//     ? opts.media_ids.filter(Boolean) // remove null/undefined/empty
//     : [];

//   const body = {
//     status: opts.status ?? '',
//     visibility: opts.visibility || 'public',
//     sensitive: Boolean(opts.sensitive),
//     spoiler_text: opts.spoiler_text || undefined,
//   };

//   if (mediaIds.length > 0) {
//     body.media_ids = mediaIds;
//   }

//   const waitS = randomWaitSeconds(0.5, 1.5);
//   console.log(`🐘 All media ready. Waiting ${waitS}s before posting status…`);
//   await sleep(waitS * 1000);

//   await M.post('statuses', body);
//   console.log('🎉 Mastodon post created successfully.');
// }


async function postStatus(M, opts) {
  // Build the request body *selectively* so we never send undefined fields
  const body = {
    status: typeof opts.status === 'string' ? opts.status : '',
    visibility: opts.visibility || 'public',
  };

  // Only add media_ids if we actually have valid IDs
  if (Array.isArray(opts.media_ids)) {
    const mediaIds = opts.media_ids.filter(Boolean);
    if (mediaIds.length > 0) {
      body.media_ids = mediaIds;
    }
  }

  // Only add spoiler_text if it's a non-empty string
  if (typeof opts.spoiler_text === 'string' && opts.spoiler_text.trim() !== '') {
    body.spoiler_text = opts.spoiler_text;
  }

  // Only add sensitive if it's explicitly true (no need to send false)
  if (opts.sensitive === true) {
    body.sensitive = true;
  }

  // Small randomized wait (keeps your original behavior)
  const waitS = randomWaitSeconds(0.5, 1.5);
  console.log(`🐘 All media ready. Waiting ${waitS}s before posting status…`);
  await sleep(waitS * 1000);

  await M.post('statuses', body);
  console.log('🎉 Mastodon post created successfully.');
}



/**
 * Modern API: one call to post to Mastodon, with 0–4 images and text.
 *
 * @param {{
 *   post_text?: string,
 *   image_paths?: (string|null|undefined)[] | string | null | undefined,
 *   alt_texts?: (string|null|undefined)[],
 *   visibility?: 'public'|'unlisted'|'private'|'direct',
 *   sensitive?: boolean,
 *   spoiler_text?: string,
 * }} post
 * @param {{ access_token: string, masto_api_url: string, timeout_ms?: number }} mastodonConfigObject
 * @returns {Promise<{ success: true, message: string } | { success: false, error: string }>}
 */
async function postToMastodon(post, mastodonConfigObject) {
  try {
    if (!post || typeof post !== 'object') {
      throw new Error('post object is required');
    }

    let images = [];
    if (Array.isArray(post.image_paths)) {
      images = post.image_paths.slice(0, 4);
    } else if (typeof post.image_paths === 'string' && post.image_paths.trim()) {
      images = [post.image_paths.trim()];
    }

    const text = (post.post_text ?? '').toString();

    if (!text && images.filter(Boolean).length === 0) {
      throw new Error('Both post text and images are missing. At least one is required.');
    }

    const M = createClient(mastodonConfigObject);

    const mediaIds = [];
    const altTexts = Array.isArray(post.alt_texts) ? post.alt_texts : [];

    for (let i = 0; i < Math.min(4, images.length); i++) {
      const filePath = images[i];
      const alt = altTexts[i] ?? null;

      try {
        const id = await uploadOneMedia(M, filePath, alt);
        if (id) mediaIds.push(id);
      } catch (err) {
        console.warn(`⚠️ Skipping media ${i + 1} due to error: ${err?.message || err}`);
      }
    }

    await postStatus(M, {
      status: text,
      media_ids: mediaIds,
      visibility: post.visibility,
      sensitive: post.sensitive,
      spoiler_text: post.spoiler_text,
    });

    return { success: true, message: 'Successfully posted to Mastodon' };
  } catch (error) {
    console.error('Error posting to Mastodon:', error);
    return { success: false, error: error?.message || String(error) };
  }
}

/**
 * Back-compat with your original signature:
 *   mastodonFunction(img1, img2, img3, img4, theTweet, mastodonConfigObject)
 * Returns a Promise<string> that resolves on success.
 */
async function mastodonFunction(img1, img2, img3, img4, theTweet, mastodonConfigObject) {
  const res = await postToMastodon(
    {
      post_text: theTweet,
      image_paths: [img1, img2, img3, img4],
    },
    mastodonConfigObject
  );

  if (res.success) return 'MASTODON finished';
  throw new Error(`ERROR IN MASTODON uploading all: ${res.error}`);
}

module.exports = {
  postToMastodon,
  mastodonFunction,
};
