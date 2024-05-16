import { useCallback, useEffect, useState } from "react";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthProvider";
import MenuIcon from "@mui/icons-material/Menu";
import { ListItemIcon } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { getNotifications, resetUnreadNotifications } from "../api/api";
import Notifications from "./notifications/Notifications";
import useEcho from "./useEcho";
const Navigation = () => {
  const { user, logout, unreadNotificationsCount, setUnreadNotificationsCount } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fetchingNotifications, setFetchingNotifications] = useState(false);
 
  const navigate = useNavigate();



  

useEcho(`notification.${user?.id}`, ".notification.created", ( e) => {
  console.log("Notification event fired:");
  if(user){
    fetchNotifications();
    setUnreadNotificationsCount((prevUnreadCount) => prevUnreadCount + 1);

  }
});

  // notification.'.$this->notification->user_id
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };


  const handleClickNotificationClose = () => {
    setOpenNotification(false);
  };
  const fetchNotifications = async () => {
    try {
      setFetchingNotifications(true);

      const notificationsData = await getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      //
    } finally {
      setFetchingNotifications(false);
    }
  };
  const resetUnread = async () => {
    try {
      const resp = await resetUnreadNotifications();
      
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  const handleClickNotification = () => {
    setOpenNotification((pre) => !pre);
    if(unreadNotificationsCount > 0){
      resetUnread();
      setUnreadNotificationsCount(0);
    }
  
    if(user && notifications.length === 0){
      fetchNotifications();
    }
  };

  const getMenuButtons = () => {
    if (user) {
      const buttons = [{ label: "Accueil", link: "/", icon: <HomeIcon /> }];
      if (user.role === "Formateur") {
        buttons.push(
          {
            label: "Gestion des Formations",
            link: "/training-management",
            icon: <SettingsIcon />
          },
          { label: "Mes Formations", link: "/formations", icon: <SchoolIcon /> }
        );
      } else if (user.role === "Participant") {
        buttons.push({
          label: "Dashboard",
          link: "/dashboard",
          icon: <DashboardIcon />
        });
      }

      return buttons.map(({ label, link, icon }) => ({
        label,
        link,
        icon: <ListItemIcon>{icon}</ListItemIcon>
      }));
    }

    return [
      { label: "Accueil", link: "/", icon: <HomeIcon /> },
      { label: "S'inscrire", link: "/register", icon: <AccountCircleIcon /> },
      { label: "Se Connecter", link: "/login", icon: <AccountCircleIcon /> }
    ].map(({ label, link, icon }) => ({
      label,
      link,
      icon: <ListItemIcon>{icon}</ListItemIcon>
    }));
  };

  return (
    <AppBar
      position="static"
      sx={{ height: "60px", backgroundColor: "#fafafa", color: "#111827" }}
    >
      {isMobile ? (
        <>
          <Grid
            sx={{
              marginRight: "10px",
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Box sx={{position: "relative",width:"100%",display:"flex",justifyContent:"space-between"}}>

            <IconButton color="inherit" onClick={toggleDrawer(!drawerOpen)}>
              <MenuIcon sx={{ fontSize: "30px" }} />
            </IconButton>
            <IconButton onClick={handleClickNotification}>
            <Badge badgeContent={unreadNotificationsCount}  color="error">
              <NotificationsIcon sx={{ fontSize: "27px", color: "#111827" }} />
            </Badge>
            </IconButton>
            {openNotification && (
                <Box sx={{position: "absolute", right: 10,top: 40,zIndex: 1}}>
              <Notifications
              notifications={notifications}
              loading={fetchingNotifications}
              />
              </Box>
            )}
            </Box>
          </Grid>
        </>
      ) : (
        <Grid
          container
          display={"flex"}
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            marginLeft: "30px",
            textTransform: "none",
            gap: "0px 30px",
            height: "100%"
          }}
        >
          {user && (
            <Typography
              variant="body1"
              sx={{ marginRight: "10px", fontSize: "18px", fontWeight: "bold" }}
            >
              Bienvenue {user?.prenom}
            </Typography>
          )}
          {getMenuButtons().map((button, index) => (
            <Button
              key={index}
              color="inherit"
              component={Link}
              sx={{ textTransform: "none" }}
              to={button.link}
              onClick={() => toggleDrawer(false)}
            >
              {button.label}
            </Button>
          ))}
          <Box sx={{position: "relative"}}>

          <IconButton>
            <Badge badgeContent={unreadNotificationsCount}  color="error">
            <NotificationsIcon
              onClick={handleClickNotification}
              sx={{ fontSize: "27px", color: "#111827" }}
            />
            </Badge>
          </IconButton>
          {openNotification && (
            <Box sx={{position: "absolute", left: 0,zIndex: 10}}>

            <Notifications
            notifications={notifications}
            loading={fetchingNotifications}
            />
            </Box>
          )}
          </Box>
          {user && (
            <Button
              color="inherit"
              sx={{ margin: "10px 0", textTransform: "none", color: "#ef4444" }}
              onClick={handleLogout}
            >
              Se déconnecter
            </Button>
          )}
        </Grid>
      )}
    
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: "280px" }}>
          {user && (
            <ListItem sx={{ margin: "10px 0" }}>
              <Typography
                variant="body1"
                sx={{
                  marginRight: "10px",
                  fontSize: "18px",
                  fontWeight: "bold"
                }}
              >
                Bienvenue {user?.prenom}
              </Typography>
            </ListItem>
          )}
          <Divider sx={{ margin: "10px 0" }} />

          {getMenuButtons().map((button, index) => (
            <ListItemButton
              key={index}
              // disablePadding

              // component={Link}
              sx={{ textDecoration: "none", color: "inherit", width: "280px" }}
              onClick={() => {
                toggleDrawer(false);
                navigate(button.link);
              }}
            >
              <ListItemIcon>{button.icon}</ListItemIcon>
              <ListItemText primary={button.label} />
            </ListItemButton>
          ))}
          <Divider sx={{ margin: "10px 0" }} />

          {user && (
            <ListItemButton
              onClick={handleLogout}
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemText
                primary="Se déconnecter"
                sx={{
                  margin: "10px 0",
                  textTransform: "none",
                  color: "#ef4444"
                }}
              />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navigation;
