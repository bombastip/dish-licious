import { Input, Card, Modal, Text, Grid, Spacer, Button, Textarea } from '@nextui-org/react';
import { Container } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useNavigate } from 'react-router-dom';
import { storage } from '../config/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { VerificationModal } from '.';

function AddPost() {
    // modal
    const [visible, setVisible] = React.useState(false);
    const { user } = useContext(AuthContext);
    const postCollectionRef = collection(db, 'posts');
    const userCollectionRef = collection(db, 'users');
    const navigate = useNavigate();

    // new post states
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newTimeUnit, setNewTimeUnit] = useState('');
    const [newTimeCost, setNewTimeCost] = useState(0);
    const [newLikes, setNewLikes] = useState([]);
    // photo
    const [newphotoURL, setPhotoURL] = useState('');
    const [imageUpload, setImageUpload] = useState<File | null>(null);

    const handler = () => {
        setVisible(true);
        onSubmitPost();
    };

    const closeHandler = () => {
        setVisible(false);
        console.log('closed');
        navigate('/login');
    };

    useEffect(() => {
        setPhotoURL(newphotoURL);
    }, [newphotoURL]);

    const handleUploadPic = () => {
        const imageRef = ref(storage, `posts-pics/${imageUpload?.name + v4()}`);
        if (!imageUpload) {
            return;
        }

        uploadBytes(imageRef, imageUpload).then(() => {
            console.log('Image uploaded!');
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

    const onSubmitPost = async () => {
        try {
            if (user !== null) {
                const newPostRef = await addDoc(postCollectionRef, {
                    title: newPostTitle,
                    description: newDescription,
                    timeCost: newTimeCost,
                    timeUnit: newTimeUnit,
                    likes: newLikes,
                    photoURL: newphotoURL,
                    userID: user.uid,
                });

                // adauga postul in lista de postari ale utilizatorului curent
                const userDocRef = doc(userCollectionRef, user.uid);
                await updateDoc(userDocRef, {
                    posts: arrayUnion(newPostRef.id),
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Grid.Container gap={2} justify="center" alignItems="center" css={{ textAlign: 'center' }}>
            <Grid sm={12} md={5}>
                <Card css={{ width: '650px' }}>
                    <Card.Header>
                        <Text b color="#ec9127" css={{ margin: '0 auto', display: 'inline-block' }}>
                            Add Post
                        </Text>
                    </Card.Header>
                    <Card.Divider />
                    <Card.Body css={{ py: '$10' }}>
                        <Container
                            justify="center"
                            alignItems="center"
                            css={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                        >
                            <Input
                                bordered
                                labelPlaceholder="Title"
                                onChange={e => setNewPostTitle(e.target.value)}
                                css={{ width: '100%' }}
                            />
                            <Spacer y={2.5} />
                            <Input
                                bordered
                                labelPlaceholder="TimeCost"
                                type="Number"
                                onChange={e => setNewTimeCost(Number(e.target.value))}
                                css={{ width: '100%' }}
                            />
                            <Spacer y={2.5} />
                            <Input
                                clearable
                                bordered
                                labelPlaceholder="TimeUnit"
                                onChange={e => setNewTimeUnit(e.target.value)}
                                css={{ width: '100%' }}
                            />
                            <Spacer y={2.5} />
                            <Textarea
                                bordered
                                labelPlaceholder="Description"
                                onChange={e => setNewDescription(e.target.value)}
                                css={{ width: '100%' }}
                            />
                            {/* <AddPostButton clickFunc={onSubmitPost} buttonName="AddPost" error={err} setError={setErr}  /> */}
                            <div
                                style={{
                                    display: 'flex-start',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginTop: '20px',
                                    marginLeft: '70px',
                                }}
                            >
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
                                {showUploadButton && (
                                    <Button onClick={handleUploadPic} css={{ marginTop: '20px' }}>
                                        Upload recipe picture
                                    </Button>
                                )}
                                <VerificationModal
                                    modalTitle="Post Added Successfully"
                                    modalBody=""
                                    visible={visible}
                                    buttonMessage="OK"
                                    setVisible={setVisible}
                                    buttonFunction={closeHandler}
                                />

                                <Button
                                    color="warning"
                                    onPress={handler}
                                    css={{ marginTop: '20px' }}
                                >
                                    Add post
                                </Button>
                            </div>
                        </Container>
                    </Card.Body>
                </Card>
            </Grid>
        </Grid.Container>
    );
}

export default AddPost;
