import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import ChatList from './chatList';
import Messages from './Messages';
import Input from './Input';
import TopBar from './topbar';
import Profile from './Profile';

const sidebarWidth = '25%'; // Using percentage for consistent relative width



const ChatPage = () => {
    return (
        <Box sx={{ 
            display: 'flex', 
            height: '100vh',
            overflow: 'hidden'
        }}>
            {/* Left sidebar */}
            <Box sx={{
                width: sidebarWidth,
                minWidth: sidebarWidth,
                height: '100vh',
                borderRight: '1px solid #ccc',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative', 
                overflow: 'hidden',
                zIndex: 1
            }}>
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    
                }}>
                    <ChatList />
                </Box>
            </Box>

            {/* Right main content area */}
            <Box sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden'
            }}>
                <TopBar />
                <Box sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                    pt: 8,
                    overflowX: 'hidden'
                }}>
                    <Messages />
                </Box>
                <AppBar 
                    position='sticky' 
                    color="inherit" 
                    sx={{ 
                        top: 'auto', 
                        bottom: 0, 
                        height: '80px', 
                        width: '100%' 
                    }}
                >
                    <Toolbar sx={{ 
                        display: 'flex', 
                        justifyContent: 'end', 
                        alignItems: 'center', 
                        height: '100%' 
                    }}>
                        <Input />
                    </Toolbar>
                </AppBar>
            </Box>
        </Box>
    );
};

export default ChatPage;