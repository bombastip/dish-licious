import { Container, Spacer } from '@nextui-org/react';
import { useLocation } from 'react-router-dom';
import { getGroupData, getUserData } from '../../database';
import { useEffect, useState } from 'react';
import { GroupType, UserData } from '../../interfaces';
import { GroupDetails, GroupImageCard, GroupPosts } from '../../components/Groups';

const Group = () => {
    const queryParams = new URLSearchParams(useLocation().search);
    const groupId = queryParams.get('groupId') as string;
    const [group, setGroup] = useState({} as GroupType);
    const [admin, setAdmin] = useState({} as UserData);

    useEffect(() => {
        const getGroup = async () => {
            const groupTemp = await getGroupData(groupId);
            setGroup(groupTemp as GroupType);
        };
        getGroup();
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            if (!group.admin) {
                return;
            }
            const userData = await getUserData(group.admin);
            if (!userData) {
                return;
            }
            setAdmin(userData as UserData);
        };
        loadUserData();
    }, [group.admin]);

    return (
        <div>
            <Spacer y={1} />
            <Container css={{ w: '80%', h: '500px' }}>
                <GroupImageCard group={group} groupId={groupId} />
                <Spacer y={1} />
                <GroupDetails group={group} admin={admin} />
                <GroupPosts groupId={groupId} />
            </Container>
        </div>
    );
};

export default Group;
