import { Input, Card, Modal, Text, Grid, Spacer, Button, Textarea, FormElement } from '@nextui-org/react';
import { Container } from '@nextui-org/react';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
                    likes: [],
                    photoURL: newphotoURL,
                    ingredients: formFields,
                    userID: user.uid,
                });

                // adauga postarea in lista de postari ale utilizatorului curent
                const userDocRef = doc(userCollectionRef, user.uid);
                await updateDoc(userDocRef, {
                    posts: arrayUnion(newPostRef.id),
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    interface stringTypes {
        name: string;
        measureUnit: string;
    }

    interface numberTypes {
        quantity: number;
    }
    interface recepieInfo extends stringTypes, numberTypes {}

    // dynamic form
    const [formFields, setFormfields] = useState<recepieInfo[]>([
        { name: '', quantity: 0, measureUnit: '' } as recepieInfo,
    ]);

    const handleFormChange = (event: ChangeEvent<FormElement>, index: number) => {
        const data = [...formFields] as recepieInfo[];
        if (event.target.name === 'quantity') {
            data[index].quantity = Number(event.target.value);
        }
        data[index][event.target.name as keyof stringTypes] = event.target.value;
        setFormfields(data);
    };

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    const addFields = () => {
        const object = {
            name: '',
            quantity: 0,
            measureUnit: '',
        };
        setFormfields([...formFields, object]);
    };
    const removeFields = (index: number) => {
        const data = [...formFields];
        data.splice(index, 1);
        setFormfields(data);
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
                                type="number"
                                min="0"
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
                            <div>
                                <form onSubmit={submit}>
                                    {formFields.map((form, index) => {
                                        return (
                                            <table key={index} style={{ marginTop: '20px' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ paddingRight: '10px' }}>
                                                            <Input
                                                                bordered
                                                                name="name"
                                                                placeholder="Name Ingredient"
                                                                width="150px"
                                                                onChange={(event: ChangeEvent<FormElement>) =>
                                                                    handleFormChange(event, index)
                                                                }
                                                                value={form.name}
                                                            />
                                                        </td>
                                                        <td style={{ paddingRight: '10px' }}>
                                                            <Input
                                                                bordered
                                                                type="number"
                                                                min="0"
                                                                name="quantity"
                                                                placeholder="Quantity"
                                                                width="90px"
                                                                onChange={(event: ChangeEvent<FormElement>) =>
                                                                    handleFormChange(event, index)
                                                                }
                                                                value={form.quantity}
                                                            />
                                                        </td>
                                                        <td style={{ paddingRight: '10px' }}>
                                                            <Input
                                                                bordered
                                                                name="measureUnit"
                                                                placeholder="Measure Unit"
                                                                width="120px"
                                                                onChange={(event: ChangeEvent<FormElement>) =>
                                                                    handleFormChange(event, index)
                                                                }
                                                                value={form.measureUnit}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Button
                                                                color="warning"
                                                                onClick={removeFields}
                                                                auto
                                                                rounded
                                                                flat
                                                            >
                                                                Remove
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </form>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <Button color="warning" onClick={addFields} css={{ mr: '$4' }} auto rounded flat>
                                        +
                                    </Button>
                                    <Button color="warning" auto rounded flat>
                                        Save ingredients
                                    </Button>
                                </div>
                            </div>
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

                                <Button color="warning" onPress={handler} css={{ marginTop: '20px' }}>
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
