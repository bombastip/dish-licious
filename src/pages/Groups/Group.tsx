import { Col } from '@nextui-org/react';
import { GroupPosts, Sidebar } from '../../components/Groups';
import { useLocation } from 'react-router-dom';
import { getGroupData } from '../../database';
import { useEffect, useState } from 'react';
import { GroupType } from '../../interfaces';

const Group = () => {
    const queryParams = new URLSearchParams(useLocation().search);
    const groupId = queryParams.get('groupId') as string;
    const [group, setGroup] = useState({} as GroupType);

    useEffect(() => {
        const getGroup = async () => {
            const group = await getGroupData(groupId);
            console.log(group);
            setGroup(group as GroupType);
        };
        getGroup();
    }, []);

    return (
        <div>
            <h1>{group.name}</h1>
            <Col span={2} css={{ paddingLeft: '0px' }}>
                <Sidebar groupId={groupId} />
            </Col>
            <Col span={10}>
                <GroupPosts groupId={groupId} />
            </Col>
        </div>
    );
};

export default Group;
