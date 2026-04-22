import { createContext, useContext, useReducer, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.read).length,
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n._id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    unreadCount: 0,
  });

  const { user, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && accessToken) {
      fetchNotifications();
      // Poll every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, accessToken]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/v1/notifications", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // API returns data: { notifications: [...] }
      dispatch({
        type: "SET_NOTIFICATIONS",
        payload: response.data.data.notifications || [],
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `/api/v1/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      dispatch({ type: "MARK_AS_READ", payload: notificationId });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(
        "/api/v1/notifications/mark-all-read",
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      dispatch({ type: "MARK_ALL_READ" });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};
