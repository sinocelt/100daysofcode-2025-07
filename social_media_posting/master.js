// master.js
const { postToMastodon, mastodonFunction } = require('./mastodonPoster');

(async () => {
  const cfg = {
    // access_token: process.env.MASTODON_TOKEN,
    // make sure to make an application in your Mastodon account:
    // the steps are, once logged into Mastodon
    // Preferences -> Development -> New Application, then copy the access token where it says
    // "Your access token"
    access_token: "THE_ACCESS_TOKEN",

    // masto_api_url: 'https://mastodon.cloud', // NOTE THIS URL NEEDS TO BE CORRECT change based on the site I'm using
    masto_api_url: 'https://mastodon.social', // NOTE THIS URL NEEDS TO BE CORRECT change based on the site I'm using
  };

  // Modern API
  const result = await postToMastodon(
    {
      post_text: 'Hello from my master script!',
    //   image_paths: ['img1.jpg', 'img2.png'],
    //   alt_texts: ['first img', 'second img'],
      visibility: 'public',
    },
    cfg
  );
  console.log(result);

  // Back-compat API (your old signature)
//   const msg = await mastodonFunction('img1.jpg', null, null, null, 'Old-style call works too', cfg);
//   console.log(msg);
})();
