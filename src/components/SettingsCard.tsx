import { Container, Card } from '@nextui-org/react';
import { FC, ReactNode } from 'react';

interface AuthCardProps {
    children: ReactNode;
}

const SettingsCard: FC<AuthCardProps> = ({ children }) => {
    return (
        <div>
            <Container display="flex" alignItems="center" justify="center" css={{ mw: '600px' }}>
                <Card>
                    <Card.Body>{children}</Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default SettingsCard;
