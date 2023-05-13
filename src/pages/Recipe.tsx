import { useLocation } from 'react-router-dom';
import { RecipeCard } from '../components';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { PostType, Ingredient } from '../interfaces';

const Recipe = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const postId = queryParams.get('postId');
    const [post, setPost] = useState<PostType>({
        userID: '',
        title: '',
        description: '',
        photoURL: '',
        likes: [],
        ingredients: [{ name: '', quantity: 0, measureUnit: '' }],
        timeCost: 0,
        timeUnit: '',
        id: '',
    });
    useEffect(() => {
        const getPost = async () => {
            const docRef = doc(db, 'posts', postId as string);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log(docSnap.data());
                const post = {
                    ...(docSnap.data() as PostType),
                    id: postId as string,
                    ingredients: docSnap.data().ingredients as Ingredient[],
                };
                setPost(post);
                console.log('post: ', post);
                if (post) console.log('title:', post.title);
                else return;
            } else {
                console.log(`Post document not found`);
            }
        };
        getPost();
    }, []);

    return <RecipeCard post={post} />;
};

export default Recipe;
