import React from "react";
import { MenuItem, Box, Typography, Avatar } from "@mui/material";
import { styles } from "./styles.style";


const NotificationItem = ({
notification,
  onClick,
  isRead,
  className,

}) => {

  return (
    <MenuItem
            onClick={() => onClick(notification)}
            sx={{
              ...styles.notificationItem
            }}
            className={className}
          >
            <Box sx={styles.notificationInfoContainer}>
              <Box sx={styles.notificationAvatarContainer}>
             
          
              </Box>
              <div>
                <Typography
                  variant="body1"
                  sx={{
                    ...styles.notificationMessage,
                    ...(isRead  &&
                      styles.readNotification)
                  }}
                >
                  {notification.title}
                </Typography>
                {/* <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={styles.notificationDate}
                >
                  {formatDate(notification.created_at)}
                </Typography> */}
              </div>
            </Box>
          </MenuItem>
  );
};

export default NotificationItem;