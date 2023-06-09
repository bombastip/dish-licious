import { useLocation } from 'react-router-dom';
import { CommentList, RecipeCard } from '../components';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { PostType, Ingredient } from '../interfaces';
import CommentInput from '../components/CommentInput';

const Recipe = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const postId = queryParams.get('postId');
    const [reloadComents, setReloadComments] = useState(0);
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
        profile: true,
        comments: [],
    });
    useEffect(() => {
        const getPost = async () => {
            const docRef = doc(db, 'posts', postId as string);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const post = {
                    ...(docSnap.data() as PostType),
                    id: postId as string,
                    ingredients: docSnap.data().ingredients as Ingredient[],
                };
                if (post.comments === undefined) {
                    post.comments = [];
                }
                setPost(post);
                if (!post) {
                    return;
                }
            }
        };
        getPost();
    }, [reloadComents]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '80%' }}>
                <RecipeCard post={post} />
            </div>
            <div style={{ padding: '55px 0 0 0' }}>
                <CommentList comments={!post.comments ? [] : post.comments} />
                <CommentInput postID={post.id} setReloadComments={setReloadComments} reloadComments={reloadComents} />
            </div>
        </div>
    );
};

export default Recipe;
