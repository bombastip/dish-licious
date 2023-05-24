import { Container } from '@nextui-org/react';
import { GroupCard } from '.';
import { GroupCardInfo } from '../../interfaces/interfaces';

interface GroupListInterface {
    groups: GroupCardInfo[];
}

const GroupList = (props: GroupListInterface) => {
    // luat grupurile din baza de date si afisate cu GroupCards
    return (
        <Container css={{ display: 'flex', justifyContent: 'center' }}>
            {props.groups.map(group => (
                <GroupCard  group={group} key={group.id} />
            ))}
        </Container>
    );
};

export default GroupList;
