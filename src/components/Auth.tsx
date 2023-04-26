import { useState, useEffect, useMemo } from 'react';
import 'firebase/auth';
import { auth } from '../config/firebase-config';
import { Input, Container, Card, Image, Button, Spacer, createTheme } from '@nextui-org/react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import Logo from '../assets/logo.jpg';
import { Helper } from '../interfaces/helper';

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Add an observer for changes to the user's authentication state
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        });

        // Unsubscribe from the observer when the component unmounts
        return unsubscribe;
    }, []);

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            auth.currentUser &&
                sendEmailVerification(auth.currentUser).then(() => {
                    console.log('Email verification sent');
                });
            setLoggedIn(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoggedIn(true);
            console.log('ok');
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            setLoggedIn(false);
        } catch (error) {
            console.error(error);
        }
    };

    const lightRetroTheme = createTheme({
        type: 'light',
        className: 'light-retro',
        theme: {
            colors: {
                primary: '#ec9127',
                primaryLight: 'transparent',
                error: '#EE457E',
            },
        },
    });

    const validateEmail = (value: string) => {
        return value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i);
    };
    const helper: Helper = useMemo(() => {
        if (!email)
            return {
                text: '',
                color: 'default',
            };
        const isValid = validateEmail(email);
        return {
            text: isValid ? 'Correct email' : 'Enter a valid email',
            color: isValid ? 'success' : 'error',
        };
    }, [email]);

    return (
        <div className={lightRetroTheme}>
            <Image showSkeleton width={640} height={360} maxDelay={10000} src={Logo} alt="logo" />
            {loggedIn ? (
                <div>
                    <h1>You are logged in!</h1>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <Container display="flex" alignItems="center" justify="center" css={{ mw: '600px' }}>
                    <Card>
                        <Card.Body>
                            <Input
                                clearable
                                shadow={false}
                                bordered
                                fullWidth
                                size='lg'
                                status={helper.color}
                                color={helper.color}
                                helperColor={helper.color}
                                helperText={helper.text}
                                type="email"
                                label="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <Spacer y={1} />
                            <Input.Password
                                label="Password"
                                clearable
                                bordered
                                fullWidth
                                color="default"
                                size="lg"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <Spacer y={1} />
                            <Button onClick={handleRegister}>Register</Button>
                            <Spacer y={1} />
                            <Button onClick={handleLogin}>Login</Button>
                        </Card.Body>
                    </Card>
                </Container>
            )}
        </div>
    );
}

export default Auth;
