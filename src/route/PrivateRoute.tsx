import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../context';
import { Loading } from '@nextui-org/react';
import { Navbar } from '../components';

const Privateroute = () => {
    const { user, userLoading } = useContext(AuthContext);
    if (!userLoading && !user) {
        return <Navigate to="/login" />;
    }
    return userLoading ? (
        <Loading />
    ) : (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

export default Privateroute;
