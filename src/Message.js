import { useContext, useState, useEffect } from "react";
import { ChatContext } from "./ChatContext";
import { AuthContext } from "./context";
import { Paper, Box, Typography, Avatar, CircularProgress } from "@mui/material";
import { getUser, getUserDetails } from './ProfileActions';



const Message = ({ message, type }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const [otherUser, setOtherUser] = useState(null);

    const isSender = message?.senderId === currentUser?.uid;

    // Fetch other user's data when component mounts or data changes
    useEffect(() => {
        const fetchOtherUser = async () => {
            if (!isSender && data?.user?.uid) {
                const userData = await getUserDetails(data.user.uid);
                setOtherUser(userData);
            }
        };
        fetchOtherUser();
    }, [data?.user?.uid, isSender]);

    const formatDateTime = (timestamp) => {
        if (!timestamp) return '';

        let messageDate;
        if (timestamp.toDate) {
            messageDate = timestamp.toDate();
        } else if (timestamp instanceof Date) {
            messageDate = timestamp;
        } else {
            messageDate = new Date(timestamp);
        }
        const today = new Date();

        const isToday = messageDate.toDateString() === today.toDateString();

        if (isToday) {
            return messageDate.toLocaleTimeString('en-UK', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } else {
            return messageDate.toLocaleDateString('en-UK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        }
    };

    if (!message) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="text.secondary">No message to display.</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isSender ? 'flex-end' : 'flex-start',
                mb: 2,
                px: 2,
            }}
        >
            {!isSender && (
                <Avatar
                        src={otherUser?.photoURL || 'https://via.placeholder.com/150'}
                        alt={otherUser?.displayName}
                    sx={{
                        width: 32,
                        height: 32,
                        mr: 1,
                        mt: 'auto'
                    }}
                />
            )}

            <Box
                sx={{
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isSender ? 'flex-end' : 'flex-start',
                }}
            >
                <Paper
                    elevation={1}
                    sx={{
                        p: 1.5,
                        backgroundColor: isSender ? 'primary.main' : 'grey.100',
                        color: isSender ? 'white' : 'text.primary',
                        borderRadius: '16px',
                        borderTopRightRadius: isSender ? '4px' : '16px',
                        borderTopLeftRadius: isSender ? '16px' : '4px',
                        wordBreak: 'break-word',
                        maxWidth: 'auto',
                    }}
                >
                    {type === 'text' && (
                        <Typography variant="body1" fontSize={20}>
                            {message.message}
                        </Typography>
                    )}
                    {type === 'image' && (
                        <img src={message.image_url} alt="Uploaded" style={{ maxWidth: '100%' }} />
                    )}
                </Paper>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                        fontSize: '0.75rem',
                    }}
                >
                    {formatDateTime(message.date)}
                </Typography>

                
            </Box>

            {isSender && (
                <Avatar
                    src={currentUser?.photoURL || 'https://via.placeholder.com/150'}
                    alt={currentUser?.displayName}
                    sx={{
                        width: 32,
                        height: 32,
                        ml: 1,
                        mt: 'auto'
                    }}
                />
            )}

            
        </Box>
    );
};

export default Message;