import { ListOfUsers } from '../components';
import { AuthContext } from '../context';
import { useContext, useEffect, useState } from 'react';
import { db } from '../config';
import { doc, getDoc } from 'firebase/firestore';

const Following = () => {
    const { user, userLoading } = useContext(AuthContext);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        if (userLoading || !user) {
            return;
        }

        const docRef = doc(db, 'users', user.uid);
        getDoc(docRef)
            .then(doc => {
                if (doc.exists()) {
                    setFollowing(doc.data().following);
                }
            })
            .catch(error => {
                console.log(`Error retrieving user document: ${error}`);
            });
    }, [user, userLoading]);

    return <ListOfUsers users={following} currentUserId={user?.uid || ''} />;
};

export default Following;
