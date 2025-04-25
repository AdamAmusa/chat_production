import React, { useState, useContext, useEffect } from "react";
import { Box, IconButton, Card, Dialog, DialogTitle, DialogContent, Avatar, Button, Divider, TextField, Typography, CircularProgress } from "@mui/material";
import { Close, Edit } from "@mui/icons-material";
import { auth } from "./firebaseConfig";
import { useSignOut } from "./Authentication";
import { updateBio, updateDisplayName, getUserDetails } from './ProfileActions';
import { ChatContext } from "./ChatContext";
import { AuthContext } from "./context";


const Profile = ({ sidebarWidth }) => {
    
    const [isOpen, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { currentUser } = useContext(AuthContext)
    const [value, setValue] = useState(auth.currentUser?.displayName);

    const [hasChanges, setHasChanges] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { data } = useContext(ChatContext);
    const signOut = useSignOut();
    const [userDetails, setUserDetails] = useState(null);
    const [bio, setBio] = useState(''); 
    const [hasFetched, setHasFetched] = useState(false); 
    
    const apiBase = process.env.REACT_APP_API_BASE_URL;

   
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserDetails(auth.currentUser?.uid);
                console.log('Fetched user data:', userData);
                
                if (userData) {
                    setUserDetails(userData);
                    setBio(userData.bio || '');
                    setHasFetched(true);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setHasFetched(true); 
            }
        };
    
        if (!hasFetched || !bio) {
            fetchUser();
        }
    }, [bio, hasFetched]); 
    

    useEffect(() => {
        if (userDetails?.bio && !hasChanges) {
            console.log('Syncing bio from userDetails:', userDetails.bio); 
            setBio(userDetails.bio);
        }
    }, [userDetails?.bio, hasChanges]);



    const handleSave = () => {
        setIsEditing(false);
        setHasChanges(false);
        updateDisplayName(value);
        updateBio(bio);
    };



    const handleProfileMenuOpen = () => {
        setValue(auth.currentUser?.displayName);
        
        setOpen(true);
    };

    const handleProfileMenuClose = () => {
        setOpen(false);
        setIsEditing(false);
        setHasChanges(false);
        setBio(userDetails?.bio);
        setValue(auth.currentUser?.displayName);
    };

    const closeandSignOut = async () => {
        handleProfileMenuClose();

        await signOut();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            uploadFile(selectedFile);

        }
    };



    const uploadFile = async (selectedFile) => {
        try {
            setUploading(true);
            const user = auth.currentUser;
            if (!user) throw new Error("Not authenticated");

            const token = await user.getIdToken();

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('id', currentUser.uid);
            const response = await fetch(`${apiBase}/api/upload-profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
                .finally(() => {
                    setUploading(false);
                })
            if (response.ok) {

            }

            return await response.json();
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    };


    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Card
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    backgroundColor: '#f9f9f9',
                    width: sidebarWidth - 1,
                    height: '80px',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%' }}>
                    <IconButton size="small" onClick={handleProfileMenuOpen} color="inherit">
                        <Avatar
                            src={auth.currentUser?.photoURL}
                            alt={auth.currentUser?.displayName}
                        />
                    </IconButton>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontSize: '0.8rem' }}>{auth.currentUser?.displayName}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.8rem', color: 'grey' }}>{auth.currentUser?.email}</Typography>
                    </Box>
                </Box>
            </Card>

            <Dialog open={isOpen}>
                <DialogTitle>Profile</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleProfileMenuClose}
                    disabled={uploading}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'grey',
                    }}
                >
                    <Close />
                </IconButton>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                        <Box sx={{ position: 'relative', '&:hover .edit-avatar-button': { display: 'flex' } }}>
                            <Avatar
                                src={auth.currentUser?.photoURL || 'https://via.placeholder.com/150'}
                                alt={auth.currentUser?.displayName}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    marginBottom: 2,
                                }}
                            />

                            <IconButton
                                className="edit-avatar-button"
                                component="label"
                                disabled={uploading}
                                sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 0,
                                    display: 'none',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    },
                                }}

                            >   {!uploading && (
                                <Edit fontSize="small" />
                            )}
                                {uploading && (
                                    <CircularProgress />
                                )}
                                <input
                                    disabled={uploading}
                                    type="file"
                                    onChange={handleFileChange}
                                    multiple
                                    accept="image/*"
                                    hidden // hides the input visually, but still clickable via the label
                                />
                            </IconButton>

                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isEditing ? (
                                <>
                                    <TextField
                                        variant="standard"
                                        value={value}
                                        onChange={(e) => {
                                            setValue(e.target.value);
                                            setHasChanges(true);
                                        }}
                                        autoFocus

                                    />

                                </>
                            ) : (
                                <>
                                    <Typography variant="h6">{value}</Typography>
                                    <IconButton size="small" onClick={() => setIsEditing(true)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <>
                                <TextField
                                    variant="standard"
                                    multiline
                                    rows={8}
                                    value={bio}
                                    fullWidth
                                    placeholder="Write a bio..."
                                    onChange={(e) => {
                                        setBio(e.target.value);
                                        setHasChanges(true);
                                    }}
                                    autoFocus
                                    slotProps={{ htmlInput: { maxLength: 100 } }}
                                />

                            </>

                        </Box>

                        <Divider />
                        {hasChanges && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                sx={{ marginTop: 2 }}
                            >
                                Save Changes
                            </Button>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Profile;