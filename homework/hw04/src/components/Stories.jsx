import React, { useState, useEffect } from "react";
import { getDataFromServer } from "../server-requests";
import Story from "./Story.jsx";

// Job: 
// 1. fetch posts from the server
// 2. It iterates through each element and draws a Stories component 
export default function Stories({ token }) {

    // State variables: every time a state variable gets set, it
    // redraws the component
    const [stories, setStories] = useState([]);

    async function getStories() {
        // fetches data from https://photo-app-secured.herokuapp.com/api/stories/
        const data = await getDataFromServer(token, "/api/stories");
        console.log("Fetching stories:", data);
        setStories(data); // state variable setters always redraw the screen
    }
    // useEffect is a bult-in function designed to handle "side effects" when the page
    // first loads:
    useEffect(() => {
        getStories();
    }, []);

    function outputStories(storyObj) {
        console.log("Show story:", storyObj);
        return <Story 
            token={token} 
            key={storyObj.id} 
            storyData={storyObj} 
        /> 
    }
    return (

        <header class="flex gap-6 bg-white border p-2 overflow-hidden mb-6">
            {
                stories.map(outputStories) 
            }
       </header>
    );
}
