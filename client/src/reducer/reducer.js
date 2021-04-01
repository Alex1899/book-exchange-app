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
          avatar: action.payload.avatar,
          requestedBooks: action.payload.requestedBooks,
          soldBooks: action.payload.soldBooks,
          purchasedBooks: action.payload.purchasedBooks,
          currentlySelling: action.payload.currentlySelling,
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

    case ACTION.UPDATE_USER_BOOKS:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          requestedBooks: action.payload.requestedBooks,
          soldBooks: action.payload.soldBooks,
          purchasedBooks: action.payload.purchasedBooks,
          currentlySelling: action.payload.currentlySelling,
        },
      };
    default:
      return state;
  }
}
