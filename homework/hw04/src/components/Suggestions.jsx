import React, {useState, useEffect} from "react";
import { getDataFromServer } from "../server-requests";
import Suggestion from "./Suggestion.jsx";


export default function Suggestions({ token }) {
    const [suggestions, setSuggestions] = useState([]);

    async function getSuggestions() {
        console.log(token); 
        const data = await getDataFromServer(token, "/api/suggestions");

        console.log(data); 

        setSuggestions(data);

    }
    useEffect(() => {
        console.log("Querying for suggestions");
        getSuggestions();
    }, []); 
    console.log(suggestions); 

    function outputSuggestion(suggestionObj){
        return<Suggestion key={suggestionObj.id} suggestionData={suggestionObj}/>;
    }
    return (
        <div className="mt-4">
            <p className="text-base text-gray-400 font-bold mb-4">
                Suggestions for you
            </p>
       
        {
            suggestions.map(outputSuggestion)
        }
        </div>
    )
}
    

