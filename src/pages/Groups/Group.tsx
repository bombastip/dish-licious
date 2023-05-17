import { Col } from '@nextui-org/react';
import { GroupPosts, Sidebar } from '../../components/Groups';
import { useLocation } from 'react-router-dom';

const Group = () => {
    const queryParams = new URLSearchParams(useLocation().search);
    const groupID = queryParams.get('groupID') as string;

    return (
        <div>
            <Col span={2} css={{ paddingLeft: '0px' }}>
                <Sidebar groupID={groupID} />
            </Col>
            <Col span={10}>
                <GroupPosts groupID={groupID}/>
            </Col>
        </div>
    );
};

export default Group;
