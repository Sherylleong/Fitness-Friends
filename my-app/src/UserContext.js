import{ useContext, useState, createContext} from 'react';

export const UserContext = createContext(""); //Global Variable for User Id

export function UserContextProvider({children}) {
    const [userId, setUserId] = useState("");


    return (
        <UserContext.Provider value={[userId, setUserId]}>
            {children}
        </UserContext.Provider>
    );
}