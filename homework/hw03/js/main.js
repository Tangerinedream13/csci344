import { getAccessToken } from "./utilities.js";
const rootURL = "https://photo-app-secured.herokuapp.com";
let token = null;
let username = "webdev";
let password = "password";

async function initializeScreen() {
    token = await getAccessToken(rootURL, username, password);
    showNav();
    getPosts();
    getSuggestions();
    getStories(); 
    getProfile();
}

async function getProfile() {
    // go out to the internet, get suggestions, and then bring them down to my browser.
    const endpoint = "https://photo-app-secured.herokuapp.com/api/profile/";
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    }); 
    const profile = await response.json();
    console.log(profile);
    
showProfile(profile); 

}

function showProfile(profile) {
    document.querySelector("#profile").innerHTML = `
    <img src="https://picsum.photos/60/60?q=11" class="rounded-full w-16" alt="Profile picture of ${profile.username}" />
    <h2 class="font-Comfortaa font-bold text-2xl">${profile.username}</h2>
    `;
}

function showNav() {
    document.querySelector("#nav").innerHTML = `
        <nav class="flex justify-between py-5 px-9 bg-white border-b fixed w-full top-0">
            <h1 class="font-Comfortaa font-bold text-2xl">Photo App</h1>
            <ul class="flex gap-4 text-sm items-center justify-center">
                <li><span>${username}</span></li>
                <li><button class="text-blue-700 py-2" aria-label="Sign out">Sign out</button></li>
            </ul>
        </nav>
    `;
}

// implement remaining functionality below:
/**
 * Goal: We wat to generate our posts from data.
 *      1. Go out to the internet and fetch all of our posts.
 *      2. Once our posts come back, we want to loop through each pst,
 *         and append each post to the correct place in our HTML.
 */

async function getPosts() {
    const endpoint =
        "https://photo-app-secured.herokuapp.com/api/posts/?limit=10";
    // get the HTTP response header:
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    // get the HTTP body (JSON object):
    const posts = await response.json();

    // print the data to the console:
    console.log(posts);

    // invoke this function to actually  draw the posts to the screen:
    showPosts(posts);
}
async function getSuggestions() {
    console.log("Fetching suggestions...");
    const endpoint = "https://photo-app-secured.herokuapp.com/api/suggestions/";
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    }); 

    if (!response.ok) {
        console.error("Failed to fetch suggestions:", response.status);
        return;
    }

    const suggestions = await response.json();
    console.log("Suggestions data:", suggestions);
    
    showSuggestions(suggestions); 
}

function showSuggestions(suggestions) {
    const suggestionsEl = document.querySelector("#suggestions");

    if (!suggestionsEl) {
        console.error("Suggestions element not found in DOM");
        return;
    }

    // Clear the suggestions element
    suggestionsEl.innerHTML = '';

    // Loop through each suggestion and add it to the DOM
    suggestions.forEach(suggestion => {
        const template = `
            <section class="flex justify-between items-center mb-4 gap-2">
                <img src="${suggestion.thumb_url}" class="rounded-full" alt="Profile picture of ${suggestion.username}" />
                <div class="w-[180px]">
                    <p class="font-bold text-sm">${suggestion.username}</p>
                    <p class="text-gray-500 text-xs">suggested for you</p>
                </div>
                <button id="follow-button-${suggestion.id}" class="text-blue-500 text-sm py-2" 
                        onclick="followAccount(${suggestion.id})" aria-label="Follow ${suggestion.username}">Follow</button>
            </section>
        `;
        suggestionsEl.insertAdjacentHTML("beforeend", template);
    });
}

async function getStories() {
    // go out to the internet, get suggestions, and then bring them down to my browser.
    const endpoint = "https://photo-app-secured.herokuapp.com/api/stories/";
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    }); 
    const stories = await response.json();
    console.log(stories);
    
showStories(stories); 

}

