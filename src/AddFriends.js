import { Box, Card, CardContent, CardHeader, Typography, Input, List, ListItem, ListItemText, Button, Avatar, IconButton, CircularProgress } from "@mui/material";
import { acceptUser, handleSearch } from "./Search";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context";
import { isFriend, setUserInbox, useCheckUserInbox } from './ProfileActions';
import { ChatBubble, Close, Pending, PersonAdd } from "@mui/icons-material";
import { ChatContext } from "./ChatContext";






const AddFriends = () => {
    const { currentUser } = useContext(AuthContext);
    const [searchValue, setSearchValue] = useState('');
    const [user, setUser] = useState(null);
    const { requests, loading, error } = useCheckUserInbox(currentUser.uid);
    const { data, dispatch } = useContext(ChatContext);
    const [isFriendStatus, setIsFriendStatus] = useState(false);

    useEffect(() => {
        const checkFriendStatus = async () => {
            if (user && currentUser) {
                const status = await isFriend(currentUser.uid, user.uid);
                setIsFriendStatus(status);
            }
        };

        checkFriendStatus();
    }, [user, currentUser]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                            <CircularProgress />
                        </div>;
    if (error) return <p>Error loading inbox: {error.message}</p>;





    const submitKey = async (e) => {
        if (e.code === "Enter") {
            const result = await handleSearch(currentUser.uid, searchValue);
            setUser(result);

        }
    }
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
            }}
        >

            <Card variant="outlined" sx={{ width: '60%', height: '80%', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <CardHeader
                    title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Input
                                placeholder="Search for friends"
                                fullWidth
                                sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={submitKey}
                            />
                        </Box>
                    }
                />
                <CardContent>

                    {!user && (
                        <div>
                            <Typography variant="h6">Add Friends</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Use the search bar above to find and add friends.
                            </Typography>
                        </div>
                    )}

                    {user && !isFriendStatus && (
                        <Box sx={{ width: '100%', top: 80, flexDirection: 'row', display: 'flex', alignItems: 'center', padding: 2 }}>
                            <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 50, height: 50, marginRight: 2 }} />
                            {user?.displayName}
                            <IconButton
                                color="info"
                                onClick={() => {
                                    setUserInbox({ displayName: currentUser?.displayName, email: currentUser?.email, id: currentUser?.uid }, user?.uid, "pending");
                                    setUser({ ...user, status: "pending" }); // Update the user state to reflect the pending status
                                }}
                            >
                                {user?.status === "pending" ? <Pending /> : <PersonAdd />}
                            </IconButton>
                        </Box>
                    )}

                    {user && isFriendStatus && (
                        <Box sx={{ width: '100%', top: 80, flexDirection: 'row', display: 'flex', alignItems: 'center', padding: 2 }}>
                            <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 50, height: 50, marginRight: 2 }} />
                            {user?.displayName}
                            <IconButton color="primary" href="/chatpage" onClick={() => dispatch({ type: 'SET_CHAT_ID', payload: currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid })}>
                                <ChatBubble />
                            </IconButton>
                        </Box>
                    )}

                </CardContent>


                {Object.entries(requests).map(([userId, requestData]) => (
                    <Box sx={{ width: '100%', top: 80, flexDirection: 'row', display: 'flex', alignItems: 'center', padding: 2 }} key={userId}>
                        <Avatar src={requestData?.photoURL} alt={requestData.displayName} sx={{ width: 50, height: 50, marginRight: 2 }} />
                        {requestData.displayName}
                        <IconButton color="success" onClick={() => acceptUser(currentUser, requestData)}>
                            <PersonAdd />
                        </IconButton>
                        <IconButton color="error">
                            <Close />
                        </IconButton>
                    </Box>
                ))}
            </Card>
        </Box>
    );
};

export default AddFriends;