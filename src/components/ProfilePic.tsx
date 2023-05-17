import { Spacer, Avatar, Grid } from '@nextui-org/react';
import { useContext } from 'react';
import { UserDataContext } from '../context';
import { useState, useEffect } from 'react';
import { storage } from '../config/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { NoErrPopButton } from '.';

function ProfilePic() {
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const { userData } = useContext(UserDataContext);
    const [currentPhoto, setCurrentPhoto] = useState(userData?.photoURL || '');
    const [photoLoading, setPhotoLoading] = useState(false);

    useEffect(() => {
        setCurrentPhoto(currentPhoto);
    }, [currentPhoto]);

    const handleUploadPic = () => {
        setPhotoLoading(true);
        const imageRef = ref(storage, `profile-pics/${imageUpload?.name + v4()}`);
        if (!imageUpload) {
            return;
        }
        uploadBytes(imageRef, imageUpload).then(() => {
            getDownloadURL(imageRef)
                .then(url => {
                    setCurrentPhoto(url);
                    setPhotoLoading(false);
                })
                .catch(error => {
                    console.error(error);
                });
        });
        // setLoading(false);
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
        photoLoading,
    };
}

export default ProfilePic;
