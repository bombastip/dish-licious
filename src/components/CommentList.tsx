import { Comment } from '.';
import { Text } from '@nextui-org/react';

interface CommentListProps {
    comments: { uid: string; comment: string }[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    return comments.length === 0 ? (
        <Text css={{ marginLeft: '5px' }}>No comments yet😢</Text>
    ) : (
        <>
            {comments.map(comment => (
                <Comment uid={comment.uid} comment={comment.comment} key={comment.comment + comment.uid} />
            ))}
        </>
    );
};

export default CommentList;
