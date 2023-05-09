import { UserProfile } from '../components';
import { useLocation } from 'react-router-dom';

const ProfileQueryParam = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');

    return <UserProfile currentUserId={userId || ''} />;
};

export default ProfileQueryParam;
