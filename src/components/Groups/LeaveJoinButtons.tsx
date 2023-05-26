import { Button, Text } from '@nextui-org/react';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context';
import { addGroupNotif, removeGroupNotif, isRequestSent, removeGroupMember } from '../../database';
import { GroupType } from '../../interfaces';

interface LeaveJoinButtonsProps {
    isMember: boolean;
    setIsMember: (isMember: boolean) => void;
    group: GroupType;
    groupId: string;
}

const LeaveJoinButtons = ({ isMember, setIsMember, group, groupId }: LeaveJoinButtonsProps) => {
    const { user } = useContext(AuthContext);
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        const checkRequestSent = async () => {
            if (user) {
                const requestSent = await isRequestSent(user.uid, groupId, group.admin);
                setRequestSent(requestSent);
            }
        };
        checkRequestSent();
    }, [user]);

    const handleJoinGroup = () => {
        if (user) {
            setRequestSent(true);
            addGroupNotif(user.uid, groupId, group.admin);
        }
    };

    const handleCancelRequest = () => {
        if (user) {
            setRequestSent(false);
            removeGroupNotif(user.uid, groupId, group.admin);
        }
    };

    const handleLeaveGroup = () => {
        if (user) {
            setIsMember(false);
            removeGroupMember(user.uid, groupId);
        }
    };
    console.log('isMember: ', isMember);
    console.log('requestSent: ', requestSent);

    return (
        <>
            {!isMember && !requestSent && (
                <Button flat auto rounded css={{ color: '#fedebe', bg: '#f6d8d826 ' }} onPress={handleJoinGroup}>
                    <Text css={{ color: 'inherit' }} size={14} weight="bold" onPress={handleJoinGroup}>
                        Join Group
                    </Text>
                </Button>
            )}
            {!isMember && requestSent && (
                <Button flat auto rounded css={{ color: '#fedebe', bg: '#f6d8d826 ' }} onPress={handleCancelRequest}>
                    <Text css={{ color: 'inherit' }} size={14} weight="bold" onPress={handleLeaveGroup}>
                        Cancel Request
                    </Text>
                </Button>
            )}
            {isMember && (
                <Button flat auto rounded css={{ color: '#fedebe', bg: '#f6d8d826 ' }} onPress={handleLeaveGroup}>
                    <Text css={{ color: 'inherit' }} size={14} weight="bold" onPress={handleLeaveGroup}>
                        Leave Group
                    </Text>
                </Button>
            )}
        </>
    );
};

export default LeaveJoinButtons;
