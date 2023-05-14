import { Badge, Grid, Loading, styled, Dropdown } from '@nextui-org/react';
import NotificationsIcon from '../assets/NotificationsIcon';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { getFollowNotif, getUserData } from '../database';

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
    const [followNotif, setFollowNotif] = useState([] as any);
    const [numNotif, setNumNotif] = useState(0);
    const [buildNotif, setBuildNotif] = useState([] as string[]);

    if (!user) {
        return <Loading />;
    }

    useEffect(() => {
        if (!user) {
            return;
        }

        const myFollowNotif = async () => {
            const followNotifResult = await getFollowNotif(user.uid);
            setFollowNotif(followNotifResult);
        };

        myFollowNotif();
    }, [user]);

    useEffect(() => {
        setNumNotif(followNotif.length);
        console.log('num:', numNotif);
    }, [followNotif, numNotif]);

    const handleNotif = async () => {
        console.log('followNotif:', followNotif);
        setIsInvisible(!isInvisible);
        console.log('clicked');

        const newNotif = [];
        for (let i = 0; i < followNotif.length; i++) {
            const followerId = followNotif[i];
            const followerData = await getUserData(followerId as string);
            if (!followerData) {
                continue;
            }
            const followerUsername = followerData.username;
            newNotif.push(followerUsername);
        }
        setBuildNotif(newNotif);
        console.log('build:', buildNotif);
    };

    return (
        <Grid.Container alignItems="center" gap={2}>
            <Grid>
                <StyledButton aria-label="more than 99 notifications">
                    <Badge color="error" content={numNotif} isInvisible={isInvisible} shape="circle">
                        <NotificationsIcon onClick={handleNotif} fill="currentColor" size={30} />
                    </Badge>
                </StyledButton>
            </Grid>
        </Grid.Container>
    );
}

export default Notifications;
