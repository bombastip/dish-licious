import { Container, Card, Image } from '@nextui-org/react';
import { FC, ReactNode } from 'react';
import { lightRetroTheme } from '../themes';
import Logo from '../assets/logo.svg';

interface AuthCardProps {
    children: ReactNode;
}

const AuthCard: FC<AuthCardProps> = ({ children }) => {
    return (
        <div className={lightRetroTheme}>
            <Image showSkeleton width={300} height={250} maxDelay={10000} src={Logo} alt="logo" />
            <Container display="flex" alignItems="center" justify="center" css={{ mw: '600px' }}>
                <Card>
                    <Card.Body>{children}</Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default AuthCard;
