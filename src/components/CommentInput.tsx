import { Button, Input, Loading } from '@nextui-org/react';
// import { SendButton } from '.';
import { SendIcon } from '../assets/SendIcon';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { AuthContext } from '../context';
import { addComment } from '../database/firestore-db';

interface CommentInputProps {
    postID: string;
    setReloadComments?: Dispatch<SetStateAction<number>>;
    reloadComments?: number;
}

const CommentInput = ({ postID, setReloadComments, reloadComments }: CommentInputProps) => {
    const [comment, setComment] = useState('');
    const { user, userLoading } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleSendComment = async () => {
        if (!user || userLoading) {
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
        if (setReloadComments != undefined && reloadComments != undefined) {
            setReloadComments(reloadComments + 1);
        }
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevents form submission on Enter key press
            await handleSendComment();
        }
    };

    return (
        <Input
            aria-label="Comment"
            clearable
            contentRightStyling={false}
            width="300px"
            placeholder="Type your comment..."
            value={comment}
            onKeyDown={handleKeyDown}
            onChange={e => setComment(e.target.value)}
            contentRight={
                comment &&
                comment[0] !== ' ' && (
                    <Button
                        auto
                        onPress={async () => {
                            await handleSendComment();
                        }}
                        icon={
                            !loading ? (
                                // <SendButton>
                                <SendIcon />
                            ) : (
                                // </SendButton>
                                <Loading color="currentColor" size="sm" />
                            )
                        }
                    ></Button>
                )
            }
        />
    );
};
export default CommentInput;
