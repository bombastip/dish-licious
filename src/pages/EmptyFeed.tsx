import { Container, Text } from '@nextui-org/react';

const EmptyFeed = () => {
    return (
        <Container css={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '300px' }}>
            <Text h1 size={40} color="#fc924c" weight="bold" align="center">
                It seems that your feed is empty.
            </Text>
            <Text h1 size={40} color="#fc924c" weight="bold" align="center">
                You can get started by searching for new recipes or connecting with your fellow foodies! 🔥🔥🔥
            </Text>
        </Container>
    );
};

export default EmptyFeed;
