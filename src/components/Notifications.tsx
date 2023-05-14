import { Badge, Loading, styled, Dropdown, Navbar, Text } from '@nextui-org/react';
import NotificationsIcon from '../assets/NotificationsIcon';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { getFollowNotif, getUserData } from '../database';
import { useNavigate } from 'react-router-dom';

const StyledButton = styled('button', {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    '&:active': {
        opacity: 0.8,
    },
});

function Notifications() {
    const [isInvisible, setIsInvisible] = useState(false);
    const { user } = useContext(AuthContext);
    const [followersIds, setFollowersIds] = useState([] as string[]);
    const [numNotif, setNumNotif] = useState(0);
    const [followersUsernames, setFollowersUsernames] = useState([] as string[]);
    const navigate = useNavigate();

    if (!user) {
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
    }, [user]);

    useEffect(() => {
        setNumNotif(followersIds.length);
        console.log('num:', numNotif);
    }, [followersIds, numNotif]);

    const handleNotif = async () => {
        console.log('followersIds:', followersIds);
        if (!isInvisible) {
            setIsInvisible(!isInvisible);
        }
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
        navigate(`/user-profile?userId=${actionKey}`);
    };

    return (
        <Dropdown>
            <Navbar.Item>
                <Dropdown.Button
                    onClick={handleNotif}
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
                    <StyledButton aria-label="more than 99 notifications">
                        <Badge color="error" content={numNotif} isInvisible={isInvisible} shape="circle">
                            <NotificationsIcon fill="currentColor" size={30} />
                        </Badge>
                    </StyledButton>
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
                {followersUsernames.map((notif, index) => (
                    <Dropdown.Item key={followersIds[index]}>
                        <Text b color="#ec9127">
                            {notif}
                        </Text>{' '}
                        started following you
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default Notifications;
