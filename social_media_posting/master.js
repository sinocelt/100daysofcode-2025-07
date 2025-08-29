// master.js


// fix this later
// const fs = require('fs');

/*
fs.readFile('test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File contents:', data);
});



const { postToMastodon, mastodonFunction } = require('./mastodonPoster');

(async () => {
  const cfg = {
    // access_token: process.env.MASTODON_TOKEN,
    // make sure to make an application in your Mastodon account:
    // the steps are, once logged into Mastodon
    // Preferences -> Development -> New Application, then copy the access token where it says
    // "Your access token"
    // access_token: "THE_ACCESS_TOKEN",
    access_token: "",

    // masto_api_url: 'https://mastodon.cloud', // NOTE THIS URL NEEDS TO BE CORRECT change based on the site I'm using
    masto_api_url: 'https://mastodon.social', // NOTE THIS URL NEEDS TO BE CORRECT change based on the site I'm using
  };

  // Modern API
  const result = await postToMastodon(
    {
      // post_text: 'Hello from my master script 2!',
      // post_text: user_data,
      post_text: 
      
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

*/


const fs = require('fs').promises; // use the promise-based fs API
const { postToMastodon, mastodonFunction } = require('./mastodonPoster');

(async () => {
  try {
    // Read the file contents
    const THETEXT = await fs.readFile('test.txt', 'utf8');

    const cfg = {
      // access_token: process.env.MASTODON_TOKEN,
      access_token: "THE_ACCESS_TOKEN",
      masto_api_url: 'https://mastodon.social', // change based on your server
    };

    // Post to Mastodon using the file contents
    const result = await postToMastodon(
      {
        post_text: THETEXT,
        visibility: 'public',
      },
      cfg
    );

    console.log('Post result:', result);

  } catch (err) {
    console.error('Error:', err);
  }
})();
