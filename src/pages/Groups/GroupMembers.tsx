import { useLocation } from 'react-router-dom';
import { ListOfUsers } from '../../components';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context';
import { GroupType } from '../../interfaces';
import { getGroupData } from '../../database';

const GroupMembers = () => {
    const queryParams = new URLSearchParams(useLocation().search);
    const groupId = queryParams.get('groupId') as string;
    const { user } = useContext(AuthContext);
    const [group, setGroup] = useState({} as GroupType);
    const [members, setMembers] = useState([] as string[]);

    useEffect(() => {
        const getGroup = async () => {
            const groupTemp = await getGroupData(groupId);
            setGroup(groupTemp as GroupType);
        };
        getGroup();
    }, []);

    useEffect(() => {
        setMembers(group.members);
    }, [group.members]);

    return <ListOfUsers users={members} currentUserId={user?.uid || ''} title="Fellow foodies" />;
};

export default GroupMembers;
