import React, { useState, useEffect } from "react";
import { getDataFromServer } from "../server-requests";
import Post from "./Post";
// Job: 
// 1. fetch posts from the server
// 2. It iterates through each element and draws a Post component 
export default function Posts({ token }) {

    // State variables: every time a state variable getrs set, it
    // redraws the component
    const [posts, setPosts] = useState([]);

    async function getPosts() {
        // fetches data from https://photo-app-secured.herokuapp.com/api/posts/
        const data = await getDataFromServer(token, "/api/posts");
        setPosts(data); // state variable setters always redraw the screen
    }
    // useEffect is a bult-in function designed to handle "side effects" when the page
    // first loads:
    useEffect(() => {
        getPosts();
    }, []);

    function outputPost(postObj) {
        return <Post token={token} key={postObj.id} postData={postObj} /> 
    }
    return (

        <div>
            {
                posts.map(outputPost) 
            }
        </div>
    );
}
