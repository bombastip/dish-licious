import { Container, Input, Row, Spacer, Text } from '@nextui-org/react';

const Dashboard = () => {
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
                    Search Recipe by Name
                </Text>
            </Row>
            <Spacer y={2} />
            <Row justify="center" align="center">
                <Input bordered size="xl" placeholder="Recipe name" color="primary" width="600px" />
            </Row>
        </Container>
    );
};

export default Dashboard;
