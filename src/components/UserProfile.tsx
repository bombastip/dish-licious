import { Avatar, Grid, Text, Button } from '@nextui-org/react';
import { db } from '../config';
import { doc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const { user, userLoading } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (userLoading || !user) {
            setUsername('');
            setPhotoURL('');
            return;
        }
        const docRef = doc(db, 'users', user.uid);
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

    const handleFollowers = () => {
        navigate('/followers');
    };

    const handleFollowing = () => {
        navigate('/following');
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
                    <Grid>
                        <Text h2>{username}</Text>
                    </Grid>

                    <Grid.Container gap={2}>
                        <Grid>
                            <Button disabled color="primary" auto>
                                {posts.length} Posts
                            </Button>
                        </Grid>
                        <Grid>
                            <Button onPress={handleFollowers} color="primary" auto>
                                {followers.length} Followers
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
    );
}

export default UserProfile;
