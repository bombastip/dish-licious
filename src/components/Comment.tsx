import { Card, Text, Avatar, Row, Col, Spacer } from '@nextui-org/react';
import { getUsernamePhotos } from '../database/firestore-db';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface CommentProps {
    uid: string;
    comment: string;
}

const Comment: React.FC<CommentProps> = ({ uid, comment }) => {
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');

    useEffect(() => {
        const getCommentData = async () => {
            const { photoURL, username } = await getUsernamePhotos(uid);
            setUsername(username);
            setPhotoURL(photoURL);
        };
        getCommentData();
    }, [uid]);

    return (
        <>
            <Card
                css={{
                    display: 'flex',
                    flexDirection: 'row',
                    maxWidth: '300px',
                }}
            >
                <Row css={{ alignItems: 'center' }}>
                    <Spacer x={0.5} />
                    <Link to={`/user-profile?userId=${uid}`}>
                        <Avatar
                            src={photoURL}
                            size="md"
                            css={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        />
                    </Link>
                    <Spacer x={0.5} />
                    <Col>
                        <Link to={`/user-profile?userId=${uid}`}>
                            <Text css={{ cursor: 'pointer' }} color="primary">
                                {username}
                            </Text>
                        </Link>
                        <Text>{comment}</Text>
                    </Col>
                </Row>
            </Card>
            <Spacer y={0.5} />
        </>
    );
};

export default Comment;
