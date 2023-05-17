import { Container } from '@nextui-org/react';
import { GroupCard } from '.';
// import { GroupCardInfo } from '../../interfaces';

const GroupList = () => {
    // luat grupurile din baza de date si afisate cu GroupCards
    const groupCardInfo = ['grup1', 'grup2', 'grup3', 'grup4', 'grup5', 'grup6', 'grup7', 'grup8', 'grup9', 'grup10'];
    return (
        <Container css={{ display: 'flex', justifyContent: 'center' }}>
            {groupCardInfo.map(group => (
                <GroupCard groupCardInfo={group} key={group}/>
            ))}
        </Container>
    );
};

export default GroupList;
