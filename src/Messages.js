import Message from "./Message";
import { useContext, useEffect, useState, useRef } from "react";
import { ChatContext } from "./ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { getLastConversation, setLastConversation } from "./Authentication";
import { AuthContext } from "./context";
import { CircularProgress, Box } from "@mui/material";
import { useMediaStream } from "./MediaStreamContext";



const Messages = () => {
    const { data, dispatch } = useContext(ChatContext);
    const {currentUser} = useContext(AuthContext);
    const [combinedMessages, setCombinedMessages] = useState([]);
    const containerRef = useRef();
    const loadRef = useRef();

    const [loading, setLoading] = useState(false);
    const {isImageUploading, setIsImageUploading} = useMediaStream();

    // Scroll to the bottom when new messages are added
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [combinedMessages]);

    // Fetch messages and sort them in reverse order
    useEffect(() => {
        if (data && data.chatId) {
            console.log("Pressed " + data.chatId);
            setLastConversation(data.chatId);
            setLoading(true);
            const unsub = onSnapshot(doc(db, "messages", data.chatId), (snapshot) => {
                if (snapshot.exists()) {
                    setLoading(false);
                    const messagesData = snapshot.data().messages || [];
                    const imagesData = snapshot.data().images || [];

                    // Combine and sort messages and images by date
                    const combinedData = [...messagesData, ...imagesData]
                        .filter(item => item?.date?.seconds !== undefined)
                        .sort((a, b) => b?.date?.seconds - a?.date?.seconds); 

                    setCombinedMessages(combinedData);
                }
            });

            return () => {
                unsub();
            };
        }
    }, [data.chatId]);

    useEffect(() => {
        const fetchLast = async () => {
            if (!data.chatId && currentUser?.uid) {
                const lastId = await getLastConversation();
                console.log("Fetched lastId:", lastId);
                console.log("Current chatId:", currentUser.uid);
                const otherUserId = lastId.replace(currentUser.uid, "");  
                console.log("Other user ID:", otherUserId);
                if (lastId && lastId !== data.chatId) {
                    dispatch({
                        type: 'CHANGE_USER',
                        payload: { uid: otherUserId }
                      });
                }
                else {
                    console.log("No lastId found or it matches the current chatId.");
                }
            }
        };
    
        fetchLast();
    }, [currentUser, data.chatId, dispatch]);
    

    return (
        <div
            ref={containerRef}
            style={{
                height: '100%',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse', 
                justifyContent: 'flex-start',
                overflowX: 'hidden',
            }}
            onLoad={() => {
                if (loadRef.current) {
                    loadRef.current.scrollTop = loadRef.current.scrollHeight;
                }
            }}
        >
            {isImageUploading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width: '100%',
                    }}
                >
                    <CircularProgress ref={loadRef} />
                </Box>
            )}

            {!loading && combinedMessages.map((msg, index) => (
                <Message key={index} message={msg} type={msg.image_url ? "image" : "text"} />
            ))}

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <CircularProgress />
                </div>
            )}
        </div>
    );
};

export default Messages;