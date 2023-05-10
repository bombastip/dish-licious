import { Avatar, Grid, Text, Button, Spacer } from '@nextui-org/react';
import { db } from '../config';
import { doc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context';
import { useNavigate } from 'react-router-dom';
import { follow, unfollow, checkFollow } from '../database';

type Props = {
    currentUserId: string;
};

function UserProfile({ currentUserId }: Props) {
    const { user, userLoading } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
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
                    setFollowing(doc.data().following);
                    setPosts(doc.data().posts);
                    console.log(username);
                } else {
                    console.log(`User documentnot found`);
                }
            })
            .catch(error => {
                console.log(`Error retrieving user document: ${error}`);
            });
    }, [user, username, userLoading]);

    useEffect(() => {
        const docRef = doc(db, 'users', currentUserId);
        getDoc(docRef)
            .then(doc => {
                if (doc.exists()) {
                    setFollowers(doc.data().followers);
                    setFollowing(doc.data().following);
                } else {
                    console.log(`User documentnot found`);
                }
            })
            .catch(error => {
                console.log(`Error retrieving user document: ${error}`);
            });
    }, [followers, following]);

    useEffect(() => {
        if (userLoading || !user) {
            return;
        }
        const check = async () => {
            const isFollowing = await checkFollow(user.uid, currentUserId);
            setIsFollowing(isFollowing);
        };
        check();
    }, [user, username, userLoading]);

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
        await follow(wantToFollow, currentUser);
    };

    const handleUnfollow = async (wantToUnfollow: string, currentUser: string) => {
        setIsFollowing(false);
        await unfollow(wantToUnfollow, currentUser);
    };

    return (
        <Grid.Container
            gap={2}
            css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '35vh' }}
        >
            <Grid>
                <Grid.Container gap={1} alignItems="center" css={{ flexDirection: 'column' }}>
                    <Grid>
                        <Avatar src={photoURL} css={{ width: '160px', height: '160px' }} zoomed />
                    </Grid>
                    <Grid.Container
                        gap={1}
                        alignItems="center"
                        css={{ fdisplay: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                    >
                        <Grid>
                            <Text h2>{username}</Text>
                        </Grid>
                        <Spacer x={0.5} />
                        <Grid>
                            {user &&
                                user.uid !== currentUserId &&
                                (isFollowing ? (
                                    <Button
                                        auto
                                        color="gray300"
                                        onClick={() => handleUnfollow(currentUserId, user.uid)}
                                    >
                                        Unfollow
                                    </Button>
                                ) : (
                                    <Button
                                        auto
                                        color="secondary"
                                        onClick={() => handleFollow(currentUserId, user.uid)}
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
                                {followers ? `${followers.length} Followers` : '? Followers'}
                            </Button>
                        </Grid>
                        <Grid>
                            <Button onPress={handleFollowing} color="primary" auto>
                                {following ? `${following.length} Following` : '? Following'}
                            </Button>
                        </Grid>
                    </Grid.Container>
                </Grid.Container>
            </Grid>
        </Grid.Container>
    );
}

export default UserProfile;
