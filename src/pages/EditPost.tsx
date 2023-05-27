import { EditPostCard } from '../components';
import { useLocation } from 'react-router-dom';

const EditPost = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const postId = queryParams.get('postId');

    return <EditPostCard postId={postId || ''} />;
};

export default EditPost;
