import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../context';
import { Loading } from '@nextui-org/react';

const Privateroute = () => {
    const { user, userLoading } = useContext(AuthContext);
    if (!userLoading && !user) {
        return <Navigate to="/login" />;
    }
    return userLoading ? <Loading /> : <Outlet />;
};

export default Privateroute;
