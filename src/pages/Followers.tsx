import { ListOfUsers } from '../components';
import { AuthContext } from '../context';
import { useContext, useEffect, useState } from 'react';
import { db } from '../config';
import { doc, getDoc } from 'firebase/firestore';

const Followers = () => {
    const { user, userLoading } = useContext(AuthContext);
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        if (userLoading || !user) {
            return;
        }

        const docRef = doc(db, 'users', user.uid);
        getDoc(docRef)
            .then(doc => {
                if (doc.exists()) {
                    setFollowers(doc.data().followers);
                }
            })
            .catch(error => {
                console.log(`Error retrieving user document: ${error}`);
            });
    }, [user, userLoading]);

    return <ListOfUsers users={followers} currentUserId={user?.uid || ''} />;
};

export default Followers;
