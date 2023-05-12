import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config';
import { UserCompleteData } from '../interfaces';
import { UserCard } from '.';
import { Loading } from '@nextui-org/react';
interface UserSearchProps {
    username: string;
}

const getUsers = async () => {
    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserCompleteData);
};

const UserSearchResults = (props: UserSearchProps) => {
    const [users, setUsers] = useState<UserCompleteData[]>([]);
    const [filteredList, setFilteredList] = useState<UserCompleteData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUsers();
            setUsers(data);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const filteredList = users.filter(user => user.username.includes(props.username));
        setFilteredList(filteredList);
    }, [props.username]);

    return props.username ? (
        isLoading ? (
            <Loading size="xl" />
        ) : (
            <>
                {filteredList.map(user => (
                    <UserCard user={user} />
                ))}
            </>
        )
    ) : (
        <></>
    );
};

export default UserSearchResults;
