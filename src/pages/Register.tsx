import { Spacer, Button, Text } from '@nextui-org/react';
import { useState } from 'react';
import { AuthCard, EmailInput, PasswordInput } from '../components';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, actionCodeSettings } from '../config/firebase-config';
import { createUserCollection } from '../database/firestore-db';
import { Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            createUserCollection(result.user);
            sendEmailVerification(result.user, actionCodeSettings);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthCard>
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
