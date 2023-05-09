import { Container, Input, Row, Spacer, Text } from '@nextui-org/react';

const SearchPeople = () => {
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
                <Input bordered size="xl" placeholder="Recipe name" color="primary" width="600px" />
            </Row>
        </Container>
    );
};

export default SearchPeople;
