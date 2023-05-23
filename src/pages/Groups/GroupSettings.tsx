import { Loading, Spacer, Input, Textarea, Avatar, Grid, Text } from '@nextui-org/react';
import { SettingsCard, VerificationModal, ErrPopButton, NoErrPopButton } from '../../components';
import { useState, useEffect } from 'react';
import {
    changeGroupName,
    changeGroupPhoto,
    changeGroupDescription,
    checkGroupName,
    getGroupData,
} from '../../database/firestore-db';
import { useContext } from 'react';
import { AuthContext } from '../../context';
import { ErrorMessasge, GroupType } from '../../interfaces';
import { useNavigate, useLocation } from 'react-router-dom';
import { storage } from '../../config/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

const GroupSettings = () => {
    const { user } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [err, setErr] = useState<ErrorMessasge>(null);
    const [loading, setLoading] = useState(false);
    const [currentGroup, setcurrentGroup] = useState<GroupType | null>(null);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [newGroupName, setNewGroupName] = useState<string | null>(null);
    const [newGroupDescription, setNewGroupDescription] = useState<string | null>(null);
    const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const groupId = queryParams.get('groupId') as string;

    useEffect(() => {
        const getGroup = async () => {
            const currentGroup = await getGroupData(groupId);
            if (!currentGroup) {
                return;
            }
            setcurrentGroup(currentGroup as GroupType);
            setCurrentPhoto(currentGroup.photo);
        };
        getGroup();
    }, []);

    const modalHandler = () => {
        navigate('/');
    };

    const [imageUpload, setImageUpload] = useState<File | null>(null);

    useEffect(() => {
        setCurrentPhoto(currentPhoto);
    }, [currentPhoto]);

    const handleUploadPic = () => {
        setPhotoLoading(true);
        const imageRef = ref(storage, `profile-pics/${imageUpload?.name + v4()}`);
        if (!imageUpload) {
            return;
        }
        uploadBytes(imageRef, imageUpload)
            .then(() => getDownloadURL(imageRef))
            .then(url => {
                setCurrentPhoto(url);
            })
            .catch(error => {
                console.error(error);
            });
        setPhotoLoading(false);
    };

    const showUploadButton = Boolean(imageUpload);

    const handleChangeSettings = async () => {
        if (!user) {
            return;
        }
        try {
            if (currentGroup && newGroupName !== currentGroup.name && newGroupName) {
                if (newGroupName.length < 3) {
                    setErr('Group name must be at least 3 characters long!');
                    return;
                }
                const ret = await checkGroupName(newGroupName);
                if (!ret) {
                    setErr('A group with the same name already exists!');
                    return;
                }
                setLoading(true);
                await changeGroupName(groupId, newGroupName);
                setModalVisible(true);
                setLoading(false);
            }
            if (
                (currentGroup &&
                    newGroupName === currentGroup.name &&
                    currentPhoto === currentGroup.photo &&
                    newGroupDescription === currentGroup.description) ||
                (currentGroup && !newGroupName && !newGroupDescription && currentPhoto === currentGroup.photo)
            ) {
                setErr('No changes were made');
                return;
            }
            if (currentGroup && currentPhoto !== currentGroup.photo) {
                setLoading(true);
                await changeGroupPhoto(groupId, currentPhoto as string);
                setModalVisible(true);
                setLoading(false);
            }

            if (currentGroup && newGroupDescription !== currentGroup.description && newGroupDescription) {
                setLoading(true);
                await changeGroupDescription(groupId, newGroupDescription as string);
                setModalVisible(true);
                setLoading(false);
            }
        } catch (error: unknown) {
            throw new Error(`Error changing settings: ${error}`);
        }
    };

    return (
        <SettingsCard>
            <Text
                aria-label="Header-Add-Post"
                h1
                size={40}
                css={{
                    textGradient: '90deg, #fedb58, #fc924c',
                }}
                weight="bold"
            >
                Group Settings
            </Text>
            <>
                <Grid.Container gap={1} alignItems="center">
                    <Grid>
                        <Spacer y={1} />
                        <Avatar src={currentPhoto} css={{ size: '$20' }} />
                        <Spacer y={1} />
                    </Grid>
                    <Grid>
                        <input
                            type="file"
                            onChange={event => {
                                if (event.target.files != null) {
                                    setImageUpload(event.target.files[0]);
                                }
                            }}
                        />
                        <Spacer y={1} />
                        {showUploadButton && (
                            <NoErrPopButton
                                buttonName="Upload group photo"
                                clickFunc={handleUploadPic}
                                placement="right"
                                popoverText="Image uploaded successfully!"
                            />
                        )}
                    </Grid>
                </Grid.Container>
            </>
            <div>
                <Input
                    aria-label="Group Name"
                    bordered
                    clearable
                    initialValue={currentGroup?.name}
                    label="Group Name"
                    type="string"
                    css={{ width: '100%' }}
                    onChange={e => setNewGroupName(e.target.value)}
                />
                <Spacer y={1} />
                <Textarea
                    aria-label="Group Description"
                    bordered
                    initialValue={currentGroup?.description}
                    label="Group Description"
                    css={{ width: '100%' }}
                    onChange={e => setNewGroupDescription(e.target.value)}
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
