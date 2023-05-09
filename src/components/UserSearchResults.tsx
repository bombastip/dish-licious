import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config';
import { UserData } from '../interfaces';
interface UserSearchProps {
    username: string;
}

const getUsers = async () => {
    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserData);
};

const UserSearchResults = (props: UserSearchProps) => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredList, setFilteredList] = useState<UserData[]>([]);


    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUsers();
            setUsers(data);
            console.log(users);
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const filteredList = users.filter(user => user.username.includes(props.username));
        setFilteredList(filteredList);;
    }, [props.username]);

    return (
        <>
            {filteredList.map(user => {
                <div>{user.username}</div>;
            })}
        </>
    );
};

export default UserSearchResults;
