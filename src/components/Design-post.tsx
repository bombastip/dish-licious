import { Grid, Spacer } from '@nextui-org/react';
import SinglePost from './SinglePost';
import { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { PostType } from '../interfaces';

export const Post = () => {
    const [postList, setPostList] = useState<PostType[]>([
        { userID: '', title: '', description: '', photoURL: '', likes: [], timeCost: 0, timeUnit: '', id: '' },
    ]);
    const postCollectionRef = collection(db, 'posts');

    useEffect(() => {
        const getPostList = async () => {
            // READ THE DATA
            // SET THE POST LIST
            try {
                const data = await getDocs(postCollectionRef);
                const filteredData = data.docs.map(doc => ({
                    ...(doc.data() as PostType),
                    id: doc.id,
                }));
                setPostList(filteredData);
            } catch (err) {
                console.error(err);
            }
        };
        getPostList();
    }, []);

    return (
        <Grid.Container gap={2} justify="center" css={{ marginTop: '20px' }}>
            <div>
                {postList.map(post => (
                    <>
                        <SinglePost post={post} />
                        <Spacer y={0.5} />
                    </>
                ))}
            </div>
        </Grid.Container>
    );
};
