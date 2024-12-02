import React, {useState} from "react"; 
import { postDataToServer, deleteDataFromServer } from "../server-requests"

// Job:
    // 1. Renders the bookmark (reflecting whether
    // the current user has bookmarked or not)
    // 2. Create / delete bookmarks

export default function Bookmark({ token, bookmarkId, postId }) {
    console.log("BookmarkID", bookmarkId)
    const [stateBookmarkId, setStateBookmarkId] = useState(bookmarkId);

    async function createBookmark() {
        const sendData = {
            post_id: postId,
        };
        const responseData = await postDataToServer(
            token, 
            "/api/bookmarks/", 
            sendData
        );
        console.log(responseData);
        setStateBookmarkId(responseData.id);
    }

    async function deleteBookmark() {
        const responseData = await deleteDataFromServer(
            token, 
            "/api/bookmarks/" + stateBookmarkId
        );
        console.log(responseData);
        setStateBookmarkId(null);
    }

    console.log(stateBookmarkId);
    if (stateBookmarkId) {
        return (
            <button 
                role="switch"
                aria-label="Unbookmark This Post" 
                aria-checked="true"
                tabIndex="0"
                onClick={deleteBookmark}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault(); 
                        deleteBookmark();
                    }
                }}
            >
                <i className="fas fa-bookmark"></i>
            </button>
        );
    } else {
        return (
            <button 
                role="switch"
                aria-label="Bookmark This Post" 
                aria-checked="false" 
                tabIndex="0"
                onClick={createBookmark}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault(); 
                        deleteBookmark();
                    }
                }}
            >
                <i className="far fa-bookmark"></i>
            </button>
        );
    }
}

