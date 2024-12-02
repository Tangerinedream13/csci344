import React, { useState, useEffect } from "react";
import { getDataFromServer } from "../server-requests";

export default function Profile({ token }) {
    const [profile, setProfile] = useState(null);

    async function getProfile() {
        const data = await getDataFromServer(token, "/api/profile");
        setProfile(data); // state variable setters always redraw the screen
    }
    // useEffect is a bult-in function designed to handle "side effects" when the page first loads
    useEffect(() => {
        getProfile();
    }, []);
    return (profile &&
        <header className="flex gap-4 items-center">
            <img src={profile.thumb_url} alt="Profile Picture" className="w-16 rounded-full" />
            <h2 className="font-Comfortaa font-bold text-2x1">{profile.username}</h2>
        
        </header>
    );
    
}
