import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useAuth } from "../AuthContext/AuthProvider";
import { getToken } from "../api/api";
const useEcho = (channelName, event, callback) => {

    const [token, setToken] = useState(null);
    const {user}= useAuth();
    useEffect(() => {
        const fetchToken = async () => {
          try {
            const token = await getToken();
            setToken(token);
          } catch (error) {
            console.error("Failed to fetch authentication token:", error);
          }
        };
    if(user){
      fetchToken();
    }
      }, [user]);
  useEffect(() => {
    if (!token) {
      return;
    }else{

    window.Pusher = Pusher;
    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'laravel-key',
      cluster: 'eu',
      authEndpoint: 'http://localhost:8000/broadcasting/auth',
      wsHost: "127.0.0.1",
      wsPort: 6001,
      useTLS: true,
      forceTLS: false,
      disableStats: true,
      auth: {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    });
    window.Echo.private(channelName).listen(event, callback);

    return () => {
      window.Echo.leave(channelName);
    };
}

  }, [channelName, event, callback, token]);
};

export default useEcho;
