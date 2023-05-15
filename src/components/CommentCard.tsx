import { Card } from '@nextui-org/react';
import { PostType } from '../interfaces';
import { CommentList } from '.';
import CommentInput from './CommentInput';
interface CommentCardProps {
    post: PostType;
}
const CommentCard = ({ post }: CommentCardProps) => {
    return (
        <Card isHoverable variant="bordered" css={{ mw: '400px', maxHeight: '516px' }}>
            <CommentList comments={!post.comments ? [] : post.comments} />
            <CommentInput postID={post.id} />
        </Card>
    );
};
export default CommentCard;
