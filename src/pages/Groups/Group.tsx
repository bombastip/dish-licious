import { Col, Container, Text, Card, Row, Button, Spacer, Avatar } from '@nextui-org/react';
import { Link, useLocation } from 'react-router-dom';
import { getGroupData, getUserData } from '../../database';
import { useEffect, useState } from 'react';
import { GroupType, UserData } from '../../interfaces';
import { GroupPosts } from '../../components/Groups';

const Group = () => {
    const queryParams = new URLSearchParams(useLocation().search);
    const groupId = queryParams.get('groupId') as string;
    const [group, setGroup] = useState({} as GroupType);
    const [admin, setAdmin] = useState({} as UserData);

    useEffect(() => {
        const getGroup = async () => {
            const group = await getGroupData(groupId);
            setGroup(group as GroupType);
        };
        getGroup();
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            if (!group.admin) {
                return;
            }
            const userData = await getUserData(group.admin);
            if (!userData) {
                return;
            }
            setAdmin(userData as UserData);
        };
        loadUserData();
    }, [group.admin]);

    return (
        <div>
            <Spacer y={1} />
            <Container css={{ w: '80%', h: '500px' }}>
                <Row align="center" justify="center">
                    <Card css={{ w: '100%', h: '500px' }}>
                        <Card.Body css={{ p: 0 }}>
                            <Card.Image
                                src={group.photo}
                                objectFit="cover"
                                width="100%"
                                height="100%"
                                alt="Relaxing app background"
                            />
                        </Card.Body>
                        <Card.Footer
                            isBlurred
                            css={{
                                position: 'absolute',
                                bgBlur: '#0f111466',
                                borderTop: '$borderWeights$light solid $gray800',
                                bottom: 0,
                                zIndex: 1,
                            }}
                        >
                            <Row>
                                <Col>
                                    <Row>
                                        <Spacer x={1} />
                                        <Text color="#d1d1d1" size={30} b>
                                            {group.name}
                                        </Text>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row align="flex-end" justify="flex-end">
                                        <Button flat auto rounded css={{ color: '#fedebe', bg: '#f6d8d826 ' }}>
                                            <Text css={{ color: 'inherit' }} size={14} weight="bold">
                                                Settings
                                            </Text>
                                        </Button>
                                        <Spacer x={1} />
                                        <Button flat auto rounded css={{ color: '#fedebe', bg: '#f6d8d826 ' }}>
                                            <Text css={{ color: 'inherit' }} size={14} weight="bold">
                                                Members
                                            </Text>
                                        </Button>
                                        <Spacer x={1} />
                                        <Button flat auto rounded css={{ color: '#fedebe', bg: '#f6d8d826 ' }}>
                                            <Text css={{ color: 'inherit' }} size={14} weight="bold">
                                                Join Group
                                            </Text>
                                        </Button>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Row>
                <Spacer y={1} />
                <Row align="center">
                    <Col span={2.2}>
                        <Text size={30} b color="primary">
                            Admin:
                        </Text>
                    </Col>
                    <Col span={2}>
                        <Row align="center">
                            <Link to={`/user-profile?userId=${group.admin}`}>
                                <Avatar css={{ cursor: 'pointer' }} src={admin.photoURL} size="md" />
                            </Link>
                            <Spacer x={0.5} />
                            <Text color="primary" size={20}>
                                {admin.username}
                            </Text>
                        </Row>
                    </Col>
                </Row>
                <Spacer y={1} />
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
                <GroupPosts groupId={groupId} />
            </Container>
            
            
            
        </div>
    );
};

export default Group;
