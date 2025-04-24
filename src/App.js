import './App.css';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import SignUp from './SignUp';
import ChatPage from './chatPage';
import { AuthContext } from './context';
import { useContext } from 'react';
import VideoCall from './videoCall';
import { ProtectedRoutes } from './ProtectedRoutes';
import { Navigate } from 'react-router-dom';
import PersistantSidebar from './PersistantSidebar';
import { Box } from '@mui/material';
import AddFriends from './AddFriends';

const sidebarWidth = 150;

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Router>
      <MainLayout currentUser={currentUser} />
    </Router>
  );
}

function MainLayout({ currentUser }) {
  const location = useLocation(); // Now inside a Router context
  const showSidebar = location.pathname === '/chatpage' || location.pathname === '/call' || location.pathname === '/add';

  return (
    <Box sx={{ display: 'flex' }}>
      {showSidebar && <PersistantSidebar width={sidebarWidth} />}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: showSidebar ? `${sidebarWidth}px` : 0, // Adjust margin if sidebar is shown
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={currentUser ? <Navigate to="/chatpage" /> : <Navigate to="/login" />} />
          <Route path="/chatpage" element={<ProtectedRoutes><ChatPage /></ProtectedRoutes>} />
          <Route path="/call" element={<ProtectedRoutes><VideoCall /></ProtectedRoutes>} />
          <Route path ="/add" element={<ProtectedRoutes><AddFriends/></ProtectedRoutes>} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;