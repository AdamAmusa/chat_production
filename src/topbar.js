import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Search from './Search';
import HandleCalls from './HandleCalls';
import { Avatar, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useContext, useState, useEffect } from 'react';
import { ChatContext } from './ChatContext';
import { getUserDetails } from './ProfileActions';

const TopBar = () => {
  const [user, setUser] = useState(null);
  const { data } = useContext(ChatContext);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (data?.user?.uid) {
        const userData = await getUserDetails(data.user.uid);
        setUser(userData);
      }
    };

    fetchUser();
  }, [data?.user?.uid]);


  const handleProfileMenuClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="primary" enableColorOnDark sx={{
        zIndex: 1, bgcolor: 'background.default'

      }}>
        <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ position: "relative", right: 12 }}>
            <Search />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {/* Right side content */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Start a video call">
              <HandleCalls />
            </Tooltip>

            <IconButton sx={{ p: 0, ml: 3, mr: 2 }} onClick={handleProfileMenuOpen}>
              <Avatar
                src={user?.photoURL || 'https://via.placeholder.com/150'}
                alt={user?.displayName}></Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={isOpen}>
        <DialogTitle>Profile</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleProfileMenuClose}
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
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user?.photoURL || 'https://via.placeholder.com/150'}
                alt={user?.displayName}
                sx={{
                  width: 80,
                  height: 80,
                  marginBottom: 2,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="div">{user?.displayName}</Typography>
            </Box>  
            <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            <Typography variant="body2" color="text.secondary">{user?.bio}</Typography>
          </Box>
        </DialogContent>
      </Dialog>




    </Box>
  );
};

export default TopBar;