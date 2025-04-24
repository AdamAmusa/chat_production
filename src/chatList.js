import { Avatar, Badge, Box, Divider, List, ListItem, ListItemButton, Typography } from '@mui/material';
import { useContext, useState, useEffect, useRef } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { AuthContext } from './context';
import { db } from './firebaseConfig';
import { ChatContext } from './ChatContext';
import { markasRead } from './ProfileActions';

const ChatList = () => {

    const [chatList, setchatList] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);
    const autoscroll = useRef();

    const getChats = () => {
        const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (snapshot) => {
            setchatList(snapshot.data());
        });
        return () => unsub();
    };

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            getChats(currentUser.uid);
        }
    }, [currentUser]);

    const handleSelect = async (u) => {
        const chatId = currentUser.uid > u.uid
            ? currentUser.uid + u.uid
            : u.uid + currentUser.uid;

        await markasRead(currentUser.uid, chatId);
        dispatch({ type: "CHANGE_USER", payload: u });
        console.log("Stored!");

    }


    console.log(Object.entries(chatList));
    return (
        <Box >
            <List sx={{ width: "100%", top: 60 }}>
                <Typography sx={{ color: 'black', fontWeight: 'bold', alignItems: 'center', display: 'flex', fontSize: '2rem', pb: 2, pl: 1 }}>Messages</Typography>
                {Object.entries(chatList)?.map((chat) => (
                    <>
                        <ListItem disablePadding key={chat[0]} sx={{ justifyContent: 'center', pb: 1 }}>

                            <ListItemButton onClick={() => handleSelect(chat[1].userInfo)}>
                                <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                        <Avatar
                                            sx={{ width: 30, height: 30, color: "inherit" }}
                                            src={chat[1].userInfo.photoUrl || 'https://via.placeholder.com/150'}
                                            alt={chat[1].userInfo.displayName}
                                        />
                                        <Typography variant="body1" sx={{ ml: 2, ffontSize: '2rem', color: "black" }}>
                                            {chat[1].userInfo.displayName}
                                        </Typography>
                                    </Box><Badge
                                        color="error"
                                        variant="dot"

                                        invisible={chat[1].lastMessage?.read || chat[1].lastMessage?.senderId === currentUser.uid}
                                    >
                                        <Typography variant="body2" sx={{ ml: 0, fontSize: "15px", color: "grey", marginTop: 1 }}>
                                            {chat[1].lastMessage.message}
                                        </Typography></Badge>
                                </Box>
                            </ListItemButton>

                        </ListItem>

                        <Divider />
                    </>
                ))}

            </List>


            <div ref={autoscroll}></div>
        </Box>
    )
}

export default ChatList;
