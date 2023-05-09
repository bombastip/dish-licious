import { Container, Input, Row, Spacer, Text } from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';
import ListOfUsers, { ListUser, getListOfUsers } from '../components/ListOfUsers';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config';
import { AuthContext } from '../context';
import { UserSearchResults } from '../components';

const getUsers = async () =>   {
    const q = query(collection(db, 'users'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.id);
}

const SearchPeople = () => {
    // const { user, userLoading } = useContext(AuthContext);
    const [search, setSearch] = useState('');

    
    return (
        <Container>
            <Spacer y={2} />
            <Row justify="center" align="center">
                <Text
                    h1
                    size={40}
                    css={{
                        textGradient: '90deg, #fedb58, #fc924c',
                    }}
                    weight="bold"
                >
                    Connect with fellow foodies
                </Text>
            </Row>
            <Spacer y={2} />
            <Row justify="center" align="center">
                <Input
                    bordered
                    size="xl"
                    placeholder="Recipe name"
                    color="primary"
                    width="600px"
                    onChange={e => setSearch(e.target.value)}
                />
            </Row>
            {/* <ListOfUsers users={filteredList} currentUserId={user?.uid || ''} /> */}
            <UserSearchResults username={search} />
        </Container>
    );
};

export default SearchPeople;
