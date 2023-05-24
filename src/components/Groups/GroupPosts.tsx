import { Grid } from '@nextui-org/react';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { SinglePost } from '..';
import { db } from '../../config';
import { PostType } from '../../interfaces';

interface GroupPostsProps {
    groupId: string;
}

const GroupPosts = ({ groupId }: GroupPostsProps) => {
    const [postIds, setPostIds] = useState([] as string[]);
    const [posts, setPosts] = useState([] as PostType[]);

    useEffect(() => {
        const getPostList = async () => {
            try {
                const userdocRef = doc(db, 'groups', groupId);
                const docs = await getDoc(userdocRef);
                if (!docs.exists()) {
                    return;
                }
                setPostIds(docs.data().feed);
                postIds.map(async postId => {
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

    return (
        <Grid.Container css={{ display: 'flex', justifyContent: 'center' }}>
            {posts.map(post => (
                <SinglePost post={post} key={groupId} />
            ))}
        </Grid.Container>
    );
};

export default GroupPosts;
