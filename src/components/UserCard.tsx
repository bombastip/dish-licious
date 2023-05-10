import { Avatar, Card, Grid, Row, Spacer, Text } from '@nextui-org/react';
import { UserCompleteData } from '../interfaces';

interface UserCardProps {
    user: UserCompleteData;
}

const UserCard = (props: UserCardProps) => {
    return (
        <Grid.Container
            key={props.user.id}
            gap={2}
            css={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
        >
            <Card isPressable variant="bordered" css={{ mw: '330px' }}>
                <Row key={props.user.id} xs={3} css={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={props.user.photoURL} size="lg" />
                    <Spacer y={1} x={5} />
                    <Text>{props.user.username}</Text>
                    {/* <Spacer y={1} x={5} /> */}
                </Row>
            </Card>
        </Grid.Container>
    );
};

export default UserCard;
