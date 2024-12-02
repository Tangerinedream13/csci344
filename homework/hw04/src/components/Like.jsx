import React, {useState} from "react"; 
import { postDataToServer, deleteDataFromServer } from "../server-requests"
export default function Like({ token,likeId, postId }) {
    console.log(likeId);
        const [stateLikeId, setStateLikeId] = useState(likeId);
        async function createLike() {
            const sendData = {
                "post_id": postId,
            }
            console.log(sendData);
            console.log ("Creating Like");
            const responseData = await postDataToServer(token,"/api/likes/", sendData);
            console.log (responseData);
            setStateLikeId(responseData.id);
        }
            async function deleteLike() {
                const url= '/api/likes/'+stateLikeId;
                console.log("Deleting Like");   
                const responseData = await deleteDataFromServer(token,url);
                console.log(responseData);
                setStateLikeId(null);
        }
        console.log(stateLikeId);
        if (stateLikeId) {
            return (
                <button
                    onClick={deleteLike}
                    role="switch"
                    aria-label="Unlike this post"
                    aria-checked="true"
                >
                    <i className="fas text-red-700 fa-heart"></i>
                </button>
            );
        } else {
            return (
                <button
                    onClick={createLike}
                    role="switch"
                    aria-label="Like this post"
                    aria-checked="false"
                    tabIndex="0" 
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault(); // Prevent scrolling on Space key
                            createBookmark();
                        }
                    }}
                >
                    <i className="far fa-heart"></i>
                </button>
            );
        }
    }