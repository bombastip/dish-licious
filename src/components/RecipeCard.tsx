import { useEffect, useState } from 'react';
import { db } from '../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { getUserData } from '../database';
import { PostType } from '../interfaces';
import { Card, Col, Row, Button, Text, Avatar, Spacer, Grid } from '@nextui-org/react';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { checkFollow, follow, unfollow } from '../database';
import { arrayRemove, arrayUnion, updateDoc, collection } from 'firebase/firestore';
import { HeartIcon } from '../assets/HeartIcon';
import { Ingredient } from '../interfaces';
import { Link } from 'react-router-dom';

type Props = {
    post: PostType;
};

function RecipeCard({ post }: Props) {
    const { user } = useContext(AuthContext);
    const userId = post.userID;
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likesLength, setLikesLength] = useState(0);
    const [saved, setSaved] = useState(false);
    const postCollectionRef = collection(db, 'posts');
    const userCollectionRef = collection(db, 'users');

    useEffect(() => {
        const getLikes = async () => {
            //const docRef = doc(postCollectionRef, post.id);
            const docRef = doc(db, 'posts', post.id);
            getDoc(docRef).then(doc => {
                if (doc.exists()) {
                    setLikesLength(doc.data().likes.length);
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
                const isFollowing = await checkFollow(user.uid, userId);
                setIsFollowing(isFollowing);
            } catch (error) {
                console.log(error);
            }
        };
        check();
    }, [user, userId]);

    useEffect(() => {
        const loadUserData = async () => {
            if (!userId) {
                return;
            }
            const userData = await getUserData(userId);
            if (!userData) {
                return;
            }
            setUsername(userData.username);
            setPhotoURL(userData.photoURL);
        };
        loadUserData();
    }, [userId]);

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
                const userdocRef = doc(db, 'users', user.uid);

                const docUserSnap = await getDoc(userdocRef);
                const saved = docUserSnap.data()?.favourites.includes(post.id);
                setSaved(saved);
            } catch (error) {
                console.log(error);
            }
        };
        check();
    }, [user, postCollectionRef]);

    const handleFollow = async (wantToFollow: string, currentUser: string) => {
        setIsFollowing(true);
        await follow(wantToFollow, currentUser);
    };

    const handleUnfollow = async (wantToUnfollow: string, currentUser: string) => {
        setIsFollowing(false);
        await unfollow(wantToUnfollow, currentUser);
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

    const addToFav = async () => {
        if (user) {
            const userDocRef = doc(userCollectionRef, user.uid);
            try {
                await updateDoc(userDocRef, {
                    favourites: arrayUnion(post.id),
                });
                setSaved(true);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const removeFromFav = async () => {
        if (user) {
            const userDocRef = doc(userCollectionRef, user.uid);
            try {
                await updateDoc(userDocRef, {
                    favourites: arrayRemove(post.id),
                });
                setSaved(false);
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <>
            <Spacer y={2} />
            <Row>
                <Col>
                    <Card css={{ h: '450px', marginLeft: '20px', maxWidth: '90%' }}>
                        <Card.Body css={{ p: 0 }}>
                            <Card.Image src={post.photoURL} objectFit="cover" width="100%" height="100%" />
                        </Card.Body>
                        <Card.Footer
                            isBlurred
                            css={{
                                position: 'absolute',
                                bgBlur: '#0f111466',
                                bottom: 0,
                                zIndex: 2,
                            }}
                        >
                            <Row>
                                <Col>
                                    <Row>
                                        <Link to={`/user-profile?userId=${userId}`}>
                                            <Avatar css={{ cursor: 'pointer' }} src={photoURL} size="md" />
                                        </Link>
                                        <Spacer x={0.6} />
                                        <Link to={`/user-profile?userId=${userId}`}>
                                            <Text color="#d1d1d1" size={18}>
                                                {username}
                                            </Text>
                                        </Link>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row justify="flex-end">
                                        {user &&
                                            user.uid !== userId &&
                                            (isFollowing ? (
                                                <Button
                                                    flat
                                                    auto
                                                    rounded
                                                    css={{ color: '#d1d1d1', bg: '#f6d8d826 ' }}
                                                    onPress={() => handleUnfollow(userId, user.uid)}
                                                >
                                                    Unfollow
                                                </Button>
                                            ) : (
                                                <Button
                                                    flat
                                                    auto
                                                    rounded
                                                    css={{ color: '#fedebe', bg: '#f6d8d826 ' }}
                                                    onPress={() => handleFollow(userId, user.uid)}
                                                >
                                                    Follow
                                                </Button>
                                            ))}
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                    <Spacer y={0.5} />
                    <Text
                        h1
                        size={30}
                        css={{
                            textGradient: '90deg, #fedb58, #fc924c',
                            marginLeft: '32px',
                        }}
                        weight="bold"
                    >
                        Mod de preparare:
                    </Text>
                    <Text css={{ marginLeft: '32px' }}>{post.description}</Text>
                </Col>
                <Spacer x={2} />

                <Grid.Container gap={2} direction="column" css={{ width: '100%' }}>
                    <Text
                        h1
                        size={40}
                        css={{
                            textGradient: '90deg, #fedb58, #fc924c',
                        }}
                        weight="bold"
                    >
                        {post.title}
                    </Text>
                    <Row>
                        {!liked ? (
                            <Button
                                auto
                                css={{ mr: '$1', background: '$myColor' }}
                                onPress={() => like()}
                                icon={<HeartIcon fill="white" filled />}
                            />
                        ) : (
                            <Button
                                auto
                                css={{ mr: '$1', backgroundColor: 'transparent', border: 'none' }}
                                onPress={() => unlike()}
                                icon={<HeartIcon filled fill="#F31260" />}
                            />
                        )}
                        <Spacer y={0.2} />
                        {!saved ? (
                            <Button
                                css={{ width: '75px', background: '#fdd8e5', color: '$myColor' }}
                                auto
                                onPress={() => addToFav()}
                            >
                                Save
                            </Button>
                        ) : (
                            <Button
                                flat
                                css={{ width: '75px', background: '$myColor', color: 'white' }}
                                auto
                                onPress={() => removeFromFav()}
                            >
                                Saved
                            </Button>
                        )}
                    </Row>
                    <Spacer y={0.5} />
                    <Text>Liked by {likesLength}</Text>
                    <Text
                        h1
                        size={30}
                        css={{
                            textGradient: '90deg, #fedb58, #fc924c',
                        }}
                        weight="bold"
                    >
                        Ingrediente:
                    </Text>
                    <Text size={20}>
                        {post.ingredients.map((ingredient: Ingredient, index: number) => (
                            <li
                                key={index}
                            >{`${ingredient.quantity} ${ingredient.measureUnit} of ${ingredient.name} `}</li>
                        ))}
                    </Text>
                </Grid.Container>
            </Row>
        </>
    );
}

export default RecipeCard;
