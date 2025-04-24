import { Box, Divider, IconButton, List, ListItem, Link} from "@mui/material";
import { ChatBubble, PersonAdd, Settings } from "@mui/icons-material";
import Profile from "./Profile";
import { useLocation , Link as RouterLink} from "react-router-dom";



const SidebarIconButton = ({ to, icon, activePath }) => {
  const isActive = activePath === to;

  return (
    <IconButton
      component={RouterLink}
      to={to}
      sx={{
        color: isActive ? '#1976d2' : '', // Light blue if active
        transition: 'color 0.3s, transform 0.3s', // Smooth transition
        '&:hover': {
          color: '#1976d2', // Light blue on hover
          transform: 'scale(1.2)', // Slightly enlarge on hover
        },
      }}
    >
      {icon}
    </IconButton>
  );
};

function PersistantSidebar({ width }) {
  const location = useLocation();
  return (
    <Box
      sx={{
        width: width,
        bgcolor: 'background.paper',
        height: '100vh',
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 2,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        boxSizing: 'border-box',
      }}
    >
      <div>
       <List sx={{pt:10, gap:3, display: 'flex', flexDirection: 'column' }}>
       <ListItem>
            <SidebarIconButton
              to="/chatpage"
              icon={<ChatBubble sx={{ width: 35, height: 35, fontSize: '2rem' }} />}
              activePath={location.pathname}
            />
          </ListItem>
          <Divider />

          {/* Add Person Icon */}
          <ListItem>
            <SidebarIconButton
              to="/add"
              icon={<PersonAdd sx={{ width: 35, height: 35, fontSize: '2rem' }} />}
              activePath={location.pathname}
            />
          </ListItem>
          <Divider />

        <ListItem>
        <IconButton>
        <Settings  sx={{
              width: 35,
              height: 35,
              fontSize: '2rem', 
            }} />
         </IconButton>
        </ListItem>


          <Profile sidebarWidth = {width}/>
       </List>
      </div>
    </Box>
  );
}

export default PersistantSidebar;
