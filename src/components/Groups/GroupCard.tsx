import { Button, Card } from '@nextui-org/react';
import { Link } from 'react-router-dom';
// import { GroupCardInfo } from '../../interfaces';

// daca e admin de grup eventual sa aiba si optiunea de edit grup
const GroupCard = ({ groupCardInfo }: { groupCardInfo: string }) => {
    return (
        <Card css={{ width: '300px', height: '400px', margin: '10px' }}>
            <Card.Header>{groupCardInfo}</Card.Header>
            <Card.Body>
                <Card.Image src="http://www.venisoncache.com/wp-content/uploads/2019/02/steak-1.jpg" />
            </Card.Body>
            <Card.Footer css={{ display: 'flex', justifyContent: 'center' }}>
                <Link to={`/group?groupId=${groupCardInfo}`}>
                    <Button>Visit</Button>
                </Link>
            </Card.Footer>
        </Card>
    );
};

export default GroupCard;
