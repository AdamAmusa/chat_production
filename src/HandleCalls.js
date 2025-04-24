import React from 'react';
import { CardContent, CardHeader, IconButton } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { useCallStatus, useDeclineCall, useMakeCall, useReceiveCall } from './WebRtc';
import Card from '@mui/material/Card';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { Box } from '@mui/material';




const CallStatus = {
  IDLE: 'idle',
  PENDING: 'pending',
  ONGOING: 'ongoing',
  ENDED: 'ended'
};





export const HandleCalls = () => {
  const [callStatus, setCallStatus] = useCallStatus();
  const receiveCall = useReceiveCall();
  const declineCall = useDeclineCall();
  return (
    <div>
      {callStatus === CallStatus.PENDING
        && <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <Card
            sx={{
              width: '200px',
              height: '100px',
              position: 'absolute',
              right: 300,
              top: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardHeader title="Incoming Call" sx={{padding: '8px','& .MuiCardHeader-title': {fontSize: '0.9rem', alignItems:'center'}}}/>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                width: '100%',
                padding: '5px',
                flexGrow: 1,
                gap: 8,
              }}
            >
              <IconButton sx={{ p: 0 }} onClick={receiveCall}>
              <CallIcon sx={{ fontSize: "3vh", color: "green"}} />
              </IconButton>
              <IconButton sx={{ p: 0 }} onClick={declineCall}>
              <CallEndIcon sx={{ fontSize: "3vh", color: "red" }} />
              </IconButton>
            </CardContent>
          </Card>
        </Box>}

      <IconButton sx={{ p: 0 }} onClick={useMakeCall()}>
        <VideoCallIcon sx={{ fontSize: "4.5vh", color: "inherit" }} />
      </IconButton>
    </div>
  );
};

export default HandleCalls;