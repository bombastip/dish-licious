import { Button, Card } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { GroupCardInfo } from '../../interfaces/interfaces';

interface GroupCardProps {
    group: GroupCardInfo;
}
const GroupCard = ({ group }: GroupCardProps) => {
    return (
        <Card css={{ width: '300px', height: '400px', margin: '10px' }}>
            <Card.Header>{group.name}</Card.Header>
            <Card.Body>
                <Card.Image src={group.photo} />
            </Card.Body>
            <Card.Footer css={{ display: 'flex', justifyContent: 'center' }}>
                <Link to={`/group?groupID=${group.id}`}>
                    <Button>Visit</Button>
                </Link>
            </Card.Footer>
        </Card>
    );
};

export default GroupCard;
