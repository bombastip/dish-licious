import { Button, Container, Loading, Spacer, Text } from '@nextui-org/react';
import { GroupList } from '../../components/Groups';
import { useState, useEffect, useContext } from 'react';
import { getGroups, getGroupData } from '../../database';
import { GroupCardInfo } from '../../interfaces';
import { AuthContext } from '../../context';

const Groups = () => {
    const { user } = useContext(AuthContext);
    const [groupIds, setGroupIds] = useState<string[]>([]);
    const [groupCardInfo, setGroupCardInfo] = useState<GroupCardInfo[]>([]);

    const handleCreateGroup = () => {
        window.location.href = '/group/create';
    };
    if (!user) {
        return <Loading size="xl" />;
    }

    useEffect(() => {
        if (!user) {
            return;
        }
        const getGroupsList = async () => {
            const groups = await getGroups(user.uid);
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
                setGroupCardInfo(groupCardInfo => [...groupCardInfo, groupData] as GroupCardInfo[]);
            }, []);
        };
        getGroupsData();
    }, [groupIds]);

    return (
        <>
            <Container css={{ display: 'flex', flexDirection: 'row', marginTop: '10px', justifyContent: 'center' }}>
                <Text
                    h1
                    size={40}
                    css={{
                        textGradient: '90deg, #fedb58, #fc924c',
                    }}
                    weight="bold"
                >
                    Connect with fellow foodies via group communities
                </Text>
                <Spacer x={1} />
                <Button color="primary" css={{ marginTop: '10px' }} onClick={handleCreateGroup}>
                    Create a group
                </Button>
            </Container>
            <GroupList groups={groupCardInfo} />
        </>
    );
};

export default Groups;