function showStories(stories) {
    const storiesEl = document.querySelector("#stories");

    stories.forEach(story => {
        const template = `
            <div class="flex flex-col justify-center items-center w-20">
                <img src="${story.user.thumb_url}" class="rounded-full border-4 border-gray-300" 
                     alt="Profile picture of ${story.user.username}" />
                <p class="text-xs text-gray-800 font-semibold">${story.user.username}</p>
            </div>
        `;
        storiesEl.insertAdjacentHTML("beforeend", template);
    });
}



    
function showPosts(posts) {
    const mainEl = document.querySelector("main");

    posts.forEach(post => {
        const template = `
        <section class="bg-white border mb-10">
            <div class="p-4 flex justify-between">
                <h3 class="text-lg font-Comfortaa font-bold">${post.user.username}</h3>
                <button aria-label="More options" class="icon-button">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
            <img src="${post.image_url}" alt="${post.alt_text}" width="300" height="300" class="w-full bg-cover">
            <div class="p-4">
                <div class="flex justify-between text-2xl mb-3">
                    <div>
                        ${getLikeButton(post)}
                        <button aria-label="Comment"><i class="far fa-comment"></i></button>
                        <button aria-label="Share"><i class="far fa-paper-plane"></i></button>
                    </div>
                    <div>
                        ${getBookmarkButton(post)}
                    </div>
                </div>
                <p class="font-bold mb-3">${post.likes.length} like(s)</p>
                <div class="text-sm mb-3">
                    <p><strong>${post.user.username}</strong> ${post.caption}</p>
                </div>
                ${showComments(post.comments)}
                <p class="uppercase text-gray-500 text-xs">${post.display_time}</p>
            </div>
            <div class="flex justify-between items-center p-3">
                <div class="flex items-center gap-3 min-w-[80%]">
                    <i class="far fa-smile text-lg"></i>
                    <label for="comment-input-${post.id}" class="sr-only">Add a comment</label>
                    <input id="comment-input-${post.id}" type="text" class="min-w-[80%] focus:outline-none" 
                           placeholder="Add a comment...">
                </div>
                <button class="text-blue-500 py-2" aria-label="Post comment">Post</button>
            </div>
        </section>
        `;
        mainEl.insertAdjacentHTML("beforeend", template);
    });
}



// input: comments
// output: HTML string representing the comments
function showComments(comments) {
    if(comments.length > 1) {
        const lastComment = comments[comments.length-1];
        return `
            <button class="text-sm mb-3">view all ${comments.length} comments</button>
            <p class="text-sm mb-3">
            <strong>${lastComment.user.username}</strong> ${lastComment.text}
            </p>
        `;
    }
    if(comments.length === 1) {
        const lastComment = comments[0];
        return `<p class="text-sm mb-3">
            <strong>${comments[0].user.username}</strong> ${comments[0].text}
        </p>`
    }
        return '';
    }

    function getLikeButton(post) {
        if (post.current_user_like_id) {
            return `<button aria-label="Unlike post" onclick="unlike(${post.current_user_like_id})">
                        <i class="fa-solid text-red-700 fa-heart"></i>
                    </button>`;
        } else {
            return `<button aria-label="Like post" onclick="createLike(${post.id})">
                        <i class="fa-regular fa-heart"></i>
                    </button>`;
        }
    }
   
    function getBookmarkButton(post) {
        if (post.current_user_bookmark_id) {
            return `<button aria-label="Remove bookmark" onclick="deleteBookmark(${post.current_user_bookmark_id})">
                        <i class="fa-solid fa-bookmark"></i>
                    </button>`;
        } else {
            return `<button aria-label="Bookmark post" onclick="createBookmark(${post.id})">
                        <i class="far fa-bookmark"></i>
                    </button>`;
        }
    }
    
  window.createBookmark = async function(postID) {
        const postData = {
            post_id: postID,
        };
        
        const response = await fetch(
            "https://photo-app-secured.herokuapp.com/api/bookmarks/", 
            {
            method: "POST", // create new resource on the server
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(postData), // the data that's getting sent to the server
        });
        const data = await response.json();
        console.log(data);
}
    
window.deleteBookmark = async function(bookmarkId) {
    const response = await fetch(`https://photo-app-secured.herokuapp.com/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    }); 
    const data = await response.json();
    console.log(data);
    };


window.createLike = async function(postID) {
        const postData = {
            post_id: postID,
        };
        
        const response = await fetch(
            `https://photo-app-secured.herokuapp.com/api/likes/`,
            {
            method: "POST", // create new resource on the server
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(postData), // the data that's getting sent to the server
        });
        const data = await response.json();
        console.log(data);
}

window.unlike = async function(likeID) {
    const response = await fetch(`https://photo-app-secured.herokuapp.com/api/likes/${likeID}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    }); 
    const data = await response.json();
    console.log(data);
    };

    window.followAccount = async function(userId) {
        const endpoint = "https://photo-app-secured.herokuapp.com/api/following/";
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId })
        });
    
        if (response.ok) {
            console.log(`Successfully followed user with ID: ${userId}`);
            const followButton = document.querySelector(`#follow-button-${userId}`);
            followButton.textContent = "Following";
            followButton.classList.remove("text-blue-500");
            followButton.classList.add("text-gray-500");
            followButton.disabled = false;
    
            followButton.onclick = () => window.unfollowAccount(userId);
        }
    };
    
    window.unfollowAccount = async function(userId) {
        const endpoint = `https://photo-app-secured.herokuapp.com/api/following/${userId}`;
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
    
        if (response.ok) {
            console.log(`Successfully unfollowed user with ID: ${userId}`);
            const followButton = document.querySelector(`#follow-button-${userId}`);
            followButton.textContent = "Follow";
            followButton.classList.remove("text-gray-500");
            followButton.classList.add("text-blue-500");
            followButton.disabled = false;
    
            followButton.onclick = () => window.followAccount(userId);
        }
    };
    
// after all of the functions are defined, invoke initialize at the bottom:
initializeScreen(); 