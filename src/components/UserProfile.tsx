import { Avatar, Grid, Text, Button, Spacer } from '@nextui-org/react';
import { db } from '../config';
import { doc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context';
import { useNavigate } from 'react-router-dom';
import { follow, unfollow, checkFollow } from '../database';
import { PostType } from '../interfaces';
import SinglePost from './SinglePost';

type Props = {
    currentUserId: string;
};

function UserProfile({ currentUserId }: Props) {
    const { user, userLoading } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [followersLength, setFollowersLength] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (userLoading || !user) {
            setUsername('');
            setPhotoURL('');
            return;
        }
        const docRef = doc(db, 'users', currentUserId);
        getDoc(docRef)
            .then(doc => {
                if (doc.exists()) {
                    setUsername(doc.data().username);
                    setPhotoURL(doc.data().photoURL);
                    setFollowers(doc.data().followers);
                    setFollowersLength(followers.length);
                    setFollowing(doc.data().following);
                    // console.log(username);
                } else {
                    // console.log(`User documentnot found`);
                }
            })
            .catch(error => {
                console.log(`Error retrieving user document: ${error}`);
            });
    }, [user, username, userLoading]);

    useEffect(() => {
        if (userLoading || !user) {
            return;
        }
        const check = async () => {
            try {
                const isFollowing = await checkFollow(user.uid, currentUserId);
                setIsFollowing(isFollowing);
            } catch (error) {
                console.log(error);
            }
        };
        check();
    }, [user, username, userLoading]);

    useEffect(() => {
        const getMyPosts = async () => {
            try {
                const docRef = doc(db, 'users', currentUserId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const myPosts = [];
                    for (const post of docSnap.data().posts) {
                        const postRef = doc(db, 'posts', post);
                        const data = (await getDoc(postRef)).data() as PostType;
                        data.id = post;
                        myPosts.push(data as PostType);
                    }
                    setPosts(myPosts);
                } else {
                    console.log('No such document!');
                    setPosts([]);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getMyPosts();
    }, [currentUserId]);

    const handleFollowers = () => {
        if (user?.uid !== currentUserId) {
            navigate(`/user-followers?userId=${currentUserId}`);
            console.log('here');
            return;
        }
        navigate('/followers');
    };

    const handleFollowing = () => {
        if (user?.uid !== currentUserId) {
            navigate(`/user-following?userId=${currentUserId}`);
            console.log('here');
            return;
        }
        navigate('/following');
    };

    const handleFollow = async (wantToFollow: string, currentUser: string) => {
        setIsFollowing(true);
        setFollowersLength(followersLength + 1);
        await follow(wantToFollow, currentUser);
    };

    const handleUnfollow = async (wantToUnfollow: string, currentUser: string) => {
        setIsFollowing(false);
        setFollowersLength(followersLength - 1);
        await unfollow(wantToUnfollow, currentUser);
    };

    return (
        <>
            <Grid.Container
                gap={2}
                css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '35vh' }}
            >
                <Grid>
                    <Grid.Container gap={1} alignItems="center" css={{ flexDirection: 'column' }}>
                        <Grid>
                            <Spacer y={0.5} />
                            <Avatar src={photoURL} css={{ width: '160px', height: '160px' }} zoomed />
                        </Grid>
                        <Grid.Container
                            gap={1}
                            alignItems="center"
                            css={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                        >
                            <Grid>
                                <Text h2>{username}</Text>
                            </Grid>
                            <Grid>
                                {user &&
                                    user.uid !== currentUserId &&
                                    (isFollowing ? (
                                        <Button
                                            auto
                                            color="gray300"
                                            onPress={() => handleUnfollow(currentUserId, user.uid)}
                                        >
                                            Unfollow
                                        </Button>
                                    ) : (
                                        <Button
                                            auto
                                            color="secondary"
                                            onPress={() => handleFollow(currentUserId, user.uid)}
                                        >
                                            Follow
                                        </Button>
                                    ))}
                            </Grid>
                        </Grid.Container>
                        <Grid.Container gap={2}>
                            <Grid>
                                <Button disabled color="primary" auto>
                                    {posts.length} Posts
                                </Button>
                            </Grid>
                            <Grid>
                                <Button onPress={handleFollowers} color="primary" auto>
                                    {followersLength} Followers
                                </Button>
                            </Grid>
                            <Grid>
                                <Button onPress={handleFollowing} color="primary" auto>
                                    {following.length} Following
                                </Button>
                            </Grid>
                        </Grid.Container>
                    </Grid.Container>
                </Grid>
            </Grid.Container>

            {/* posts */}
            <Spacer y={3} />

            <Grid.Container gap={2} justify="center" css={{ marginTop: '20px' }}>
                {posts &&
                    posts
                        .slice()
                        .reverse()
                        .map(post => (
                            <Grid wrap="wrap">
                                <SinglePost post={post} />
                                <Spacer y={0.5} />
                            </Grid>
                        ))}
            </Grid.Container>
        </>
    );
}

export default UserProfile;
