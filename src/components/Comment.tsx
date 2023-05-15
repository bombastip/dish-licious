import { Card, Link, Text, User } from '@nextui-org/react';
import { getUsernamePhotos } from '../database/firestore-db';
import { useEffect, useState } from 'react';

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
        <Card css={{ display: 'flex', flexDirection: 'row', maxWidth: '300px' }}>
            <Link to={`/user-profile?userId=${uid}`}>
                <User css={{ cursor: 'pointer' }} src={photoURL} name={username} />
            </Link>
            <Text>{comment}</Text>
        </Card>
    );
};

export default Comment;
