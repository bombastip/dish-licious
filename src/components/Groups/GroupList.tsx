import { Container, Loading } from '@nextui-org/react';
import { GroupCard } from '.';
import { GroupType } from '../../interfaces';
import { AuthContext } from '../../context';
import { useContext, useEffect, useState } from 'react';
import { getGroups, getGroupData } from '../../database';

const GroupList = () => {
    const { user } = useContext(AuthContext);
    const [groupIds, setGroupIds] = useState<string[]>([]);
    const [groupCardInfo, setGroupCardInfo] = useState<GroupType[]>([]);
    if (!user) {
        return <Loading />;
    }
    useEffect(() => {
        const getGroupsList = async () => {
            const groups = await getGroups(user.uid);
            console.log('groups: ', groups);
            setGroupIds(groups);
        };
        getGroupsList();
    }, [user]);

    useEffect(() => {
        const getGroupsData = async () => {
            groupIds.map(async groupId => {
                const groupData = await getGroupData(groupId);
                if (!groupData) {
                    return;
                }
                groupData.id = groupId;
                setGroupCardInfo(groupCardInfo => [...groupCardInfo, groupData] as GroupType[]);
            }, []);
        };
        getGroupsData();
    }, [groupIds]);

    return (
        <Container css={{ display: 'flex', justifyContent: 'center' }}>
            {groupCardInfo.map(group => (
                <GroupCard groupCardInfo={group} key={group.name} />
            ))}
        </Container>
    );
};

export default GroupList;
