import React from "react";

export default function Suggestion({ suggestionData }) {
    console.log("data should be here")
    console.log(suggestionData);
    function suggPart(){
        return(
        <section className="flex justify-between items-center mb-4 gap-2">  
        <img src={suggestionData.thumb_url} className="rounded-full" />
        <div className = "w-[180px]">
            <p className="font-bold text-sm">{suggestionData.username}</p>  
            <p className="text-gray-400">suggested for you</p>
        </div>
        <button className="text-blue-500 text-sm py-2">follow</button>
        </section>    
        ); 
    };
        return (
                suggPart()
            );
        }
    
    

    