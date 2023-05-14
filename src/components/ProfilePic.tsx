import { Button, Spacer, Avatar, Grid, Popover, Card, Row, Text } from '@nextui-org/react';
import { useContext } from 'react';
import { UserDataContext } from '../context';
import { useState, useEffect } from 'react';
// import { db } from '../config';
// import { doc, getDoc } from 'firebase/firestore';
import { storage } from '../config/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { NoErrPopButton } from '.';

function ProfilePic() {
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const { userData } = useContext(UserDataContext);
    const [currentPhoto, setCurrentPhoto] = useState(userData?.photoURL || '');

    // useEffect(() => {
    //     if (userLoading || !user) {
    //         setUsername('');
    //         setPhotoURL('');
    //         return;
    //     }
    //     const docRef = doc(db, 'users', user.uid);
    //     getDoc(docRef)
    //         .then(doc => {
    //             if (doc.exists()) {
    //                 setUsername(doc.data().username);
    //                 setPhotoURL(doc.data().photoURL);
    //                 console.log(username);
    //             } else {
    //                 console.log(`User documentnot found`);
    //             }
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }, [user, username, userLoading]);

    useEffect(() => {
        setCurrentPhoto(currentPhoto);
    }, [currentPhoto]);

    const handleUploadPic = () => {
        const imageRef = ref(storage, `profile-pics/${imageUpload?.name + v4()}`);
        if (!imageUpload) {
            return;
        }
        uploadBytes(imageRef, imageUpload).then(() => {
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
    const [showUploadButton, setShowUploadButton] = useState(false); // state to show or hide our upload button

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
                                    setShowUploadButton(true); // set state to true to show upload button
                                } else {
                                    setShowUploadButton(false); // set state to false to hide upload button
                                }
                            }}
                        />
                        <Spacer y={1} />
                        {showUploadButton && ( // render button only if showUploadButton state is true
                            <NoErrPopButton
                                buttonName={'Upload profile picture'}
                                clickFunc={handleUploadPic}
                                placement={'right'}
                                popoverText={'Image uploaded successfully!'}
                            />
                        )}
                    </Grid>
                </Grid.Container>
            </>
        ),
        currentPhoto,
    };
}

export default ProfilePic;
