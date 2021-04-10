import React, { createContext, useContext, useEffect } from "react";
import axios from "axios";

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {
  const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    const getCSRF = async () => {
      const { data } = await authAxios.get("/csrf-token");
      authAxios.defaults.headers["X-CSRF-TOKEN"] = data.csrfToken;
    };

    getCSRF();
  }, [authAxios]);

  return (
    <Provider
      value={{
        authAxios,
      }}
    >
      {children}
    </Provider>
  );
};

const useAxios = () => useContext(FetchContext);

export { FetchContext, FetchProvider, useAxios };
