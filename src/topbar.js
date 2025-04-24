import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Search from './Search';
import HandleCalls from './HandleCalls';
import { Avatar } from '@mui/material';
import { useContext, useState, useEffect } from 'react';
import { ChatContext } from './ChatContext';
import { getUser } from './Authentication';

const TopBar = () => {
  const [user, setUser] = useState(null);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (data?.user?.uid) {
        const userData = await getUser(data.user.uid);
        setUser(userData);
      }
    };
    
    fetchUser();
  }, [data?.user?.uid]); // Re-run when uid changes

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="primary" enableColorOnDark sx={{ zIndex: (theme) => theme.zIndex.drawer, bgcolor: 'background.default'

       }}>
        <Toolbar variant="dense"  sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{position: "relative", right:12}}>
      <Search />
      </Box>
          <Box sx={{ flexGrow: 1 }} />
          {/* Right side content */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Start a video call">
              <HandleCalls />
            </Tooltip>

            <IconButton sx={{ p: 0, ml: 3, mr: 2 }}>
             <Avatar
                  src={user?.photoURL || 'https://via.placeholder.com/150'}
                  alt={user?.displayName}></Avatar>

            </IconButton>

          </Box>
        </Toolbar>


      </AppBar>
    </Box>
  );
};

export default TopBar;