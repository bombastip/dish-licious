import { Avatar, Col, Row, Spacer, Text } from '@nextui-org/react';
import { GroupType, UserData } from '../../interfaces';
import { AuthContext } from '../../context';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

interface GroupDetailsProps {
    group: GroupType;
    admin: UserData;
}

const GroupDetails = ({ group, admin }: GroupDetailsProps) => {
    const { user } = useContext(AuthContext);

    return (
        <>
            <Row align="center">
                <Col span={2.2}>
                    <Text size={30} b color="primary">
                        Admin:
                    </Text>
                </Col>
                <Col span={2}>
                    <Row align="center">
                        {user?.uid !== group.admin ? (
                            <Link to={`/user-profile?userId=${group.admin}`}>
                                <Avatar src={admin.photoURL} size="lg" css={{ cursor: 'pointer' }} />
                            </Link>
                        ) : (
                            <Link to="/profile">
                                <Avatar src={admin.photoURL} size="lg" css={{ cursor: 'pointer' }} />
                            </Link>
                        )}
                        <Spacer x={0.5} />
                        {user?.uid !== group.admin ? (
                            <Link to={`/user-profile?userId=${group.admin}`}>
                                <Text color="primary" size={20}>
                                    {admin.username}
                                </Text>
                            </Link>
                        ) : (
                            <Link to="/profile">
                                <Text color="primary" size={20}>
                                    {admin.username}
                                </Text>
                            </Link>
                        )}
                    </Row>
                </Col>
            </Row>
            <Row align="center" justify="flex-start">
                <Col span={9}>
                    <Text size={30} b color="primary">
                        Description:
                    </Text>
                </Col>
                <Col span={40}>
                    <Text size={19}>{group.description}</Text>
                </Col>
            </Row>
        </>
    );
};

export default GroupDetails;
