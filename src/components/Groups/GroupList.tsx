import { Container, Loading } from '@nextui-org/react';
import { GroupCard } from '.';
import { GroupCardInfo } from '../../interfaces';
import { AuthContext } from '../../context';
import { useContext } from 'react';
interface GroupListProps {
    groups: GroupCardInfo[];
}

const GroupList = ({ groups }: GroupListProps) => {
    const { user, userLoading } = useContext(AuthContext);

    if (!user || userLoading) {
        return <Loading />;
    }

    return (
        <Container css={{ display: 'flex', justifyContent: 'center' }}>
            {groups.map(group => (
                <GroupCard groupCardInfo={group} key={group.id} />
            ))}
        </Container>
    );
};

export default GroupList;
