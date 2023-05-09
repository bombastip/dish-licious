import { Grid, Avatar, Text, Spacer, Button, Loading } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { getUserData, follow, unfollow, checkFollow } from '../database';

export type Props = {
    users: string[];
    currentUserId: string;
};

export type ListUser = {
    id: string;
    username: string;
    photoURL: string;
    isFollowing: boolean;
};

export async function getListOfUsers(users: string[], currentUserId: string) {
    const list: ListUser[] = [];

    for (const user of users) {
        const userData = await getUserData(user);
        if (!userData) {
            continue;
        }
        const isFollowing = await checkFollow(currentUserId, user);
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
                height: '35vh',
            }}
        >
            {list.map(item => (
                <Grid.Container
                    key={item.id}
                    gap={2}
                    css={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                >
                    <Grid key={item.id} xs={3} css={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={item.photoURL} size="lg" />
                        <Spacer y={1} x={3} />
                        <Text>{item.username}</Text>
                        <Spacer y={1} x={3} />
                        {item.isFollowing ? (
                            <Button auto color="secondary" onClick={() => handleUnfollow(item.id, currentUserId)}>
                                Unfollow
                            </Button>
                        ) : (
                            <Button auto color="secondary" onClick={() => handleFollow(item.id, currentUserId)}>
                                Follow
                            </Button>
                        )}
                    </Grid>
                </Grid.Container>
            ))}
        </Grid.Container>
    );
}

export default ListOfUsers;
