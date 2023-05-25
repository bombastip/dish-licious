import { Button, Card, Col, Row, Spacer, Text } from '@nextui-org/react';
import { GroupType } from '../../interfaces';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import { LeaveJoinButtons } from '.';

interface GroupImageCardProps {
    group: GroupType;
    groupId: string;
}

const GroupImageCard = ({ group, groupId }: GroupImageCardProps) => {
    const { user } = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(group);
        if (user && group.admin) {
            setIsAdmin(user.uid === group.admin);
            setIsMember(group.members.includes(user.uid));
        }
    }, [user, group.admin]);

    const handleMemberClick = () => {
        navigate(`/group/members?groupId=${groupId}`);
    };

    const handleSettingsClick = () => {
        navigate(`/group/settings?groupId=${groupId}`);
    };

    return (
        <Row align="center" justify="center">
            <Card css={{ w: '100%', h: '500px' }}>
                <Card.Body css={{ p: 0 }}>
                    <Card.Image
                        showSkeleton
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
                                {isAdmin && (
                                    <Button
                                        flat
                                        auto
                                        rounded
                                        css={{ color: '#fedebe', bg: '#f6d8d826 ' }}
                                        onPress={handleSettingsClick}
                                    >
                                        <Text css={{ color: 'inherit' }} size={14} weight="bold">
                                            Settings
                                        </Text>
                                    </Button>
                                )}
                                <Spacer x={1} />
                                {isMember && (
                                    <Button
                                        flat
                                        auto
                                        rounded
                                        css={{ color: '#fedebe', bg: '#f6d8d826 ' }}
                                        onPress={handleMemberClick}
                                    >
                                        <Text css={{ color: 'inherit' }} size={14} weight="bold">
                                            Members
                                        </Text>
                                    </Button>
                                )}
                                <Spacer x={1} />
                                {!isAdmin && (
                                    <LeaveJoinButtons isMember={isMember} setIsMember={setIsMember} />
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Row>
    );
};

export default GroupImageCard;
