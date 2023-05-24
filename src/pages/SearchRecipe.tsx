import { Container, Input, Row, Spacer, Text, Col, Button, Card, Grid, FormElement } from '@nextui-org/react';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { filterPostsByIngredients, filterPostsByTitle, filterPostsByTime } from '../database';
import { PostType, Ingredient } from '../interfaces';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { SinglePost } from '../components';

const SearchRecipe = () => {
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newTimeUnit, setNewTimeUnit] = useState('');
    const [newTimeCost, setNewTimeCost] = useState(0);
    const [postsByIngredients, setPostsByIngredients] = useState<PostType[]>([]);
    const [postsByTitle, setPostsByTitle] = useState<PostType[]>([]);
    const [postsByTime, setPostsByTime] = useState<PostType[]>([]);
    const [results, setResults] = useState<PostType[]>([]);
    const [buttonPressed, setButtonPressed] = useState(false);

    const getAllPosts = async () => {
        const postCollectionRef = collection(db, 'posts');
        const querySnapshot = await getDocs(postCollectionRef);
        const posts = querySnapshot.docs.map(doc => ({
            ...(doc.data() as PostType),
            id: doc.id,
            ingredients: doc.data().ingredients as Ingredient[],
        }));
        return posts;
    };

    useEffect(() => {
        const getPosts = async () => {
            const posts = await getAllPosts();
            setPostsByIngredients(posts);
            setPostsByTitle(posts);
            setPostsByTime(posts);
        };
        getPosts();
    }, []);

    interface recipeInfo {
        name: string;
    }

    const [formFields, setFormfields] = useState<recipeInfo[]>([{ name: '' } as recipeInfo]);

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const handleFormChange = (event: ChangeEvent<FormElement>, index: number) => {
        const data = [...formFields] as recipeInfo[];
        data[index][event.target.name as keyof recipeInfo] = event.target.value;
        setFormfields(data);
    };

    const addFields = () => {
        const object = {
            name: '',
        };
        setFormfields([...formFields, object]);
    };

    const removeFields = (index: number) => {
        const data = [...formFields];
        data.splice(index, 1);
        setFormfields(data);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (newPostTitle !== '') {
                const postsByTitle = await filterPostsByTitle(newPostTitle);
                setPostsByTitle(postsByTitle);
            }

            if (newTimeCost != 0 && newTimeUnit != '') {
                const postsByTime = await filterPostsByTime(newTimeCost, newTimeUnit);
                setPostsByTime(postsByTime);
            }

            const ingredients = formFields.map(ingredient => ingredient.name);
            if (formFields.length > 0 && ingredients[0] !== '') {
                const postsByIngredients = await filterPostsByIngredients(ingredients);
                setPostsByIngredients(postsByIngredients);
            }
        };

        fetchData();
    }, [newPostTitle, newTimeCost, newTimeUnit, formFields]);

    const handler = () => {
        setButtonPressed(true);
        if (
            newPostTitle === '' &&
            newTimeCost === 0 &&
            newTimeUnit === '' &&
            formFields.length <= 1 &&
            formFields[0].name === ''
        ) {
            alert('You need to complete at least one field!');
            return;
        }
        if ((newTimeUnit !== '' && newTimeCost === 0) || (newTimeUnit === '' && newTimeCost !== 0)) {
            alert('You need to complete both fields for time!');
            return;
        }
        const commonPosts = postsByIngredients.filter(post => {
            return (
                postsByTitle.some(titlePost => titlePost.id === post.id) &&
                postsByTime.some(timePost => timePost.id === post.id)
            );
        });

        setResults(commonPosts);
    };

    return (
        <Row>
            <Grid.Container gap={2} justify="center" alignItems="center">
                <Grid sm={12} md={5}>
                    <Card aria-label="Add Post" css={{ minWidth: '460px', marginTop: '20px' }}>
                        <Card.Header>
                            <Col>
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
                                    Search Recipe
                                </Text>
                                <Text>complete at least one field</Text>
                            </Col>
                        </Card.Header>
                        <Card.Divider />
                        <Card.Body css={{ py: '$10' }}>
                            <Container
                                aria-label="Add-Post-Container"
                                css={{
                                    marginTop: '20px',
                                }}
                            >
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
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <form onSubmit={submit}>
                                        {formFields.map((form, index) => {
                                            return (
                                                <table key={index} style={{ marginTop: '15px' }}>
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
                                    <Row style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                        <Button color="warning" onPress={addFields} auto rounded flat>
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
                                ></div>
                                <Row justify="center">
                                    <Button onPress={handler} placement="right" auto size="md" offset={15}>
                                        Search
                                    </Button>
                                </Row>
                            </Container>
                        </Card.Body>
                    </Card>
                </Grid>
            </Grid.Container>

            <Container>
                <Container
                    css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                >
                    <Spacer y={2} />
                    <Text
                        h1
                        size={40}
                        align="center"
                        css={{
                            textGradient: '90deg, #fedb58, #fc924c',
                        }}
                        weight="bold"
                    >
                        Results
                    </Text>
                </Container>
                <Grid.Container gap={2} justify="center" css={{ marginTop: '20px' }}>
                    <div>
                        {results.length
                            ? results.map(post => (
                                  <div key={post.id}>
                                      <SinglePost post={post} />
                                      <Spacer y={0.5} />
                                  </div>
                              ))
                            : buttonPressed && (
                                  <div>
                                      <Text h5 size={40} align="center" color="secondary">
                                          No results found
                                      </Text>
                                  </div>
                              )}
                    </div>
                </Grid.Container>
            </Container>
        </Row>
    );
};

export default SearchRecipe;
