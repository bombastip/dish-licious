import { Container, Text, Row, Spacer } from '@nextui-org/react';
import { YoutubeFrame } from '../components';
const Favorites = () => {
    return (
        <Container>
            <Spacer y={2} />
            <Row justify="center" align="center">
                <Text h1 size={40}>
                    My favourite recipe
                </Text>
            </Row>
            <YoutubeFrame video="ikpsEt0bJXw" />
        </Container>
    );
};

export default Favorites;
