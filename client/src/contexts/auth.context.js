import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");
  const expiresAt = localStorage.getItem("expiresAt");

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
    return new Date().getTime() / 1000 < authState.expiresAt;
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
      {children}
    </Provider>
  );
};

const useStateValue = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useStateValue };
