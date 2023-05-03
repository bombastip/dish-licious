import { Container, Card, Image, Spacer } from '@nextui-org/react';
import { FC, ReactNode } from 'react';
import Logo from '../assets/logo.svg';

interface AuthCardProps {
    children: ReactNode;
}

const AuthCard: FC<AuthCardProps> = ({ children }) => {
    return (
        <div>
            <Image showSkeleton width={300} height={250} maxDelay={10000} src={Logo} alt="logo" />
            <Container display="flex" alignItems="center" justify="center" css={{ mw: '600px' }}>
                <Card>
                    <Card.Body>{children}</Card.Body>
                </Card>
            </Container>
            <Spacer y={5} />
        </div>
    );
};

export default AuthCard;
