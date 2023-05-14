import { Spacer, Button, Switch, Text } from '@nextui-org/react';
import {
    UsernameInput,
    SettingsCard,
    SunIcon,
    MoonIcon,
    ProfilePic,
    VerificationModal,
    AuthButton,
} from '../components';
import { useState } from 'react';
import { getUserData, changePhotoURL, changeUsername, checkUsername } from '../database/firestore-db';
import { useContext } from 'react';
import { AuthContext, UserDataContext } from '../context';
import { ErrorMessasge, User } from '../interfaces';
import useDarkMode from 'use-dark-mode';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState('');
    const { user } = useContext(AuthContext);
    const { setReloadUserData } = useContext(UserDataContext);
    const [err, setErr] = useState<ErrorMessasge>(null);
    const navigate = useNavigate();

    const modalHandler = () => {
        navigate('/');
    };

    const handleChangeSettings = async () => {
        if (!user) {
            return;
        }
        const userData = await getUserData(user.uid as string);
        try {
            let check = false;
            if (username) {
                if (username.length < 3) {
                    setErr('Username must be at least 3 characters long!');
                    return;
                }
                if (userData && username === userData.username) {
                    setErr('You need to choose a different username!');
                    return;
                }
                const ret = await checkUsername(username);
                if (!ret) {
                    setErr('Username already taken!');
                    return;
                }
                await changeUsername(user.uid, username);
                setReloadUserData(true);
            }
            if (userData && currentPhoto !== userData.photoURL) {
                await changePhotoURL(user.uid, currentPhoto);
                setReloadUserData(true);
                alert('Settings changed!');
            }
        } catch (error: unknown) {
            throw new Error(`Error changing settings: ${error}`);
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
            <VerificationModal
                modalTitle={'User settings changed!'}
                modalBody={''}
                visible={modalVisible}
                buttonMessage={'OK'}
                setVisible={setModalVisible}
                buttonFunction={modalHandler}
            />
            {/* <Button onPress={handleChangeSettings}>Save changes</Button> */}
            <AuthButton clickFunc={handleChangeSettings} buttonName="Save changes" error={err} setError={setErr} />
        </SettingsCard>
    );
};

export default Settings;
