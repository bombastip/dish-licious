import { Grid, Spacer } from '@nextui-org/react';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState, useContext } from 'react';
import { SinglePost } from '..';
import { db } from '../../config';
import { GroupType, PostType } from '../../interfaces';
import { getGroupMembers } from '../../database/firestore-db';
import { AuthContext } from '../../context';

interface GroupPostsProps {
    groupId: string;
}

const GroupPosts = ({ groupId }: GroupPostsProps) => {
    const [posts, setPosts] = useState([] as PostType[]);
    const [isMember, setIsMember] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            return;
        }
        const getPostList = async () => {
            try {
                const groupdocRef = doc(db, 'groups', groupId);
                const postList = (await getDoc(groupdocRef)).data() as GroupType;
                const postsFeed = postList.feed;
                const finalPosts: PostType[] = [];
                postsFeed.map(async postId => {
                    const postDocRef = doc(db, 'posts', postId);
                    const postDoc = await getDoc(postDocRef);
                    if (!postDoc.exists()) {
                        return;
                    }
                    const postData = postDoc.data();
                    postData.id = postId;
                    finalPosts.push(postData as PostType);
                    setPosts(finalPosts);
                });
            } catch (error) {
                console.log(error);
            }
        };
        getPostList();
    }, [user]);

    useEffect(() => {
        if (!user) {
            return;
        }
        const checkMembership = async () => {
            const members = await getGroupMembers(groupId);
            for (const member of members) {
                if (member === user.uid) {
                    setIsMember(true);
                }
            }
        };
        checkMembership();
    }, [user]);

    return isMember || !user ? (
        <Grid.Container gap={2} css={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <div>
                {posts
                    .slice(0)
                    .reverse()
                    .map(post => (
                        <div key={groupId}>
                            <SinglePost post={post} key={post.id} />
                            <Spacer y={1} />
                        </div>
                    ))}
            </div>
        </Grid.Container>
    ) : null;
};

export default GroupPosts;
