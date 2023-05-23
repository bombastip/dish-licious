import { Grid } from '@nextui-org/react';
// import { SinglePost } from "..";

interface GroupPostsProps {
    groupId: string;
}
// request la id-urile postarilot din grup
// request la postarile id-urilor
const GroupPosts = ({ groupId }: GroupPostsProps) => {
    const posts = ['post1', 'post2', 'post3'];
    return (
        <Grid.Container css={{ display: 'flex', justifyContent: 'center' }}>
            {posts.map(post => (
                // <SinglePost post={post} key={postID}/>
                <div key={post}>{post}</div>
            ))}
        </Grid.Container>
    );
};

export default GroupPosts;
