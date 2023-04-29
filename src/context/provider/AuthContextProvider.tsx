import { auth } from '../../config/firebase-config';
import { useEffect, useState, FC, ReactNode, useMemo } from 'react';
import { User } from 'firebase/auth';
import { AuthContext } from '..';

interface AuthContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider: FC<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState(null as User | null);
    const [userLoading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = useMemo(() => ({ user, userLoading }), [user, userLoading]);
    // const value = { user, userLoading };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
