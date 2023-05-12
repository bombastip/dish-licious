import { Container, Text } from '@nextui-org/react';
import { YoutubeFrame } from '../components';
const Favorites = () => {
    return (
        <Container css={{ display: 'flex', justifyContent: 'center' }}>
            <Text h1 size={40}>
                My favourite recepie
            </Text>
            <YoutubeFrame video="ikpsEt0bJXw" />
        </Container>
    );
};

export default Favorites;
