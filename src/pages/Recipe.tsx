import { useLocation } from 'react-router-dom';
import { RecipeCard } from '../components';

const Recipe = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const postId = queryParams.get('postId');

    return (
            <RecipeCard currentPostId={postId || ''} />
    );
};

export default Recipe;
