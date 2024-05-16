
export const styles = {
    notificationContainer: {
      // position: "absolute",
      // top: "50px",
      // right: "10%",
      width: "360px",
      minHeight: "60px",
      zIndex: 1,
      backgroundColor: "#ffffff",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
      padding: "15px 0px 10px 10px",
      maxHeight: "400px", // Limit height and add overflow for scrollable notifications
      overflowY: "auto" // Add vertical scroll for overflow
    },
    notificationItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#f5f5f5" // Lighten hover background color
      },
      padding: "8px 12px", // Adjust padding for better spacing
      borderBottom: "1px solid #e0e0e0", // Add border between notifications
      fontSize: "14px", // Reduce font size for smaller text
      lineHeight: "1.5", // Adjust line height for better readability
      whiteSpace: "pre-wrap", // Allow text to wrap to the next line
      wordWrap: "break-word" // Ensure long words wrap instead of overflow
    },
    notificationTitle: {
      marginBottom: "8px",
      fontWeight: "bold",
      color: "#333",
      borderBottom: "1px solid #e0e0e0", // Add border between title and notifications
      paddingBottom: "8px", // Adjust padding for better spacing
      fontSize: "16px" // Adjust font size for title
    },
    notificationDate: {
      fontSize: "12px",
      color: "#777"
    },
    notificationMessage: {
      fontSize: "15px",
      fontFamily: "Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif",
      color: "#050505"
    },
    activeIndicator: {
      width: "15px",
      height: "15px",
      borderRadius: "50%",
      backgroundColor: "green",
      position: "absolute",
      bottom: "0",
      right: "7px"
    },
    readNotification: {
      color: "#65676B"
    },
    notificationInfoContainer:{ display: "flex", alignItems: "center" },
    notificationAvatarContainer: { position: "relative" },
    loadingNotificationContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: "5px"
    },
    notificationAvatar: {
      marginRight: "10px",
      width: "56px",
      height: "56px"
    },
    skeleton: {
      animationDuration: "1.5s" ,
     
    },
    skeletonAvatar:{ marginRight: "10px" },
    skeletonText:{ marginBottom: 4 },
    noNotificationContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px 0"
    },
    noNotificationMessage: {
      fontSize: "17px",
      color: "#65676B",
      fontFamily: "Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif",
      fontWeight: "bold",
    }
  };
  