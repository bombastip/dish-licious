import { ListOfUsers } from '../components';
import { AuthContext } from '../context';
import { useContext, useEffect, useState } from 'react';
import { db } from '../config';
import { doc, getDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

const FollowersQueryParam = () => {
    const { user, userLoading } = useContext(AuthContext);
    const [followers, setFollowers] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');

    useEffect(() => {
        if (userLoading || !user || !userId) {
            return;
        }

        const docRef = doc(db, 'users', userId);
        getDoc(docRef)
            .then(doc => {
                if (doc.exists()) {
                    setFollowers(doc.data().followers);
                } else {
                    console.log(`User documentnot found`);
                }
            })
            .catch(error => {
                console.log(`Error retrieving user document: ${error}`);
            });
    }, [user, userLoading]);

    return <ListOfUsers users={followers} currentUserId={user?.uid || ''} />;
};

export default FollowersQueryParam;
