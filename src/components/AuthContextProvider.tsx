import { auth } from '../config/firebase-config';
import { useEffect, useState, FC, ReactNode } from 'react';
import { AuthContext } from '../context/Context';
import { User } from 'firebase/auth';

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: FC<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState(null as User | null);
    useEffect(() => {
        auth.onAuthStateChanged(firebaseUser => {
            setUser(firebaseUser);
        });
    }, []);
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
