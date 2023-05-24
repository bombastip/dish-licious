import { Button, Card, Avatar, Spacer, Text, Image } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { GroupType } from '../../interfaces';
import { useState, useEffect } from 'react';
import { getUserData } from '../../database';

interface GroupCardProps {
    groupCardInfo: GroupType;
}

// daca e admin de grup eventual sa aiba si optiunea de edit grup
const GroupCard = ({ groupCardInfo }: GroupCardProps) => {
    const [pictureUsers, setPictureUsers] = useState<string[]>([]);
    useEffect(() => {
        const getPictureUsers = async () => {
            const updatedPictureUsers = [];
            for (const memberId of groupCardInfo.members.slice(0, 3)) {
                const userData = await getUserData(memberId);
                if (userData) {
                    updatedPictureUsers.push(userData.photoURL);
                }
            }
            setPictureUsers(updatedPictureUsers);
        };
        getPictureUsers();
    }, [groupCardInfo.members]);
    const restOfUsers = groupCardInfo.members.length - 3;

    return (
        <Card css={{ width: '300px', height: '380px', margin: '10px' }}>
            <Card.Header>
                <Text b css={{ whiteSpace: 'nowrap' }}>
                    {groupCardInfo.name}
                </Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ display: 'flex', alignItems: 'center' }}>
                <Image
                    width={400}
                    height={170}
                    containerCss={{ borderRadius: '3%' }}
                    src={groupCardInfo.photo}
                    alt="Default Image"
                    objectFit="cover"
                />
                <Spacer x={0.5} />
                <Avatar.Group
                    {...(restOfUsers > 0 && { count: restOfUsers })}
                    css={{ alignItem: 'flex-end', marginLeft: 'auto' }}
                >
                    {pictureUsers.map((url, index) => (
                        <Link to={`/user-profile?userId=${groupCardInfo.members[index]}`}>
                            <Avatar key={index} size="md" pointer src={url} stacked />
                        </Link>
                    ))}
                </Avatar.Group>
            </Card.Body>
            <Card.Footer css={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Link to={`/group?groupId=${groupCardInfo.id}`}>
                    <Button>Visit</Button>
                </Link>
            </Card.Footer>
        </Card>
    );
};

export default GroupCard;
