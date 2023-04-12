import Mastodon from '../lib/mastodon'

const M = new Mastodon({
    access_token: '...'
})

//Account apis

// Get current selected account

M.apis.account.verifyAccountCredentials().then((resp) => console.log(resp.data))

/*
-- Response:
{
    "id": "1",
    "username": "trwnh",
    "acct": "trwnh",
    ...
}
*/

// Follow an account 

M.apis.account.follow("3").then((resp) => console.log(resp))

/*
-- Response:
{
     "id": "3",
    "following": true,
    "showing_reblogs": false,
    "notifying": false,
    "followed_by": false,
    "blocking": false,
    "blocked_by": false,
    "muting": false,
    "muting_notifications": false,
    "requested": false,
    "domain_blocking": false,
    "endorsed": false
}
*/

// Follow an account 

M.apis.account.unfollow("3").then((resp) => console.log(resp))

/*
-- Response:
{ data: {
     "id": "3",
    "following": false,
    "showing_reblogs": false,
    "notifying": false,
    "followed_by": false,
    "blocking": false,
    "blocked_by": false,
    "muting": false,
    "muting_notifications": false,
    "requested": false,
    "domain_blocking": false,
    "endorsed": false
}}
*/

// Get all followers
M.apis.account.followers("1", 10, "458645").then((resp) => console.log(resp))
/* 
 -- Response:
 { data: [
  {
    "id": "1020382",
    "username": "atul13061987",
    "acct": "atul13061987",
    "display_name": "",
    // ...
  },
  {
    "id": "1020381",
    "username": "linuxliner",
    "acct": "linuxliner",
    "display_name": "",
    // ...
  },
  meta: {
    nextId: 458645,
    previousId: 458645
  }
]
*/


// Search for accounts
M.apis.account.search("Social", 0, 10, false, false).then((resp) => console.log(resp))
/* 
 -- Response:
 [{ 
    "id": "1020382",
    "username": "atul13061987",
    "url": "atul13061987",
    "image": "",
    // ...
  },
  {
    "id": "1020382",
    "username": "atul13061987",
    "url": "atul13061987",
    "image": "",
    // ...
  }
]
*/


// Media Apis

M.apis.media.upload(request.get(url), null/* Thumbnail */, "Wolf Image" /* Description */, null /* Focus point of Thumbnail */).then((data) => console.log(data))

/* 
 -- Response:
 {data: { 
    "id": "1020382123",
    "type": "video",
    "previewUrl": "",
    ...
  }}
*/


// Status Apis

M.apis.status.create("Hello", ["1020382123"]).then((data) => console.log(data))

/* 
 -- Response:
 {data: { 
    "id": "1456020382123",
    "url": "",
    "visibility": "public",
    ...
  }}
*/