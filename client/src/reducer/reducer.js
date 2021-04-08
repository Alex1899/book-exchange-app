import { ACTION } from "./action-types/action-types";

export const initialState = {
  currentUser: null,
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION.LOGIN_USER:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          username: action.payload.username,
          userId: action.payload.userId,
          email: action.payload.email,
          avatar: action.payload.avatar,
        },
      };
    case ACTION.LOGOUT_USER:
      return {
        ...state,
        currentUser: null,
      };
    case ACTION.UPDATE_AVATAR:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          avatar: action.payload.avatar,
        },
      };

    default:
      return state;
  }
}
