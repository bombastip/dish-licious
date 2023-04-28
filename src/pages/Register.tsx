import { Spacer, Button, Text } from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';
import { AuthCard, EmailInput, PasswordInput, UsernameInput } from '../components';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, actionCodeSettings } from '../config/firebase-config';
import { createUserCollection, checkUsername } from '../database/firestore-db';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context';
import { FirebaseError } from 'firebase/app';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const { user, userLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && user && user.emailVerified) {
            navigate('/');
        }
    }, [userLoading, user]);

    const handleRegister = async () => {
        try {
            // FIXME: email password and username regex alert
            if (username.length < 3 || password.length < 6 || email.length < 4) {
                alert('You completed the fields wrong!');
                return;
            }
            const ret = await checkUsername(username);
            if (!ret) {
                alert('Username already taken!');
                return;
            }
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await auth.signOut();
            createUserCollection(result.user, username);
            sendEmailVerification(result.user, actionCodeSettings);
            // FIXME: Handle email already in use error
            alert('Check your email for a verification link!');
            navigate('/login');
        } catch (error: unknown) {
            console.error(error);
            // FIXME: Handle email already in use error
            alert((error as FirebaseError).message);
        }
    };

    return (
        <AuthCard>
            <UsernameInput username={username} setUsername={setUsername} />
            <Spacer y={1} />
            <EmailInput email={email} setEmail={setEmail} />
            <Spacer y={1} />
            <PasswordInput password={password} setPassword={setPassword} />
            <Spacer y={1} />
            <Button onClick={handleRegister}>Register</Button>
            <Text>
                Already have an account? <Link to="/login">Log in</Link>
            </Text>
        </AuthCard>
    );
};

export default Register;
