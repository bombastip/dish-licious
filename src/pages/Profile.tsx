import { UserProfile } from '../components';
import { AuthContext } from '../context';
import { useContext } from 'react';
import { Loading } from '@nextui-org/react';

const Profile = () => {
    const { user, userLoading } = useContext(AuthContext);

    if (userLoading || !user) {
        return <Loading />;
    }

    return <UserProfile currentUserId={user?.uid || ''}/>;
};

export default Profile;
