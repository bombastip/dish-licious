import { createGroup } from '../../database';
import { Input, Card, Text, Grid, Spacer, Textarea, Row } from '@nextui-org/react';
import { Container } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../config/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { useContext } from 'react';
import { AuthContext } from '../../context';
import { NoErrPopButton, VerificationModal } from '../.';
import { ErrorMessasge } from '../../interfaces';
import ErrPopButton from '../ErrPopButton';

function CreateGroupCard() {
    // modal
    const [visible, setVisible] = React.useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // new group states
    const [newGroupName, setnewGroupName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    // photo
    const [newphotoURL, setPhotoURL] = useState('');
    const [imageUpload, setImageUpload] = useState<File | null>(null);

    // error states
    const [err, setErr] = useState<ErrorMessasge>(null);

    const handler = () => {
        onSubmitGroup();
    };

    const closeHandler = () => {
        setVisible(false);
        navigate('/login');
    };

    useEffect(() => {
        setPhotoURL(newphotoURL);
    }, [newphotoURL]);

    const handleUploadPic = () => {
        const imageRef = ref(storage, `group-pics/${imageUpload?.name + v4()}`);
        if (!imageUpload) {
            return;
        }

        uploadBytes(imageRef, imageUpload).then(() => {
            getDownloadURL(imageRef)
                .then(url => {
                    setPhotoURL(url);
                })
                .catch(error => {
                    console.error(error);
                });
        });
    };
    const [showUploadButton, setShowUploadButton] = useState(false); // state to show or hide our upload button

    const onSubmitGroup = async () => {
        try {
            if (user !== null) {
                if (newGroupName === '') {
                    setErr('Group name is required');
                    return;
                }
                if (newphotoURL === '') {
                    setErr('Photo is required');
                    return;
                }
                setVisible(true);
                await createGroup(user.uid, newGroupName, newDescription, newphotoURL);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Grid.Container gap={2} justify="center" alignItems="center">
            <Grid sm={12} md={5}>
                <Card aria-label="Add Post" css={{ width: '650px' }}>
                    <Card.Header>
                        <Text
                            aria-label="Header-Add-Post"
                            h1
                            size={31}
                            css={{
                                textGradient: '90deg, #fedb58, #fc924c',
                                fontWeight: 'bold',
                            }}
                        >
                            Create your own group with exclusive recipes!
                        </Text>
                    </Card.Header>
                    <Card.Divider />
                    <Card.Body css={{ py: '$10' }}>
                        <Container
                            aria-label="Add-Post-Container"
                            justify="center"
                            alignItems="center"
                            css={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                        >
                            <Input
                                aria-label="Group-Name-Create-Group"
                                bordered
                                labelPlaceholder="Title"
                                onChange={e => setnewGroupName(e.target.value)}
                                css={{ width: '100%' }}
                            />
                            <Spacer y={2} />
                            <Textarea
                                aria-label="Description-Create-Group"
                                bordered
                                labelPlaceholder="Description"
                                onChange={e => setNewDescription(e.target.value)}
                                css={{ width: '100%' }}
                            />
                            <Spacer y={1} />

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Spacer y={1} />
                                <Row justify="center">
                                    <Text aria-label="Upload-picture-create-group" b color="#ec9127">
                                        Upload a picture for the group:
                                    </Text>
                                    <Spacer x={0.5} />
                                    <input
                                        type="file"
                                        onChange={event => {
                                            if (event.target.files != null) {
                                                setImageUpload(event.target.files[0]);
                                                setShowUploadButton(true);
                                            } else {
                                                setShowUploadButton(false);
                                            }
                                        }}
                                    />
                                </Row>
                                {showUploadButton && (
                                    <>
                                        <Spacer y={1} />
                                        <NoErrPopButton
                                            buttonName={'Save group picture'}
                                            clickFunc={handleUploadPic}
                                            placement={'right'}
                                            popoverText={'Image uploaded successfully!'}
                                        />
                                    </>
                                )}
                                <Spacer y={1} />
                                <VerificationModal
                                    modalTitle="Group Created Successfully"
                                    modalBody=""
                                    visible={visible}
                                    buttonMessage="OK"
                                    setVisible={setVisible}
                                    buttonFunction={closeHandler}
                                />

                                <ErrPopButton
                                    error={err}
                                    buttonName={'Create Group'}
                                    setError={setErr}
                                    clickFunc={handler}
                                    placement="right"
                                    offset={15}
                                />
                            </div>
                        </Container>
                    </Card.Body>
                </Card>
            </Grid>
        </Grid.Container>
    );
}

export default CreateGroupCard;
