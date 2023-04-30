import { Button, Spacer, Avatar, Grid } from '@nextui-org/react';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { useState, useEffect } from 'react';
import { db } from '../config';
import { doc, getDoc } from 'firebase/firestore';
import { storage } from '../config/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

function ProfilePic() {
    const { user, userLoading } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const [currentPhoto, setCurrentPhoto] = useState('');

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
                console.log(error);
            });
    }, [user, username, userLoading]);

    useEffect(() => {
        setCurrentPhoto(photoURL);
    }, [photoURL]);

    const handleUploadPic = () => {
        const imageRef = ref(storage, `profile-pics/${imageUpload?.name + v4()}`);
        uploadBytes(imageRef, imageUpload!).then(() => {
            console.log('Image uploaded!');
            getDownloadURL(imageRef)
                .then(url => {
                    setCurrentPhoto(url);
                })
                .catch(error => {
                    console.error(error);
                });
        });
    };

    return {
        component: (
            <>
                <Grid.Container gap={2} alignItems="center">
                    <Grid>
                        <Spacer y={1} />
                        <Avatar src={currentPhoto} css={{ size: '$20' }} />
                        <Spacer y={1} />
                    </Grid>
                    <Grid>
                        <input
                            type="file"
                            onChange={event => {
                                if (event.target.files != null) {
                                    setImageUpload(event.target.files[0]);
                                } else return;
                            }}
                        />
                        <Spacer y={1} />
                        <Button onClick={handleUploadPic}>Upload profile picture</Button>
                    </Grid>
                </Grid.Container>
            </>
        ),
        currentPhoto,
    };
}

export default ProfilePic;
