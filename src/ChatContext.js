import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./context";


export const ChatContext = createContext();


export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const INITIAL_STATE = {
        chatId: null,
        user: [],
    };

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId:
                        currentUser.uid > action.payload.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + currentUser.uid,
                };
            case 'SET_CHAT_ID':
                return { ...state,
                         chatId: action.payload,
                         user: action.payload.user || state.user };

            case 'CLEAR_CHAT':
                    return {user: null,
                    chatId: null};
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
    return (
        <ChatContext.Provider value={{ data:state, dispatch }}>
            {children}
        </ChatContext.Provider>
    )
};