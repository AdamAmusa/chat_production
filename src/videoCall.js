import React, { useRef, useEffect, useState } from 'react';
import { Avatar, Box, Card, CardContent, IconButton } from '@mui/material';
import { useMediaStream } from './MediaStreamContext';
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideoFunctions, { useToggleVideo } from './videoFunctions';
import { useEndCall } from './WebRtc';

const VideoCall = () => {
    const { localStream, remoteStream } = useMediaStream();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const endCall = useEndCall();

    const [micOn, setMicOn] = useState(true);
    const {isVideoOn, setIsVideoOn} = useMediaStream();
    const toggleVideo = useToggleVideo();

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            console.log("Local Stream is ", localStream);
            console.log("Local Stream Tracks: ", localStream.getTracks());
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            console.log("Remote Stream is ", remoteStream);
            console.log("Remote Stream Tracks: ", remoteStream.getTracks());
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const toggleMic = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach((track) => {
                track.enabled = !micOn; // Toggle the enabled property
            });
        }
        setMicOn(!micOn); // Update the state
    };

    return (
        <Box
            component="ul"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 0, m: 0 }}>

            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Card component="li" sx={{ minWidth: 500, minHeight: 300, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <CardContent>
                        {console.log("Local Video here  " + localStream)}
                        {
                            localStream ? (
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    style={{ width: '100%', maxHeight: '400px' }}
                                />
                            ) : (
                                <Avatar sx={{ width: 80, height: 80 }}></Avatar>
                            )}
                    </CardContent>
                </Card>
                <Card component="li" sx={{ minWidth: 500, minHeight: 300, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <CardContent>
                        <Box>
                            {console.log("Remote Video here  " + remoteStream)}

                            {
                                remoteStream && remoteStream.getTracks().length > 0 ? (
                                    <video
                                        ref={remoteVideoRef}
                                        autoPlay
                                        playsInline
                                        style={{ width: '100%', maxHeight: '400px' }}
                                    />
                                ) : (
                                    <Avatar sx={{ width: 80, height: 80 }}></Avatar>)}
                        </Box>
                    </CardContent>
                   <VideoFunctions stream={remoteStream} />
                </Card>

            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'fixed', bottom: 3 }}>

                {
                    micOn && (
                        <Box sx={{ backgroundColor: 'grey', borderRadius: '50%' }}>
                            <IconButton aria-label="mic" onClick={toggleMic}>
                                <MicRoundedIcon sx={{ fontSize: 42, color: 'white' }} />
                            </IconButton>
                        </Box>
                    )
                }
                
                {
                    !micOn && (
                        <Box sx={{ backgroundColor: 'grey', borderRadius: '50%' }}>
                            <IconButton aria-label="mic" onClick={toggleMic}>
                                <MicOffIcon sx={{ fontSize: 42, color: 'white' }} />
                            </IconButton>
                        </Box>
                    )
                }
                {console.log("Video is ", isVideoOn)}

                {
                    isVideoOn && (
                        <Box sx={{ backgroundColor: 'grey', borderRadius: '50%' }}>
                            <IconButton aria-label="mic" onClick={toggleVideo}>
                                <VideocamRoundedIcon sx={{ fontSize: 42, color: 'white' }} />
                            </IconButton>
                        </Box>
                    )
                }



                {
                    !isVideoOn && (
                        <Box sx={{ backgroundColor: 'grey', borderRadius: '50%' }}>
                            <IconButton aria-label="mic" onClick={toggleVideo}>
                                <VideocamOffIcon sx={{ fontSize: 42, color: 'white' }} />
                            </IconButton>
                        </Box>
                    )
                }

                
                

                <Box sx={{ backgroundColor: 'red', borderRadius: '50%' }}>
                    <IconButton aria-label="end call" onClick={endCall}>
                        <CallEndRoundedIcon sx={{ fontSize: 42, color: 'white' }} />
                    </IconButton>
                </Box>






            </Box>
        </Box>
    );
};

export default VideoCall;