import { useContext, useEffect } from 'react';
import { AuthContext } from '../context';
import { redirect } from 'react-router-dom';
import { auth  } from '../config/firebase-config';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@nextui-org/react';
import { Post } from '../components/Design-post';
// import { User } from 'firebase/auth';

const Dashboard = () => {
    const { user, userLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && !user) {
            navigate('/login');
        }
    }, [userLoading, user]);

    const handleLogOut = async () => {
        try {
            await auth.updateCurrentUser(null);
            await auth.signOut();
            redirect('/login');
        } catch (error) {
            alert(error);
        }
    };

    return userLoading ? (
        <Loading />
    ) : (
        <div>
            <h1>Dashboard</h1>
            <Post></Post>
            <button onClick={handleLogOut}>Log Out</button>
        </div>
    );
};

export default Dashboard;
