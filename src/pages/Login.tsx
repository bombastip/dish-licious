import { Spacer, Text } from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context';
import { useNavigate, Link, redirect } from 'react-router-dom';
import { isSignInWithEmailLink, signInWithEmailLink, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { EmailInput, PasswordInput, AuthCard, AuthButton } from '../components';
import { FirebaseError } from 'firebase/app';
import { ErrorMessasge } from '../interfaces';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<ErrorMessasge>(null);
    const { user, userLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && user && user.emailVerified) {
            navigate('/');
        }
    }, [userLoading, user]);

    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href) && auth.currentUser?.emailVerified) {
            const email = window.localStorage.getItem('emailForSignIn');
            signInWithEmailLink(auth, email as string, window.location.href)
                .then(() => {
                    window.localStorage.removeItem('emailForSignIn');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, []);

    const handleLogin = async () => {
        try {
            // FIXME: email and password regex alert
            if (email.length < 4 || password.length < 6) {
                setErr('You completed the fields wrong!');
                return;
            }
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.emailVerified) {
                setErr('Please verify your email address!');
                auth.signOut();
                return;
            }

            // auth.updateCurrentUser(null);
            // sendSignInLinkToEmail(auth, email, actionCodeSettings)
            //   .then(() => {
            //     window.localStorage.setItem("emailForSignIn", email);
            //     console.log(window.localStorage.emailForSignIn);
            //   })
            redirect('/');
        } catch (error: unknown) {
            // TODO: alert the user if the email is wrong
            // TODO: alert the user if the password is wrong
            setErr((error as FirebaseError).message);
        }
    };

    return (
        <AuthCard>
            <EmailInput email={email} setEmail={setEmail} />
            <Spacer y={1} />
            <PasswordInput password={password} setPassword={setPassword} />
            <Spacer y={1} />
            <AuthButton clickFunc={handleLogin} buttonName="Login" error={err} setError={setErr} />
            <Text>
                You don't have an account? <Link to="/register">Register</Link>
            </Text>
        </AuthCard>
    );
};

export default Login;
