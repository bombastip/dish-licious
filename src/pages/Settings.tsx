import { Loading, Spacer, Switch } from '@nextui-org/react';
import {
    UsernameInput,
    SettingsCard,
    SunIcon,
    MoonIcon,
    ProfilePic,
    VerificationModal,
    ErrPopButton,
} from '../components';
import { useState } from 'react';
import { getUserData, changePhotoURL, changeUsername, checkUsername } from '../database/firestore-db';
import { useContext } from 'react';
import { AuthContext, UserDataContext } from '../context';
import { ErrorMessasge } from '../interfaces';
import useDarkMode from 'use-dark-mode';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState('');
    const { user } = useContext(AuthContext);
    const { setReloadUserData } = useContext(UserDataContext);
    const [err, setErr] = useState<ErrorMessasge>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const modalHandler = () => {
        navigate('/');
    };

    const handleChangeSettings = async () => {
        if (!user) {
            return;
        }
        const userData = await getUserData(user.uid as string);
        try {
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
                setLoading(true);
                await changeUsername(user.uid, username);
                setReloadUserData(true);
                setModalVisible(true);
                setLoading(false);
            }
            if (userData && !username && currentPhoto === userData.photoURL) {
                setErr('No changes were made');
                return;
            }
            if (userData && currentPhoto !== userData.photoURL) {
                setLoading(true);
                await changePhotoURL(user.uid, currentPhoto);
                setReloadUserData(true);
                setModalVisible(true);
                setLoading(false);
            }
        } catch (error: unknown) {
            throw new Error(`Error changing settings: ${error}`);
        }
    };
    const darkMode = useDarkMode(false);

    const { component, currentPhoto, photoLoading } = ProfilePic();

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
            {photoLoading || loading ? (
                <Loading />
            ) : (
                <ErrPopButton
                    clickFunc={handleChangeSettings}
                    buttonName="Save changes"
                    error={err}
                    setError={setErr}
                    placement="bottom"
                    offset={40}
                />
            )}
        </SettingsCard>
    );
};

export default Settings;
