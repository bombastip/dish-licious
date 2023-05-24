import { Grid, Spacer } from '@nextui-org/react';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { SinglePost } from '..';
import { db } from '../../config';
import { GroupType, PostType } from '../../interfaces';

interface GroupPostsProps {
    groupId: string;
}

const GroupPosts = ({ groupId }: GroupPostsProps) => {
    const [posts, setPosts] = useState([] as PostType[]);

    useEffect(() => {
        const getPostList = async () => {
            try {
                const groupdocRef = doc(db, 'groups', groupId);
                const postList = ((await getDoc(groupdocRef)).data() as GroupType);
                const postsFeed = postList.feed;
                console.log(postsFeed);
                postsFeed.map(async postId => {
                    const postDocRef = doc(db, 'posts', postId);
                    const postDoc = await getDoc(postDocRef);
                    if (!postDoc.exists()) {
                        return;
                    }
                    const postData = postDoc.data();
                    postData.id = postId;
                    setPosts(posts => [...posts, postData] as PostType[]);
                });
            } catch (error) {
                console.log(error);
            }
        };
        getPostList();
    }, []);
    //console.log(posts);

    return (
        <Grid.Container gap={2} css={{ display: 'flex', justifyContent: 'center', marginTop:'20px' }}>   
            {posts.map(post => (
                <div key={groupId}>
                <SinglePost post={post}  />
                <Spacer y={0.5} />
                </div>
            ))}
        </Grid.Container>
    );
};

export default GroupPosts;
