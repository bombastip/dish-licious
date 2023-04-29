import { redirect } from 'react-router-dom';
import { auth } from '../config';
import { Post } from '../components/Design-post';

const Dashboard = () => {
    const handleLogOut = async () => {
        try {
            await auth.signOut();
            await auth.updateCurrentUser(null);
            redirect('/login');
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <Post></Post>
            <button onClick={handleLogOut}>Log Out</button>
        </div>
    );
};

export default Dashboard;
