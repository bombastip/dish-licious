import { Container, Input, Row, Spacer, Text } from '@nextui-org/react';
import { useState } from 'react';
import GroupSearchResults from '../components/Groups/GroupSearchResults';

const SearchGroups = () => {
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
                    Be part of fellow foodies communities
                </Text>
            </Row>
            <Spacer y={2} />
            <Row justify="center" align="center">
                <Input
                    aria-label="Group Name"
                    bordered
                    size="xl"
                    placeholder="Group Name"
                    color="primary"
                    width="600px"
                    onChange={e => setSearch(e.target.value)}
                />
            </Row>
            <Spacer y={1} />
            <GroupSearchResults groupName={search} />
        </Container>
    );
};

export default SearchGroups;
