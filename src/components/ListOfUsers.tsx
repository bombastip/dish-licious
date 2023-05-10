import { Grid, Avatar, Text, Spacer, Button, Loading } from '@nextui-org/react';
import { getUserData, follow, unfollow, checkFollow } from '../database';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context';

type Props = {
    users: string[];
    currentUserId: string;
};

type ListUser = {
    id: string;
    username: string;
    photoURL: string;
    isFollowing: boolean;
};

async function getListOfUsers(users: string[], currentUserId: string) {
    const list: ListUser[] = [];

    for (const user of users) {
        const userData = await getUserData(user);
        if (!userData) {
            continue;
        }
        const isFollowing = await checkFollow(currentUserId, user);
        console.log('urmareste??', isFollowing);
        list.push({
            id: user,
            username: userData.username,
            photoURL: userData.photoURL,
            isFollowing: isFollowing,
        });
    }

    return list;
}

function ListOfUsers({ users, currentUserId }: Props) {
    const { user, userLoading } = useContext(AuthContext);

    if (userLoading || !user) {
        return <Loading />;
    }

    const [list, setList] = useState<ListUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        getListOfUsers(users, currentUserId).then(list => {
            setList(list);
            setLoading(false);
        });
    }, [users]);

    const handleFollow = async (wantToFollow: string, currentUser: string) => {
        const updatedList = list.map(user => {
            if (user.id === wantToFollow) {
                return { ...user, isFollowing: true };
            }
            return user;
        });
        setList(updatedList);
        await follow(wantToFollow, currentUser);
    };

    const handleUnfollow = async (wantToUnfollow: string, currentUser: string) => {
        const updatedList = list.map(user => {
            if (user.id === wantToUnfollow) {
                return { ...user, isFollowing: false };
            }
            return user;
        });
        setList(updatedList);
        await unfollow(wantToUnfollow, currentUser);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <Grid.Container
            gap={2}
            css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
             <Spacer y={1} />
            {list.map(item => (
                <Grid.Container
                    key={item.id}
                    gap={2}
                    css={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                >
                    <Grid key={item.id} xs={3} css={{ display: 'flex', alignItems: 'center' }}>
                        {user.uid !== item.id ? (
                            <Link to={`/user-profile?userId=${item.id}`}>
                                <Avatar src={item.photoURL} size="lg" css={{ cursor: 'pointer' }} />
                            </Link>
                        ) : (
                            <Link to="/profile">
                                <Avatar src={item.photoURL} size="lg" css={{ cursor: 'pointer' }} />
                            </Link>
                        )}
                        <Spacer y={1} x={3} />
                        <Link to={`/user-profile?userId=${item.id}`}>
                            <Text css={{ cursor: 'pointer' }}>{item.username}</Text>
                        </Link>
                        <Spacer y={1} x={3} />
                        {user.uid !== item.id &&
                            (item.isFollowing ? (
                                <Button auto color="gray300" onClick={() => handleUnfollow(item.id, currentUserId)}>
                                    Unfollow
                                </Button>
                            ) : (
                                <Button auto color="secondary" onClick={() => handleFollow(item.id, currentUserId)}>
                                    Follow
                                </Button>
                            ))}
                    </Grid>
                </Grid.Container>
            ))}
        </Grid.Container>
    );
}

export default ListOfUsers;
