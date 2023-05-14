import { Spacer, Text } from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext, fromRegisterContext } from '../context';
import { useNavigate, Link, redirect } from 'react-router-dom';
import { isSignInWithEmailLink, signInWithEmailLink, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { EmailInput, PasswordInput, AuthCard, VerificationModal, ErrPopButton } from '../components';
import { FirebaseError } from 'firebase/app';
import { ErrorMessasge } from '../interfaces';
import { fromRegisterContextType } from '../interfaces/interfaces';

const Login = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<ErrorMessasge>(null);
    const { user, userLoading } = useContext(AuthContext);
    const { fromRegister, setFromRegister } = useContext(fromRegisterContext) as fromRegisterContextType;
    const navigate = useNavigate();

    const modalHandler = () => {
        if (fromRegister) {
            setModalVisible(true);
            setFromRegister(false);
            return;
        }
    };

    useEffect(() => {
        if (!userLoading && user && user.emailVerified) {
            navigate('/');
        }
    }, [userLoading, user]);

    useEffect(() => {
        modalHandler();
    }, [fromRegister]);

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
        modalHandler();
    }, []);

    const handleLogin = async () => {
        try {
            // FIXME: email and password regex alert
            if (email.length == 0 || password.length == 0) {
                setErr('At least one of the fields is empty. Please complete both of them.');
                return;
            }
            if (email.length < 4) {
                setErr('Email is invalid. Please enter a correct email.');
                return;
            }
            if (password.length < 6) {
                setErr('Password must be at least 6 characters');
                return;
            }
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.emailVerified) {
                setErr('Verification email sent. Please verify your email.');
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
            setErr((error as FirebaseError).message);
        }
    };

    return (
        <AuthCard>
            <VerificationModal
                modalTitle="Verification Email Sent!"
                modalBody="A verification email was sent to the provided email address."
                visible={modalVisible}
                buttonMessage="Understood"
                setVisible={setModalVisible}
            />
            <EmailInput email={email} setEmail={setEmail} />
            <Spacer y={1} />
            <PasswordInput password={password} setPassword={setPassword} />
            <Spacer y={1} />
            <ErrPopButton
                clickFunc={handleLogin}
                buttonName="Login"
                error={err}
                setError={setErr}
                placement="bottom"
                offset={60}
            />
            <Text>
                You don't have an account? <Link to="/register">Register</Link>
            </Text>
        </AuthCard>
    );
};

export default Login;
