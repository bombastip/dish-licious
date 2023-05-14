import { Input, Card, Modal, Text, Grid, Spacer, Button, Textarea, FormElement, Popover, Row } from '@nextui-org/react';
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
import { AuthButton, NoErrPopButton, VerificationModal } from '.';
import { ErrorMessasge } from '../interfaces';

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

    // error states
    const [err, setErr] = useState<ErrorMessasge>(null);

    const handler = () => {
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
                if (newPostTitle === '') {
                    setErr('Title is required');
                    return;
                }
                if (newDescription === '') {
                    setErr('Description is required');
                    return;
                }
                if (newTimeCost === 0) {
                    setErr('Time cost is required');
                    return;
                }
                if (newTimeUnit === '') {
                    setErr('Time unit is required');
                    return;
                }
                if (newphotoURL === '') {
                    setErr('Photo is required');
                    return;
                }
                if (formFields.length === 0) {
                    setErr('At least one ingredient is required');
                    return;
                }
                if (formFields[0].name === '' || formFields[0].quantity === 0 || formFields[0].measureUnit === '') {
                    setErr('All ingredient fields are required');
                    return;
                }
                const userDocRef = doc(userCollectionRef, user.uid);
                await updateDoc(userDocRef, {
                    posts: arrayUnion(newPostRef.id),
                });
                setVisible(true);
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
        console.log(index);
        const data = [...formFields];
        data.splice(index, 1);
        setFormfields(data);
    };
    return (
        <Grid.Container gap={2} justify="center" alignItems="center" css={{ textAlign: 'center' }}>
            <Grid sm={12} md={5}>
                <Card css={{ width: '650px' }}>
                    <Card.Header>
                        <Text
                            h1
                            size={40}
                            css={{
                                textGradient: '90deg, #fedb58, #fc924c',
                                margin: '0 auto',
                                display: 'inline-block',
                            }}
                            weight="bold"
                        >
                            Share your recipe with the world!
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
                            <Spacer y={1} />

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
                                                                onClick={() => removeFields(index)}
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
                                <Row style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <Button color="warning" onClick={addFields} auto rounded flat>
                                        Add ingredient
                                    </Button>
                                    <Spacer y={3} />
                                </Row>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Row justify="center">
                                    <Text b color="#ec9127">
                                        Upload a picture of your recipe:
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
                                            buttonName={'Save recipe picture'}
                                            clickFunc={handleUploadPic}
                                            placement={'right'}
                                            popoverText={'Image uploaded successfully!'}
                                        />
                                    </>
                                )}
                                <Spacer y={1} />
                                <VerificationModal
                                    modalTitle="Post Added Successfully"
                                    modalBody=""
                                    visible={visible}
                                    buttonMessage="OK"
                                    setVisible={setVisible}
                                    buttonFunction={closeHandler}
                                />

                                <AuthButton
                                    error={err}
                                    buttonName={'Post'}
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

export default AddPost;
