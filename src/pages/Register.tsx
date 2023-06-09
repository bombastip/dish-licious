import { Spacer, Text } from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';
import { ErrPopButton, AuthCard, EmailInput, PasswordInput, UsernameInput } from '../components';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, actionCodeSettings } from '../config';
import { createUserCollection, checkUsername } from '../database';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, fromRegisterContext } from '../context';
import { ErrorMessasge, FirebaseError } from '../interfaces';
import { fromRegisterContextType } from '../interfaces/interfaces';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [err, setErr] = useState<ErrorMessasge>(null);
    const { user, userLoading } = useContext(AuthContext);
    const { setFromRegister } = useContext(fromRegisterContext) as fromRegisterContextType;
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && user && user.emailVerified) {
            navigate('/');
        }
    }, [userLoading, user]);

    const handleRegister = async () => {
        try {
            if (username.length < 3 || password.length < 6 || email.length < 4) {
                setErr('You completed the fields wrong!');
                return;
            }
            const ret = await checkUsername(username);
            if (!ret) {
                setErr('Username already taken. Please try another username.');
                return;
            }
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await auth.signOut();
            createUserCollection(result.user, username);
            sendEmailVerification(result.user, actionCodeSettings);
            setFromRegister(true);
            navigate('/login');
        } catch (error: unknown) {
            console.error(error);
            setErr((error as FirebaseError).message);
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
            <ErrPopButton
                clickFunc={handleRegister}
                buttonName="Register"
                error={err}
                setError={setErr}
                placement="bottom"
                offset={60}
            />
            <Text>
                Already have an account? <Link to="/login">Log in</Link>
            </Text>
        </AuthCard>
    );
};

export default Register;
