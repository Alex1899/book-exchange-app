import React, { createContext, useContext, useReducer, useEffect } from "react";
import logger from "use-reducer-logger";
export const StateContext = createContext();

function StateProvider({ reducer, initialState, children }) {
  const [state, dispatch] = useReducer(
    process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
    initialState,
    () => {
      const appState = localStorage.getItem("book-exchange-state");
      return appState ? JSON.parse(appState) : initialState;
    }
  );

  useEffect(() => {
    localStorage.setItem("book-exchange-state", JSON.stringify(state));
  }, [state]);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateValue = () => useContext(StateContext);

export default StateProvider;
