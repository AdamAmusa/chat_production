import { Box, Card, IconButton, Typography } from "@mui/material"
import { ClosedCaptionDisabledOutlined, VolumeUp, VolumeOff, ClosedCaptionOutlined } from "@mui/icons-material"
import { useEffect, useState, useRef } from "react"
import { useMediaStream } from "./MediaStreamContext";


export const useToggleVideo = () => {
    const { peerConnectionRef, isVideoOn, setIsVideoOn } = useMediaStream();
    const toggleVideo = () => {
        console.log("useToggleVideo called");
        if (peerConnectionRef.current) {
            const senders = peerConnectionRef.current.getSenders();
            const videoSenders = senders.filter(sender =>
                sender.track && sender.track.kind === 'video'
            );
            videoSenders.forEach(sender => {
                if (sender.track) {
                    sender.track.enabled = !isVideoOn;
                }
            });
        }
        setIsVideoOn(!isVideoOn);
    };
    return toggleVideo;
}


const VideoFunctions = ({ stream }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isCaptioned, setIsCaptioned] = useState(false);
    const [transcript, setTranscript] = useState("");
    const { peerConnectionRef } = useMediaStream();

    const toggleMute = () => {
        if (peerConnectionRef.current) {
            const senders = peerConnectionRef.current.getSenders();
            const audioSenders = senders.filter(sender =>
                sender.track && sender.track.kind === 'audio'
            );
            audioSenders.forEach(sender => {
                if (sender.track) {
                    sender.track.enabled = isMuted;
                }
            });
        }
        setIsMuted(!isMuted);
    }

    //captioning
    useEffect(() => {
        let ws;
        let mediaRecorder;

        if (isCaptioned && stream) {
            console.log("Caption enabled");
            const wsUrl = process.env.REACT_APP_WS_BASE_URL;
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('WebSocket connection opened');
                const audioTracks = stream.getAudioTracks();
                if (audioTracks.length > 0) {
                    const audioTrack = audioTracks[0];
                    mediaRecorder = new MediaRecorder(new MediaStream([audioTrack]));

                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
                            ws.send(event.data);
                        }
                    };

                    mediaRecorder.start(1000); // Send audio data every second
                }
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('Transcription data:', data);
                if (data.channel && data.channel.alternatives && data.channel.alternatives.length > 0) {
                    const transcript = data.channel.alternatives[0].transcript;
                    setTranscript(transcript);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            return () => {
                if (mediaRecorder) {
                    mediaRecorder.stop();
                }
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
            };
        }
    }, [isCaptioned, stream]);








    return (
        <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 1 }}>
            {
                isCaptioned && (
                    <IconButton onClick={() => setIsCaptioned(!isCaptioned)}>
                        <ClosedCaptionOutlined />
                    </IconButton>
                )
            }
            {
                !isCaptioned && (
                    <IconButton onClick={() => setIsCaptioned(!isCaptioned)}>
                        <ClosedCaptionDisabledOutlined />
                    </IconButton>
                )
            }

            {
                !isMuted && (
                    <IconButton onClick={toggleMute}>
                        <VolumeUp />
                    </IconButton>
                )
            }
            {
                isMuted && (
                    <IconButton onClick={toggleMute}>
                        <VolumeOff />
                    </IconButton>
                )
            }
            {
                transcript && (
                    <Card
                        sx={{
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            padding: 2,
                            borderRadius: 2,
                            maxWidth: "80%",
                            margin: "auto",
                            mt: 2,
                            alignSelf: "center",
                            
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            color="white"
                            align="center"
                            sx={{
                                fontWeight: 500,
                                letterSpacing: 0.5,
                            }}
                        >
                            {transcript}
                        </Typography>
                    </Card>

                )
            }


        </Box>
    )
}

export default VideoFunctions