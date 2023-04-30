import ProfilePic from '../components/ProfilePic';
import { Spacer, Button, Switch, useTheme } from '@nextui-org/react';
import { UsernameInput, SettingsCard, SunIcon, MoonIcon } from '../components';
import { useState } from 'react';
import { changeUsername, checkUsername } from '../database/firestore-db';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { User } from '../interfaces';
import useDarkMode from 'use-dark-mode';
import { useNavigate, Link, redirect } from 'react-router-dom';
// import { ChangeTheme } from '../themes/mainTheme';

//const { theme, themeLoading } = useContext(ThemeContext);

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
            navigate('/');
            user?.reload();
            console.log(username);
            // fetch user data from firestore
            // after changes, redirect to /dashboard with useEffect
            //return <Navigate to="/dashboard" />;
        } catch (error: unknown) {
            console.error(error);
        }
    };

    // const handleThemeChange = () => {
    //     if (theme === 'light') {
    //         theme = 'dark';
    //     } else {
    //         theme = 'light';
    //     }
    // };
    const darkMode = useDarkMode(false);

    const onChangeHandler = () => {
        darkMode.toggle;
        console.log(darkMode.value);
    };

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
