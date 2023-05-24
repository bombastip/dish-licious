import { Input, Card, Text, Grid, Spacer, Button, Textarea, FormElement, Row, Checkbox } from '@nextui-org/react';
import { Container } from '@nextui-org/react';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { collection, addDoc, doc, updateDoc, arrayUnion, getDocs, where, query } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useNavigate } from 'react-router-dom';
import { storage } from '../config/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { NoErrPopButton, VerificationModal } from '.';
import { ErrorMessasge } from '../interfaces';
import ErrPopButton from './ErrPopButton';

function AddPost() {
    // modal
    const [visible, setVisible] = React.useState(false);
    const [visibleGroups, setVisibleGroups] = React.useState(false);
    const { user } = useContext(AuthContext);
    const postCollectionRef = collection(db, 'posts');
    const userCollectionRef = collection(db, 'users');
    const groupCollectionRef = collection(db, 'groups');
    const navigate = useNavigate();

    // new post states
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newTimeUnit, setNewTimeUnit] = useState('');
    const [newTimeCost, setNewTimeCost] = useState(0);
    const [profileSpace, setProfileSpace] = React.useState(false);
    const [groupNames, setGroupNames] = useState<string[]>([]);

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
                    profile: profileSpace,
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

                // Caută grupul cu numele dat
                groupNames.map(async groupName => {
                    const groupsQuery = query(groupCollectionRef, where('name', '==', groupName));
                    const groupsSnapshot = await getDocs(groupsQuery);

                    if (!groupsSnapshot.empty) {
                        const groupDoc = groupsSnapshot.docs[0];

                        // Actualizează câmpul "feed" al grupului cu ID-ul postării noi
                        await updateDoc(groupDoc.ref, {
                            feed: arrayUnion(newPostRef.id),
                        });
                    }
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

    interface stringTypesGroups {
        name: string;
    }

    interface numberTypes {
        quantity: number;
    }
    interface recipeInfo extends stringTypes, numberTypes {}

    // dynamic form
    const [formFields, setFormfields] = useState<recipeInfo[]>([
        { name: '', quantity: 0, measureUnit: '' } as recipeInfo,
    ]);

    const handleFormChange = (event: ChangeEvent<FormElement> | ChangeEvent<HTMLSelectElement>, index: number) => {
        const data = [...formFields] as recipeInfo[];
        if (event.target.name === 'quantity') {
            data[index].quantity = Number(event.target.value);
        } else if (event.target.name === 'measureUnit') {
            data[index].measureUnit = event.target.value;
        }
        data[index][event.target.name as keyof stringTypes] = event.target.value;
        setFormfields(data);
    };

    //dynamic form for groups name
    const [formFieldsGroups, setFormfieldsGroups] = useState([{ name: '' }]);

    const handleFormGroupChange = (event: ChangeEvent<FormElement> | ChangeEvent<HTMLSelectElement>, index: number) => {
        console.log('am intrat');
        const data = [...formFieldsGroups];
        if (event.target.name === 'name') {
            const updatedGroupNames = [...groupNames];
            updatedGroupNames[index] = event.target.value;
            setGroupNames(updatedGroupNames);
        }
        data[index][event.target.name as keyof stringTypesGroups] = event.target.value;
        setFormfieldsGroups(data);
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
    const addFieldsGroups = () => {
        const object = {
            name: '',
        };
        setFormfieldsGroups([...formFieldsGroups, object]);
    };
    const removeFields = (index: number) => {
        const data = [...formFields];
        data.splice(index, 1);
        setFormfields(data);
    };

    const handleProfileSpace = () => {
        setProfileSpace(true);
    };
    const handleVisibleGroups = () => {
        setVisibleGroups(true);
    };

    return (
        <Grid.Container gap={2} justify="center" alignItems="center">
            <Grid sm={12} md={5}>
                <Card aria-label="Add Post" css={{ width: '650px' }}>
                    <Card.Header>
                        <Text
                            aria-label="Header-Add-Post"
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
                        <Container aria-label="Add-Post-Container" css={{ marginTop: '20px' }}>
                            <Input
                                aria-label="Title-Add-Post"
                                bordered
                                labelPlaceholder="Title"
                                onChange={e => setNewPostTitle(e.target.value)}
                                css={{ width: '100%' }}
                            />
                            <Spacer y={2.5} />
                            <Input
                                aria-label="TimeCost-Add-Post"
                                bordered
                                labelPlaceholder="TimeCost"
                                type="number"
                                min="0"
                                onChange={e => setNewTimeCost(Number(e.target.value))}
                                css={{ width: '100%' }}
                            />
                            <Spacer y={0.5} />
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Text aria-label="Time Unit" b color="#ec9127" style={{ marginRight: '15px' }}>
                                    Time Unit:
                                </Text>
                                <form style={{ marginTop: '20px', marginLeft: 0 }}>
                                    <label>
                                        <select
                                            value={newTimeUnit}
                                            onChange={e => setNewTimeUnit(e.target.value)}
                                            style={{
                                                padding: '8px',
                                                border: '1px solid #ccc',
                                                borderRadius: '12px',
                                                width: '150px',
                                            }}
                                        >
                                            <option value="">Select an option</option>
                                            <option value="h">h</option>
                                            <option value="min">min</option>
                                        </select>
                                    </label>
                                    <br />
                                    <br />
                                </form>
                            </div>
                            <Spacer y={0.5} />
                            <Textarea
                                aria-label="Description-Add-Post"
                                bordered
                                labelPlaceholder="Description"
                                onChange={e => setNewDescription(e.target.value)}
                                css={{ width: '100%' }}
                            />
                            <Spacer y={0.5} />
                            <div>
                                <form onSubmit={submit}>
                                    {formFields.map((form, index) => {
                                        return (
                                            <table key={index} style={{ marginTop: '5px' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ paddingRight: '10px' }}>
                                                            <Input
                                                                aria-label="Ingredient-Name-Add-Post"
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
                                                                aria-label="Ingredient-Quantity-Add-Post"
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
                                                            <form style={{ marginTop: '20px', marginLeft: 0 }}>
                                                                <label>
                                                                    <select
                                                                        name="measureUnit"
                                                                        value={form.measureUnit}
                                                                        onChange={(
                                                                            event: ChangeEvent<HTMLSelectElement>,
                                                                        ) => handleFormChange(event, index)}
                                                                        style={{
                                                                            padding: '8px',
                                                                            border: '1px solid #ccc',
                                                                            borderRadius: '12px',
                                                                            width: '150px',
                                                                        }}
                                                                    >
                                                                        <option value="">
                                                                            {form.measureUnit || 'Measure Unit'}
                                                                        </option>
                                                                        <option value="g">g</option>
                                                                        <option value="kg">kg</option>
                                                                        <option value="l">l</option>
                                                                        <option value="ml">ml</option>
                                                                        <option value="buc">buc</option>
                                                                    </select>
                                                                </label>
                                                                <br />
                                                                <br />
                                                            </form>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                color="warning"
                                                                onPress={() => removeFields(index)}
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
                                <Row style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <Button color="warning" onPress={addFields} auto rounded flat>
                                        Add ingredient
                                    </Button>
                                    <Spacer y={3} />
                                </Row>
                            </div>
                            <Checkbox value="profile" onChange={handleProfileSpace}>
                                Profile
                            </Checkbox>
                            <Spacer y={1} />
                            <Row>
                                <Checkbox value="groups" onChange={handleVisibleGroups}>
                                    Groups
                                </Checkbox>
                            </Row>
                            {visibleGroups && (
                                <div>
                                    <Row style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                        <form onSubmit={submit}>
                                            {formFieldsGroups.map((form, index) => {
                                                return (
                                                    <table key={index} style={{ marginTop: '5px' }}>
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ paddingRight: '10px' }}>
                                                                    <Input
                                                                        aria-label="Group-Name-Add-Post"
                                                                        bordered
                                                                        name="name"
                                                                        placeholder="Name Group"
                                                                        width="150px"
                                                                        onChange={(event: ChangeEvent<FormElement>) =>
                                                                            handleFormGroupChange(event, index)
                                                                        }
                                                                        value={form.name}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                );
                                            })}
                                        </form>
                                        <Button color="warning" onPress={addFieldsGroups} auto rounded flat>
                                            +
                                        </Button>
                                        <Spacer y={3} />
                                    </Row>
                                </div>
                            )}

                            <Spacer y={1} />

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Row justify="center">
                                    <Text aria-label="Upload-picture-add-post" b color="#ec9127">
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

                                <ErrPopButton
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
