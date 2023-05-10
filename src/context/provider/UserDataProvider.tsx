import { FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { UserData } from '../../interfaces';
import { AuthContext } from '..';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config';
import UserDataContext from '../UserDataContext';

interface UserDataProviderProps {
    children: ReactNode;
}

const UserDataProvider: FC<UserDataProviderProps> = ({ children }) => {
    const { user, userLoading } = useContext(AuthContext);
    const [userData, setUserData] = useState(null as UserData | null);
    const [userDataLoading, setUserDataLoading] = useState(true);

    useEffect(() => {
        if (userLoading && !user) {
            setUserData(null);
            setUserDataLoading(true);
            return;
        }
        if (!userLoading && !user) {
            setUserData(null);
            setUserDataLoading(false);
            return;
        }
        if (!user) {
            return;
        }

        const docRef = doc(db, 'users', user.uid);
        const getUserData = async () => {
            try {
                const data = await getDoc(docRef);
                if (!data.exists()) {
                    throw new Error(`User document not found`);
                }
                console.log(data.data());
                setUserData(data.data() as UserData);
                setUserDataLoading(false);
            } catch (err) {
                throw new Error(`Error retrieving user document: ${err}`);
            }
        };
        getUserData();
    }, [userLoading, user]);

    const value = useMemo(() => ({ userData, userDataLoading }), [userData, userDataLoading]);

    return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

export default UserDataProvider;
