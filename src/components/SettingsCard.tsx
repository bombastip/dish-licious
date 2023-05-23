import { Container, Card, Spacer } from '@nextui-org/react';
import { FC, ReactNode } from 'react';

interface SettingsCardProps {
    children: ReactNode;
}

const SettingsCard: FC<SettingsCardProps> = ({ children }) => {
    return (
        <div>
            <Spacer y={2} />
            <Container display="flex" alignItems="center" justify="center" css={{ mw: '600px' }}>
                <Card>
                    <Card.Body>{children}</Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default SettingsCard;
