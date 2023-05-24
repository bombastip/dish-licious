import { Button, Container, Spacer, Text } from '@nextui-org/react';
import { GroupList } from '../../components/Groups';

const Gropus = () => {
    const handleCreateGroup = () => {
        window.location.href = '/group/create';
    };
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
            <GroupList />
        </>
    );
};

export default Gropus;
