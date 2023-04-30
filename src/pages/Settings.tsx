import ProfilePic from '../components/ProfilePic';
import { Spacer, Button, Switch } from '@nextui-org/react';
import { UsernameInput, SettingsCard, SunIcon, MoonIcon } from '../components';
import { useState } from 'react';
import { getUserData, changePhotoURL, changeUsername, checkUsername } from '../database/firestore-db';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { User } from '../interfaces';
import useDarkMode from 'use-dark-mode';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [username, setUsername] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChangeSettings = async () => {
        const userData = await getUserData(user as User);
        try {
            if (username.length < 3) {
                alert('Username must be at least 3 characters long!');
                return;
            }
            if (userData && username === userData.username) {
                alert('You need to choose a different username!');
                return;
            }
            const ret = await checkUsername(username);
            if (!ret) {
                alert('Username already taken!');
                return;
            }
            changeUsername(username, user as User);
            if (userData && currentPhoto !== userData.photoURL) {
                changePhotoURL(currentPhoto, user as User);
                alert('Settings changed!');
            }
            // FIXME: fetch user data from firestore
            navigate('/');
        } catch (error: unknown) {
            console.error(error);
        }
    };
    const darkMode = useDarkMode(false);
    const { component, currentPhoto } = ProfilePic();

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
            {component}
            <div>
                <UsernameInput username={username} setUsername={setUsername} />
            </div>
            <Spacer y={1} />
            <Button onPress={handleChangeSettings}>Save changes</Button>
        </SettingsCard>
    );
};

export default Settings;
