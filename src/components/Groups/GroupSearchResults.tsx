import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../config';
import { GroupList } from '.';
import { Loading } from '@nextui-org/react';
import { GroupCardInfo } from '../../interfaces/interfaces';
interface UserSearchProps {
    groupName: string;
}

const getGroups = async () => {
    const q = query(collection(db, 'groups'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        data.id = doc.id;
        return data as GroupCardInfo;
    });
};

const GroupSearchResults = (props: UserSearchProps) => {
    const [groups, setGroups] = useState<GroupCardInfo[]>([]);
    const [filteredList, setFilteredList] = useState<GroupCardInfo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getGroups();
            setGroups(data);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (props.groupName === '') {
            setFilteredList([]);
            return;
        }
        const filteredList = groups.filter(group => group.name.toLowerCase().includes(props.groupName.toLowerCase()));
        setFilteredList(filteredList);
    }, [props.groupName]);

    return isLoading ? <Loading size="xl" /> : <GroupList groups={filteredList} />;
};

export default GroupSearchResults;
