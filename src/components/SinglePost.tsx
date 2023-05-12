import { Card, Text, Button, Row, User, Spacer, Image } from '@nextui-org/react';
import { HeartIcon } from './HeartIcon';
import { useEffect, useState } from 'react';
import { getDoc, collection, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { PostType } from '../interfaces';

type Props = {
    post: PostType;
};

function SinglePost({ post }: Props) {
    const { user } = useContext(AuthContext);
    const userCollectionRef = collection(db, 'users');
    const postCollectionRef = collection(db, 'posts');
    const [likesLength, setLikesLength] = useState(0);
    const [liked, setLiked] = useState(true);

    useEffect(() => {
        const getLikes = async () => {
            //const docRef = doc(postCollectionRef, post.id);
            const docRef = doc(db, 'posts', post.id);
            getDoc(docRef).then(doc => {
                if (doc.exists()) {
                    setLikesLength(doc.data().likes.length);
                } else {
                    console.log(`User documentnot found`);
                }
            });
        };
        getLikes();
    }, [post.id]);

    useEffect(() => {
        if (!user) {
            return;
        }
        const check = async () => {
            try {
                const docRef = doc(db, 'posts', post.id);
                const docSnap = await getDoc(docRef);
                const liked = docSnap.data()?.likes.includes(user.uid);
                setLiked(liked);
                console.log('title: ', post.title, 'liked: ', liked);
            } catch (error) {
                console.log(error);
            }
        };
        check();
    }, [user, postCollectionRef]);

    const addToFav = async () => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userDocRef, {
                    favourites: arrayUnion(post.id),
                });
            } catch (err) {
                console.error(err);
            }
        }
    };

    const like = async () => {
        try {
            if (user !== null) {
                const postDocRef = doc(postCollectionRef, post.id);
                await updateDoc(postDocRef, {
                    likes: arrayUnion(user.uid),
                });
                setLiked(true);
                setLikesLength(likesLength + 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const unlike = async () => {
        try {
            if (user !== null) {
                const postDocRef = doc(db, 'posts', post.id);
                await updateDoc(postDocRef, {
                    likes: arrayRemove(user.uid),
                });
                setLiked(false);
                setLikesLength(likesLength - 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
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
                        Liked by {likesLength}{' '}
                    </Text>
                </Row>
                <Spacer y={0.3} />
                <Text
                    css={{
                        height: '5em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                    }}
                >
                    Mod de preparare: {post.description}
                </Text>
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
                    {!liked ? (
                        <Button
                            auto
                            ghost
                            css={{ mr: '$2' }}
                            onClick={() => like()}
                            icon={<HeartIcon fill="currentColor" filled />}
                        />
                    ) : (
                        <Button
                            auto
                            color="error"
                            css={{ mr: '$2' }}
                            onClick={() => unlike()}
                            icon={<HeartIcon fill="currentColor" filled />}
                        />
                    )}
                    <Button flat color="error" auto onClick={() => addToFav()}>
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
    );
}
export default SinglePost;
