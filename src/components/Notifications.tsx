import { Badge, Loading, Dropdown, Navbar, Text, Container, Spacer } from '@nextui-org/react';
import NotificationsIcon from '../assets/NotificationsIcon';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { getFollowNotif, getUserData, removeNotification } from '../database';
import { useNavigate, useLocation } from 'react-router-dom';

function Notifications() {
    const { user, userLoading } = useContext(AuthContext);
    const [followersIds, setFollowersIds] = useState([] as string[]);
    const [followersUsernames, setFollowersUsernames] = useState([] as string[]);
    const navigate = useNavigate();
    const location = useLocation();

    if (!user || userLoading) {
        return <Loading />;
    }

    useEffect(() => {
        if (!user) {
            return;
        }

        const myFollowNotif = async () => {
            const followNotifResult = await getFollowNotif(user.uid);
            setFollowersIds(followNotifResult);
        };

        myFollowNotif();
    }, [user, location]);

    const handleNotif = async () => {
        console.log('followersIds:', followersIds);
        console.log('clicked');

        const newNotif = [];
        for (let i = 0; i < followersIds.length; i++) {
            const followerId = followersIds[i];
            const followerData = await getUserData(followerId as string);
            if (!followerData) {
                continue;
            }
            const followerUsername = followerData.username;
            newNotif.push(followerUsername);
        }
        setFollowersUsernames(newNotif);
        console.log('build:', followersUsernames);
    };

    const handleAction = async (actionKey: string) => {
        if (actionKey === 'noNotif') {
            return;
        }
        await removeNotification(user.uid, actionKey);
        console.log('len:', followersIds.length);
        navigate(`/user-profile?userId=${actionKey}`);
    };

    return (
        <Dropdown>
            <Navbar.Item>
                <Dropdown.Button
                    onPress={handleNotif}
                    auto
                    light
                    css={{
                        px: 0,
                        dflex: 'center',
                        svg: { pe: 'none' },
                        mw: '100%',
                    }}
                    ripple={false}
                >
                    <Badge
                        color="error"
                        content={followersIds.length}
                        isInvisible={!followersIds.length ? true : false}
                        shape="circle"
                    >
                        <NotificationsIcon fill="currentColor" size={30} />
                    </Badge>
                </Dropdown.Button>
            </Navbar.Item>
            <Dropdown.Menu
                onAction={actionKey => handleAction(actionKey as string)}
                aria-label="Notifications"
                css={{
                    $$dropdownMenuWidth: '340px',
                    $$dropdownItemHeight: '70px',
                    zIndex: '100',
                    '& .nextui-dropdown-item': {
                        py: '$4',
                        svg: {
                            color: '$secondary',
                            mr: '$4',
                        },
                        '& .nextui-dropdown-item-content': {
                            w: '100%',
                            fontWeight: '$semibold',
                        },
                    },
                }}
            >
                {followersIds.length ? (
                    followersUsernames.map((notif, index) => (
                        <Dropdown.Item key={followersIds[index]} textValue="notifications">
                            <Container css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Text b color="#ec9127">
                                    {notif}
                                </Text>
                                <Spacer x={0.2} />
                                <Text>started following you</Text>
                            </Container>
                        </Dropdown.Item>
                    ))
                ) : (
                    <Dropdown.Item key="noNotif" textValue="noNotifications">
                        <Container css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Text b color="#ec9127">
                                No new notifications
                            </Text>
                        </Container>
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default Notifications;
