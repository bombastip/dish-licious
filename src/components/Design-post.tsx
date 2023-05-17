import { Grid, Spacer } from '@nextui-org/react';
import SinglePost from './SinglePost';
import { useEffect, useState } from 'react';
import { getDocs, getDoc, collection, doc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { PostType, Ingredient } from '../interfaces';
import { useContext } from 'react';
import { AuthContext } from '../context';

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
        },
    ]);
    const postCollectionRef = collection(db, 'posts');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            const getPostList = async () => {
                // READ THE DATA
                // SET THE POST LIST
                const userdocRef = doc(db, 'users', user.uid);
                const docUserSnap = await getDoc(userdocRef);
                const following = docUserSnap.data()?.following;

                // Filter posts by following users
                const q = query(postCollectionRef, where('userID', 'in', following));
                const querySnapshot = await getDocs(q);
                const filteredData = querySnapshot.docs.map(doc => ({
                    ...(doc.data() as PostType),
                    id: doc.id,
                    ingredients: doc.data().ingredients as Ingredient[],
                }));
                setPostList(filteredData);
            };
            try {
                async () => getPostList();
            } catch (error) {
                console.log(error);
            }
        }
    }, [user]);

    return (
        <Grid.Container gap={2} justify="center" css={{ marginTop: '20px' }}>
            <div>
                {postList.map(post => (
                    <div key={post.id}>
                        <SinglePost post={post} />
                        <Spacer y={0.5} />
                    </div>
                ))}
            </div>
        </Grid.Container>
    );
};
