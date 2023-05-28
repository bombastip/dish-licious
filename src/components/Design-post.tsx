import { Grid, Spacer } from '@nextui-org/react';
import SinglePost from './SinglePost';
import { useEffect, useState } from 'react';
import { getDocs, getDoc, collection, doc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { PostType, Ingredient } from '../interfaces';
import { useContext } from 'react';
import { AuthContext } from '../context';
import EmptyFeed from '../pages/EmptyFeed';

export const Post = () => {
    const ingredients = [{ name: '', quantity: 0, measureUnit: '' }];
    const [emptyList, setEmptyList] = useState<boolean>(false);
    const [checkList, setCheckList] = useState<boolean>(false);
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
    const postCollectionRef = collection(db, 'posts');
    const { user, userLoading } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            const getPostList = async () => {
                // READ THE DATA
                // SET THE POST LIST
                try {
                    const userdocRef = doc(db, 'users', user.uid);
                    const docUserSnap = await getDoc(userdocRef);
                    const following = docUserSnap.data()?.following;

                    // Filter posts by following users
                    const q = query(postCollectionRef, where('userID', 'in', following));
                    const querySnapshot = await getDocs(q);

                    const filteredData = querySnapshot.docs
                        .map(doc => ({
                            ...(doc.data() as PostType),
                            id: doc.id,
                            ingredients: doc.data().ingredients as Ingredient[],
                        }))
                        .filter(post => post.profile === true);

                    setPostList(filteredData);
                    setCheckList(true);
                } catch (error) {
                    console.log(error);
                }
            };
            getPostList();
            console.log(postList);
        }
    }, [user, userLoading]);

    useEffect(() => {
        console.log(postList.at(0)?.userID);
        // if (postList.at(0)?.userID === "") {
        //     setEmptyList(true)
        // }
    }, [checkList]);

    return emptyList ? (
        <EmptyFeed />
    ) : (
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
