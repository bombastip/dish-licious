import { Card, Grid, Text, Button, Row, User, Spacer, Image } from '@nextui-org/react';
import { HeartIcon } from './HeartIcon';
import { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebase-config';

export const Post = () => {
    const [postList, setPostList] = useState<any[]>([]);
    const postCollectionRef = collection(db, 'posts');

    useEffect(() => {
        const getPostList = async () => {
            // READ THE DATA
            // SET THE POST LIST
            try {
                const data = await getDocs(postCollectionRef);
                const filteredData = data.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setPostList(filteredData);
                console.log(filteredData);
            } catch (err) {
                console.error(err);
            }
        };
        getPostList();
    }, []);
    // interface Ingredient {
    //     name: string;
    //     quantity: number;
    //     unit: string;
    //     likes: Array<string>;
    // }

    return (
        <Grid.Container gap={2} justify="center" css={{ marginTop: '20px' }}>
            <div>
                {postList.map(post => (
                    <>
                        <Card isPressable isHoverable variant="bordered" css={{ mw: '400px' }}>
                            <Card.Header>
                                <Text b css={{ whiteSpace: 'nowrap' }}>
                                    {post.title}
                                </Text>
                                <Row justify="flex-end">
                                    <User src="https://i.pravatar.cc/150?u=a042581f4e29026704d" name="Ariana Wattson" />
                                </Row>
                            </Card.Header>
                            <Card.Divider />
                            <Card.Body css={{ py: '$10' }}>
                                <Image
                                    width={400}
                                    height={170}
                                    containerCss={{ borderRadius: '3%' }}
                                    src={post.photoURL}
                                    alt="Default Image"
                                    objectFit="cover"
                                />
                                <Spacer y={0.2} />
                                <Row>
                                    <Text color="#ec9127" css={{ marginLeft: '$1' }}>
                                        {' '}
                                        Liked by {post.likes.length}{' '}
                                    </Text>
                                </Row>
                                <Spacer y={0.3} />
                                <Text>Mod de preparare: {post.description}</Text>
                                {/* <Text>
                                Ingrediente:
                                <Text>
                                    {post.ingredients.map((ingredient: Ingredient, index: number) => (
                                        <li
                                            key={index}
                                        >{`${ingredient.quantity} ${ingredient.unit} of ${ingredient.name} `}</li>
                                    ))}
                                </Text>
                            </Text> */}
                                <Text>
                                    {' '}
                                    Time Cost: {post.timeCost} {post.timeUnit}
                                </Text>
                            </Card.Body>
                            <Card.Divider />
                            <Card.Footer>
                                <Row justify="flex-start">
                                    <Button
                                        auto
                                        color="error"
                                        css={{ mr: '$2' }}
                                        icon={<HeartIcon fill="currentColor" filled />}
                                    />
                                    <Button flat color="error" auto>
                                        Save
                                    </Button>
                                </Row>
                                <Row justify="flex-end">
                                    <Button.Group>
                                        <Button css={{ mr: '$2' }}> + </Button>
                                        <Button>View comment list</Button>
                                    </Button.Group>
                                </Row>
                            </Card.Footer>
                        </Card>
                        <Spacer y={0.5} />
                    </>
                ))}
            </div>
        </Grid.Container>
    );
};
