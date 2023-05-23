import { Loading, Spacer, Input, Textarea } from '@nextui-org/react';
import { SettingsCard, VerificationModal, ErrPopButton } from '../../components';
import { GroupPic } from '../../components/Groups';
import { useState, useEffect } from 'react';
import { getGroupData } from '../../database/firestore-db';
import { useContext } from 'react';
import { AuthContext } from '../../context';
import { ErrorMessasge, GroupType } from '../../interfaces';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const GroupSettings = () => {
    const { user } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [err, setErr] = useState<ErrorMessasge>(null);
    const [loading, setLoading] = useState(false);
    const [currentGroup, setcurrentGroup] = useState<GroupType | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [component, setComponent] = useState<JSX.Element | null>(null);
    const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
    const [photoLoading, setPhotoLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const groupId = queryParams.get('groupId') as string;

    useEffect(() => {
        const getGroup = async () => {
            const currentGroup = await getGroupData(groupId);
            console.log(currentGroup);
            setcurrentGroup(currentGroup as GroupType);
            setDataLoaded(true);
        };
        getGroup();
    }, []);

    const modalHandler = () => {
        navigate('/');
    };

    const handleChangeSettings = async () => {
        if (!user) {
            return;
        }

        alert('Not implemented yet');
    };

    useEffect(() => {
        if (dataLoaded && currentGroup) {
            setComponent(<GroupPic group={currentGroup} />);
            setCurrentPhoto(currentGroup.photo);
            setPhotoLoading(false);
        }
    }, [dataLoaded, currentGroup]);

    return (
        <SettingsCard>
            <h1>Group Settings</h1>
            {component}
            <Spacer y={1} />
            <div>
                <Input
                    aria-label="Group Name"
                    bordered
                    clearable
                    initialValue={currentGroup?.name}
                    label="Group Name"
                    type="string"
                    css={{ width: '100%' }}
                />
                <Spacer y={1} />
                <Textarea
                    aria-label="Group Description"
                    bordered
                    initialValue={currentGroup?.description}
                    label="Group Description"
                    css={{ width: '100%' }}
                />
            </div>
            <Spacer y={1} />
            <VerificationModal
                modalTitle={'Group settings changed!'}
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

export default GroupSettings;
