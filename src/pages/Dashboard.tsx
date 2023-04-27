import { useContext } from 'react';
import { AuthContext } from '../context/Context';
import { User } from 'firebase/auth';

const Dashboard = () => {
    const user: User | null = useContext(AuthContext);

    return user ? (
        <div>
            <h1>You are logged in {user.email}</h1>
        </div>
    ) : (
        <div>
            <h1>You not logged in!</h1>
        </div>
    );
};

export default Dashboard;
