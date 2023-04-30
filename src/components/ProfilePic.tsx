import { Button, Spacer, Avatar, Grid } from '@nextui-org/react';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { useState, useEffect } from 'react';
import { db } from '../config';
import { doc, getDoc } from 'firebase/firestore';

function ProfilePic() {
    const { user, userLoading } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');

    useEffect(() => {
        if (userLoading || !user) {
            setUsername('');
            setPhotoURL('');
            return;
        }
        const docRef = doc(db, 'users', user.uid);
        getDoc(docRef)
            .then(doc => {
                if (doc.exists()) {
                    setUsername(doc.data().username);
                    setPhotoURL(doc.data().photoURL);
                    console.log(username);
                } else {
                    console.log(`User documentnot found`);
                }
            })
            .catch(error => {
                console.log(`Error retrieving user document: ${error}`);
            });
    }, [user, username, userLoading]);
    return (
        <>
            <Grid.Container gap={2} alignItems="center">
                <Grid>
                    <Spacer y={1} />
                    <Avatar src={photoURL} css={{ size: '$20' }} />
                    <Spacer y={1} />
                </Grid>
                <Grid>
                    <Button>Upload profile picture</Button>
                </Grid>
            </Grid.Container>
        </>
    );
}

export default ProfilePic;
