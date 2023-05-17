import { Container, Text } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();
    setTimeout(() => {
        navigate('/');
    }, 3000);

    return (
        <Container css={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '400px' }}>
            <Text h1 size={40} color="#fc924c" weight="bold" align="center">
                404 not found 😞
            </Text>
            <Text h1 size={40} color="#fc924c" weight="bold" align="center">
                Redirecting to home page...
            </Text>
        </Container>
    );
};

export default ErrorPage;
