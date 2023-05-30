import { Badge, Loading, Dropdown, Navbar, Text, Container, Button } from '@nextui-org/react';
import NotificationsIcon from '../assets/NotificationsIcon';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context';
import {
    getFollowNotif,
    getUserData,
    removeNotification,
    getGroupNotif,
    getGroupData,
    removeGroupNotif,
    addGroupMember,
} from '../database';
import { useNavigate, useLocation } from 'react-router-dom';

export interface NotificationType {
    type: string;
    groupName: string;
    groupID: string;
    username: string;
    userID: string;
    message: string;
}

function Notifications() {
    const { user, userLoading } = useContext(AuthContext);

    const [followersIds, setFollowersIds] = useState([] as string[]);
    const [followersUsernames, setFollowersUsernames] = useState([] as string[]);

    const [possibleMembersIds, setPossibleMembersIds] = useState([] as string[]);
    const [possibleMembersUsernames, setPossibleMembersUsernames] = useState([] as string[]);
    const [myGroupsIds, setMyGroupsIds] = useState([] as string[]);
    const [myGroupsNames, setMyGroupsNames] = useState([] as string[]);
    const [messages, setMessages] = useState([] as NotificationType[]);
    const [disabledKeys, setDisabledKeys] = useState(['noNotif'] as string[]);

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

    useEffect(() => {
        if (!user) {
            return;
        }

        const myGroupNotif = async () => {
            if (!user) {
                return;
            }
            const groupNotifResult = await getGroupNotif(user.uid);
            const myGroupsIds = [];
            const possibleMembersIds = [];
            if (!groupNotifResult) {
                return;
            }
            for (let i = 0; i < groupNotifResult.length; i++) {
                myGroupsIds.push(groupNotifResult[i].groupID);
                possibleMembersIds.push(groupNotifResult[i].userID);
            }
            setMyGroupsIds(myGroupsIds);
            setPossibleMembersIds(possibleMembersIds);
        };

        myGroupNotif();
    }, [user, location]);

    useEffect(() => {
        if (!user) {
            return;
        }
        const createMessages = async () => {
            const messages = [] as NotificationType[];
            for (let i = 0; i < followersUsernames.length; i++) {
                const data = {
                    type: 'follow',
                    groupName: '',
                    groupID: 'noGroup',
                    username: followersUsernames[i],
                    userID: followersIds[i],
                    message: ` started following you`,
                };
                messages.push(data as NotificationType);
            }
            for (let i = 0; i < possibleMembersUsernames.length; i++) {
                const data = {
                    type: 'group',
                    groupName: myGroupsNames[i],
                    groupID: myGroupsIds[i],
                    username: possibleMembersUsernames[i],
                    userID: possibleMembersIds[i],
                    message: ` wants to join your group `,
                };
                messages.push(data as NotificationType);
                setDisabledKeys([...disabledKeys, data.userID + ' ' + data.groupID]);
            }
            setMessages(messages);
        };
        createMessages();
    }, [followersUsernames, possibleMembersUsernames, myGroupsNames]);

    const handleNotif = async () => {
        const newNotif = [];
        const membersUsernames = [];
        const groupNames = [];
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
        for (let i = 0; i < possibleMembersIds.length; i++) {
            const possibleMemberId = possibleMembersIds[i];
            const possibleMemberData = await getUserData(possibleMemberId as string);
            if (!possibleMemberData) {
                continue;
            }
            const possibleMemberUsername = possibleMemberData.username;
            membersUsernames.push(possibleMemberUsername);
        }
        setPossibleMembersUsernames(membersUsernames);
        for (let i = 0; i < myGroupsIds.length; i++) {
            const myGroupId = myGroupsIds[i];
            const myGroupData = await getGroupData(myGroupId as string);
            if (!myGroupData) {
                continue;
            }
            const myGroupName = myGroupData.name;
            groupNames.push(myGroupName);
        }
        setMyGroupsNames(groupNames);
    };

    const handleAction = async (actionKey: string) => {
        if (actionKey === 'noNotif') {
            return;
        }
        const [userID, groupID] = actionKey.split(' ');
        if (groupID === 'noGroup') {
            await removeNotification(user.uid, userID);
            navigate(`/user-profile?userId=${userID}`);
        }
    };

    const handleAccept = async (userID: string, groupID: string) => {
        await addGroupMember(groupID, userID);
        await removeGroupNotif(userID, groupID, user.uid);
        setMessages(messages.filter(message => message.userID !== userID || message.groupID !== groupID));
        setPossibleMembersIds(possibleMembersIds.filter(id => id !== userID));
    };

    const handleReject = async (userID: string, groupID: string) => {
        await removeGroupNotif(userID, groupID, user.uid);
        setMessages(messages.filter(message => message.userID !== userID || message.groupID !== groupID));
        setPossibleMembersIds(possibleMembersIds.filter(id => id !== userID));
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
                        content={followersIds.length + possibleMembersIds.length}
                        isInvisible={!(possibleMembersIds.length + followersIds.length) ? true : false}
                        shape="circle"
                    >
                        <NotificationsIcon fill="currentColor" size={30} />
                    </Badge>
                </Dropdown.Button>
            </Navbar.Item>
            <Dropdown.Menu
                disabledKeys={disabledKeys}
                onAction={actionKey => handleAction(actionKey as string)}
                aria-label="Notifications"
                css={{
                    $$dropdownMenuWidth: '340px',
                    $$dropdownItemHeight: '95px',
                    zIndex: '100',
                    '& .nextui-dropdown-item': {
                        py: '$4',
                        svg: {
                            color: '$secondary',
                            mr: '$4',
                        },
                        '& .nextui-dropdown-item-content': {
                            w: '250px',
                            fontWeight: '$semibold',
                        },
                    },
                }}
            >
                {followersIds.length || possibleMembersIds.length ? (
                    messages.map(notif => (
                        <Dropdown.Item key={notif.userID + ' ' + notif.groupID} textValue="notifications">
                            <Container css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {notif.type === 'follow' ? (
                                    <>
                                        <Text b color="#ec9127">
                                            {notif.username}
                                        </Text>
                                        &nbsp;
                                        <Text>{notif.message}</Text>
                                    </>
                                ) : (
                                    <>
                                        <Text b color="#ec9127">
                                            {notif.username}
                                        </Text>
                                        &nbsp;
                                        <Text>{notif.message}</Text>
                                        &nbsp;
                                        <Text b color="#ec9127">
                                            {notif.groupName}
                                        </Text>
                                        <Button.Group>
                                            <Button
                                                css={{ ml: '$4', width: '50px' }}
                                                shape="round"
                                                color="primary"
                                                variant="ghost"
                                                onClick={() => handleAccept(notif.userID, notif.groupID)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                css={{ ml: '$4', width: '50px' }}
                                                shape="round"
                                                color="primary"
                                                variant="ghost"
                                                onClick={() => handleReject(notif.userID, notif.groupID)}
                                            >
                                                Reject
                                            </Button>
                                        </Button.Group>
                                    </>
                                )}
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
