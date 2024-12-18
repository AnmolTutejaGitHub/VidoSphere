import { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

function Provider({ children }) {
    const [user, setUser] = useState(() => {
        return sessionStorage.getItem('user') || null;
    });

    const [loading, setLoading] = useState(true);

    async function decodeToken() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verifytokenAndGetUsername`, {
                token: token
            });
            if (response.status === 200) setUser(response.data.user);
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        decodeToken();
    }, [])

    useEffect(() => {
        if (user) {
            sessionStorage.setItem('user', user);
        } else {
            sessionStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export { Provider };
export default UserContext;
