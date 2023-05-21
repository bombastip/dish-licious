import { Card, Text, Button, Row, User, Spacer, Image, Col, Dropdown } from '@nextui-org/react';
import { HeartIcon } from '../assets/HeartIcon';
import { useEffect, useState } from 'react';
import { getDoc, collection, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { PostType } from '../interfaces';
import { Link } from 'react-router-dom';
import { deletePost } from '../database';
import { DeleteDocumentIcon } from '../assets/DeleteDocumentIcon';

type Props = {
    post: PostType;
};

function SinglePost({ post }: Props) {
    const { user } = useContext(AuthContext);
    const userCollectionRef = collection(db, 'users');
    const postCollectionRef = collection(db, 'posts');
    const [likesLength, setLikesLength] = useState(0);
    const [liked, setLiked] = useState(true);
    const [saved, setSaved] = useState(true);
    const [userName, setUserName] = useState('');
    const [photoUser, setPhotoUser] = useState('');
    const [userID, setUserID] = useState('');
    const [deleted, setDeleted] = useState(false);
    const [unfav, setUnfav] = useState(false);

    if (post.id === '') {
        return <> </>;
    }

    useEffect(() => {
        const getLikes = async () => {
            try {
                const docRef = doc(db, 'posts', post.id);
                if (docRef === undefined || !docRef) return;
                getDoc(docRef).then(doc => {
                    if (doc.exists()) {
                        setLikesLength(doc.data().likes.length);
                    }
                });
            } catch (error) {
                console.log(error);
            }
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
                const userdocRef = doc(db, 'users', user.uid);
                const docUserSnap = await getDoc(userdocRef);
                const saved = docUserSnap.data()?.favourites.includes(post.id);
                setSaved(saved);
                const userPostdocRef = doc(db, 'users', post.userID);
                const docUserPostSnap = await getDoc(userPostdocRef);
                const userName = docUserPostSnap.data()?.username;
                const photoUser = docUserPostSnap.data()?.photoURL;
                const userID = docUserPostSnap.data()?.id;
                setPhotoUser(photoUser);
                setUserName(userName);
                setUserID(userID);
            } catch (error) {
                console.log(error);
            }
        };
        check();
    }, [user, post.id]);

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
            setUnfav(true);
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

    const handleDeletePost = async () => {
        try {
            await deletePost(post.id);
            setDeleted(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAction = async (action: string) => {
        if (action === 'delete') {
            await handleDeletePost();
        }
    };

    return (
        <>
            {' '}
            {!deleted && !unfav ? (
                <Card isHoverable variant="bordered" css={{ mw: '400px' }}>
                    <Card.Header>
                        <Text b css={{ whiteSpace: 'nowrap' }}>
                            {post.title}
                        </Text>
                        <Row justify="flex-end">
                            <Link to={`/user-profile?userId=${userID}`}>
                                <User css={{ cursor: 'pointer' }} src={photoUser} name={userName} />
                            </Link>
                        </Row>
                    </Card.Header>
                    <Card.Divider />
                    <Link to={`/post?postId=${post.id}`}>
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
                            <Row css={{ display: 'flex' }}>
                                <Text color="#ec9127" css={{ marginLeft: '$1' }}>
                                    {' '}
                                    Liked by {likesLength}{' '}
                                </Text>
                            </Row>
                            <Spacer y={0.3} />
                            <Row>
                                <Text
                                    css={{
                                        height: '5em',
                                        marginLeft: '$1',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 3,
                                    }}
                                >
                                    Mod de preparare: {post.description}
                                </Text>
                            </Row>
                            <Row>
                                <Text>
                                    {' '}
                                    Time Cost: {post.timeCost} {post.timeUnit}
                                </Text>
                            </Row>
                        </Card.Body>
                    </Link>
                    <Card.Divider />

                    <Card.Footer>
                        <Row justify="flex-start">
                            {!liked ? (
                                <Button
                                    auto
                                    css={{ mr: '$2', background: '$myColor' }}
                                    onPress={() => like()}
                                    icon={<HeartIcon fill="white" filled />}
                                />
                            ) : (
                                <Button
                                    auto
                                    css={{ mr: '$2', backgroundColor: 'transparent', border: 'none' }}
                                    onPress={() => unlike()}
                                    icon={<HeartIcon filled fill="#F31260" />}
                                />
                            )}
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
                        <Row justify="flex-end">
                            <Link to={`/post?postId=${post.id}`}>
                                <Button>View comment list</Button>
                            </Link>
                            <Spacer x={0.5} />
                            {user && user.uid === post.userID && (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <Card
                                            css={{
                                                width: '15px',
                                                marginTop: '-20px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                size: '15px',
                                            }}
                                        >
                                            <Col
                                                css={{
                                                    marginTop: '-5px',
                                                    marginBottom: '-23px',
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'flex-end',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <Text>.</Text>
                                            </Col>
                                            <Col
                                                css={{
                                                    marginBottom: '-23px',
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'flex-end',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <Text>.</Text>
                                            </Col>
                                            <Col
                                                css={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'flex-end',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <Text>.</Text>
                                            </Col>
                                        </Card>
                                    </Dropdown.Trigger>
                                    <Dropdown.Menu
                                        color="secondary"
                                        aria-label="Actions"
                                        onAction={actionKey => handleAction(actionKey as string)}
                                    >
                                        <Dropdown.Item
                                            key="delete"
                                            color="error"
                                            icon={<DeleteDocumentIcon size={22} fill="currentColor" />}
                                            css={{ fontWeight: '$semibold' }}
                                        >
                                            Delete post
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </Row>
                    </Card.Footer>
                </Card>
            ) : null}
        </>
    );
}
export default SinglePost;
