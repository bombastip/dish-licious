import { useContext } from 'react';
import { redirect } from 'react-router-dom';
import { AuthContext } from '../../context';

const signOutLoader = async () => {
    const user = useContext(AuthContext);
    if (user) {
        return redirect('/');
    }
    return new Response(JSON.stringify(user), {
        status: 200,
        headers: {
            'Content-Type': 'application/json; utf-8',
        },
    });
};
export default signOutLoader;
