import { Button, Container, Text } from '@nextui-org/react';
import { GroupList } from '../../components/Groups';

const Gropus = () => {
    const handleCreateGroup = () => {
        window.location.href = '/group/create';
    };
    return (
        <>
            <Container
                css={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}
            >
                <Text
                    h1
                    size={40}
                    css={{
                        textGradient: '90deg, #fedb58, #fc924c',
                    }}
                    weight="bold"
                >
                    Connect with fellow fodies via group communities
                </Text>
                <Button color="primary" css={{ marginTop: '10px' }} onClick={handleCreateGroup}>
                    Create a group
                </Button>
            </Container>
            <GroupList />
        </>
    );
};

export default Gropus;
