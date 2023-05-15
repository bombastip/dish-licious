import { Button, Input, Loading } from '@nextui-org/react';
import { SendButton } from '.';
import { SendIcon } from '../assets/SendIcon';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { AuthContext } from '../context';
import { addComment } from '../database/firestore-db';

interface CommentInputProps {
    postID: string;
    setReloadComments: Dispatch<SetStateAction<number>>;
    reloadComments: number;
}

const CommentInput = ({ postID, setReloadComments, reloadComments }: CommentInputProps) => {
    const [comment, setComment] = useState('');
    const { user, userLoading } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleSendComment = async () => {
        if (!user || userLoading) {
            return;
        }
        if (comment === '') {
            //TODO: add a warning ala Dragos
            alert('Please enter a comment');
            return;
        }
        const addCommentToDatabase = async () => {
            try {
                await addComment(postID, comment, user.uid);
                setLoading(false);
            } catch {
                throw new Error('Error adding comment to database');
            }
        };
        addCommentToDatabase();
        setComment('');
        setReloadComments(reloadComments + 1);
    };

    return (
        <Input
            aria-label="Comment"
            clearable
            contentRightStyling={false}
            placeholder="Type your comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            contentRight={
                <Button
                    auto
                    onPress={async () => {
                        await handleSendComment();
                    }}
                    icon={
                        !loading ? (
                            <SendButton>
                                <SendIcon />
                            </SendButton>
                        ) : (
                            <Loading color="currentColor" size="sm" />
                        )
                    }
                ></Button>
            }
        />
    );
};
export default CommentInput;
