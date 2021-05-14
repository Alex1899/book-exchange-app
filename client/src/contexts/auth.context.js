import React, { createContext, useContext, useState} from "react";
import { useHistory} from "react-router-dom"
import AlertDialog from "../components/alert-dialog/alert-dialog.component"

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");
  const expiresAt = localStorage.getItem("expiresAt");
  const [alert, setAlert] = useState({ show: false, text: "" });
  const history = useHistory();

  const [authState, setAuthState] = useState({
    expiresAt,
    userInfo: userInfo ? JSON.parse(userInfo) : {},
  });

  const setAuthInfo = ({ userInfo, expiresAt }) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("expiresAt", expiresAt);

    setAuthState({
      userInfo,
      expiresAt,
    });
  };

  const updateAvatar = (avatar) => {
    let updatedUserInfo = { ...authState.userInfo, avatar };
    localStorage.setItem("userInfo", JSON.stringify({ ...updatedUserInfo }));
    setAuthState({ ...authState, userInfo: updatedUserInfo });
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("expiresAt");
    setAuthState({});
  };

  const isAuthenticated = () => {
    if (!authState.expiresAt) {
      return false;
    }
    if (!(new Date().getTime() / 1000 < authState.expiresAt)) {
      logout();
      if (
        history.location.pathname === "/list-book" ||
        history.location.pathname === "/profile"
      ) {
        history.push("/");
      }
      setAlert({ show: true, text: "Session expired. Please login again to access list-book and profile page :)" });
      return false;
    }
    return true;
  };

  return (
    <Provider
      value={{
        userInfo: authState.userInfo,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        logout,
        updateAvatar,
        isAuthenticated,
      }}
    >
       {alert.show && (
        <AlertDialog
          show={alert.show}
          handleClose={() => setAlert({ ...alert, show: !alert.show })}
          text={alert.text}
        />
      )}
      {children}
    </Provider>
  );
};

const useStateValue = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useStateValue };
