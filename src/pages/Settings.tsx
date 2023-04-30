import ProfilePic from '../components/ProfilePic';
import { Spacer, Button, Switch } from '@nextui-org/react';
import { UsernameInput, SettingsCard, SunIcon, MoonIcon } from '../components';
import { useState } from 'react';
import { changeUsername, checkUsername } from '../database/firestore-db';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { User } from '../interfaces';
import useDarkMode from 'use-dark-mode';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [username, setUsername] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSettings = async () => {
        try {
            const ret = await checkUsername(username);
            if (!ret || username.length < 3) {
                alert('Username already taken!');
                return;
            }
            changeUsername(username, user as User);
            alert('Username changed!');
            // FIXME: fetch user data from firestore
            navigate('/');
        } catch (error: unknown) {
            console.error(error);
        }
    };
    const darkMode = useDarkMode(false);

    return (
        <SettingsCard>
            <h1>Settings</h1>
            <Switch
                checked={darkMode.value}
                onChange={darkMode.toggle}
                size="xl"
                iconOn={<MoonIcon filled />}
                iconOff={<SunIcon filled />}
            />
            <ProfilePic />
            <div>
                <UsernameInput username={username} setUsername={setUsername} />
            </div>
            <Spacer y={1} />
            <Button onPress={handleSettings}>Save changes</Button>
        </SettingsCard>
    );
};

export default Settings;
