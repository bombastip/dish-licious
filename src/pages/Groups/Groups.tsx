import { Button, Container, Text } from '@nextui-org/react';
import { GroupList } from '../../components/Groups';

const Gropus = () => {
    return (
        <>
            <Container
                css={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}
            >
                <Text h1 size={40}>
                    Connect with felow fodies via group communities
                </Text>
                <Button color="primary" css={{ marginTop: '10px' }}>
                    Create a group
                </Button>
            </Container>
            <GroupList />
        </>
    );
};

export default Gropus;
