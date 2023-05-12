import { useEffect, useState } from 'react';
import { db } from '../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { getUserData } from '../database';
import { Image } from '@nextui-org/react';

type Props = {
    currentPostId: string;
};

function RecipeCard({ currentPostId }: Props) {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');

    useEffect(() => {
        const docRef = doc(db, 'posts', currentPostId);
        getDoc(docRef)
            .then(doc => {
                if (doc.exists()) {
                    setUserId(doc.data().userID);
                    console.log(userId);
                } else {
                    console.log(`User documentnot found`);
                }
            })
            .catch(error => {
                console.log(`Error retrieving user document: ${error}`);
            });
    }, [currentPostId, userId]);

    useEffect(() => {
        const loadUserData = async () => {
            if (!userId) {
                return;
            }
            const userData = await getUserData(userId);
            if (!userData) {
                return;
            }
            setUsername(userData.username);
            setPhotoURL(userData.photoURL);
        };
        loadUserData();
    }, [userId]);

    return (
        <div>
            {username}
            <Image src={photoURL} width={200} height={200} />)
        </div>
    );
}

export default RecipeCard;
