import { Container, Input, Row, Spacer, Text } from '@nextui-org/react';
import { useState } from 'react';
import { UserSearchResults } from '../components';

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
            <Spacer y={1} />
            <UserSearchResults username={search} />
        </Container>
    );
};

export default SearchPeople;
