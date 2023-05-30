import { Grid, Spacer } from '@nextui-org/react';
import SinglePost from './SinglePost';
import { useEffect, useState } from 'react';
import { PostType } from '../interfaces';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { getFollowingPosts } from '../database';
import EmptyFeed from '../pages/EmptyFeed';

export const Post = () => {
    const ingredients = [{ name: '', quantity: 0, measureUnit: '' }];

    const [postList, setPostList] = useState<PostType[]>([
        {
            userID: '',
            title: '',
            description: '',
            photoURL: '',
            likes: [],
            ingredients,
            timeCost: 0,
            timeUnit: '',
            id: '',
            comments: [],
            profile: false,
        },
    ]);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            const getPostList = async () => {
                try {
                    const postList = await getFollowingPosts(user.uid);
                    setPostList(postList as PostType[]);
                    console.log('postList:', postList);
                } catch (error) {
                    console.log(error);
                }
            };
            getPostList();
            console.log(postList);
        }
    }, [user]);

    return (
        <Grid.Container gap={2} justify="center" css={{ marginTop: '20px' }}>
            <div>
                {postList.length ? (
                    postList.map(post => (
                        <div key={post.id}>
                            <SinglePost post={post} />
                            <Spacer y={0.5} />
                        </div>
                    ))
                ) : (
                    <EmptyFeed />
                )}
            </div>
        </Grid.Container>
    );
};
