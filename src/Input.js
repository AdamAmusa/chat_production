import { Box, TextField, Button, styled, IconButton} from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import { useContext, useState, useRef, useEffect} from "react";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ChatContext } from "./ChatContext";
import { v4 as uuid } from "uuid";
import { AuthContext } from "./context";
import { InsertPhoto, SentimentSatisfiedAltOutlined } from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";
import { useMediaStream } from "./MediaStreamContext";


const Input = () => {
    const [formValue, setFormValue] = useState('');
    const { data } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);
    const [isEmojiOpened, setIsEmojiOpened] = useState(false);
    const emojiPickerRef = useRef(null);
    const inputRef = useRef(null);
    const {isImageUploading, setIsImageUploading} = useMediaStream();
    const [file, setFile] = useState(null);

    const apiBase = process.env.REACT_APP_API_BASE_URL;
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setIsEmojiOpened(false);
            }
        };
        if (isEmojiOpened) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEmojiOpened]);

    const handleEmojiClick = (emojiData) => {
        setFormValue(prev => prev + emojiData.emoji);
        setIsEmojiOpened(false);
        inputRef.current.focus(); // Return focus to the input after emoji selection
    };

    const uploadFile = (selectedFile) => {
        setIsImageUploading(true);
        console.log("Uploading file loading...");
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('senderId', currentUser.uid);
        formData.append('id', uuid());
        formData.append('chatId', data.chatId);
        fetch(`${apiBase}api/upload`, {
            method: 'POST',
            body: formData
        }).then((response) => {
            setIsImageUploading(!isImageUploading);
            return response.json();
        }).then((data) => {
            console.log(data);
        })
        .finally(() => {
            console.log("File upload complete");
            setIsImageUploading(false);
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            uploadFile(selectedFile);

        }
    };

     const VisuallyHiddenInput = styled('input')({
            clip: 'rect(0 0 0 0)',
            clipPath: 'inset(50%)',
            height: 1,
            overflow: 'hidden',
            position: 'absolute',
            bottom: 0,
            left: 0,
            whiteSpace: 'nowrap',
            width: 1,
        });



    const sendMessage = async (e) => {
        e.preventDefault();
        const trimmedValue = formValue.trim();
        if (!trimmedValue) return;
        console.log("send message" + data.chatId);
        await updateDoc(doc(db, "messages", data.chatId), {
            messages: arrayUnion({
                id: uuid(),
                message: formValue,
                senderId: currentUser.uid,
                date: Timestamp.now()
            })

        })

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                message: formValue,
            },
            [data.chatId + ".date"]: serverTimestamp()
        })

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                message: formValue,
            },
            [data.chatId + ".date"]: serverTimestamp()
        })

        setFormValue('');

    };


    return (
        <Box component="div" width={"100%"} position="relative" ref={emojiPickerRef}>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <TextField
                    size="small"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="Type a message..."
                    inputRef={inputRef}
                    disabled={isImageUploading}
                    sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                        },
                    }}
                />
                
                <div ref={emojiPickerRef} style={{ position: 'relative' }}>
                    <IconButton onClick={() => setIsEmojiOpened(!isEmojiOpened)}>
                        <SentimentSatisfiedAltOutlined sx={{ fontSize: "4vh" }} />
                    </IconButton>
                    {isEmojiOpened && (
                        <div  style={{ position: 'absolute', bottom: '50px', right: '0', zIndex: 1000 }}>
                            <EmojiPicker 
                                onEmojiClick={handleEmojiClick}
                                disabled={isImageUploading}
                                width={300}
                                height={400}
                            />
                        </div>
                    )}
                </div>
                
                <IconButton
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    disabled={isImageUploading}
                >
                    <InsertPhoto sx={{ fontSize: "4vh" }} />
                    <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                    />
                </IconButton>
                
                <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    endIcon={<SendIcon />}
                    sx={{ height: '40px' }}
                    disabled={isImageUploading}
                >
                    Send
                </Button>
            </form>
        </Box>
    )
}
export default Input;