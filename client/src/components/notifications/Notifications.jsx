import React from 'react'
import { styles } from './styles.style';
import { Box, ClickAwayListener, Typography } from '@mui/material';

const Notifications = ({notifications,loading}) => {


    const showNotifications = () => {
        return (
          <>
            {notifications.map((notification, index) => (
                <div key={index} style={styles.notificationItem}>
                        <Typography
                        variant="body1"
                        sx={{
                            ...styles.notificationMessage,
                            ...(notification.read  &&
                            styles.readNotification)
                        }}
                        >
                        {notification.title}
                        </Typography>
                </div>
                            
            ))}
          </>
        );
      };

      return (
        <ClickAwayListener   onClickAway={() => {}}>
          <Box sx={styles.notificationContainer} >
            <Typography variant="h6" sx={styles.notificationTitle}>
              Notifications
            </Typography>
            {!loading && notifications?.length > 0 && showNotifications()}
          </Box>
        </ClickAwayListener>
      );
}

export default Notifications