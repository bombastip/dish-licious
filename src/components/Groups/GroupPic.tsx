import { Spacer, Avatar, Grid } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { storage } from '../../config/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { NoErrPopButton } from '../.';
import { GroupType } from '../../interfaces';

type GroupPicProps = {
    group: GroupType;
};

function GroupPic({ group }: GroupPicProps) {
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const [currentPhoto, setCurrentPhoto] = useState(group.photo);

    useEffect(() => {
        setCurrentPhoto(currentPhoto);
    }, [currentPhoto]);

    const handleUploadPic = () => {
        const imageRef = ref(storage, `profile-pics/${imageUpload?.name + v4()}`);
        if (!imageUpload) {
            return;
        }
        uploadBytes(imageRef, imageUpload)
            .then(() => getDownloadURL(imageRef))
            .then(url => {
                setCurrentPhoto(url);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const showUploadButton = Boolean(imageUpload);

    return (
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
                            }
                        }}
                    />
                    <Spacer y={1} />
                    {showUploadButton && (
                        <NoErrPopButton
                            buttonName="Upload group photo"
                            clickFunc={handleUploadPic}
                            placement="right"
                            popoverText="Image uploaded successfully!"
                        />
                    )}
                </Grid>
            </Grid.Container>
        </>
    );
}

export default GroupPic;
