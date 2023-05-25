import { Button, Text } from "@nextui-org/react";
import { useContext } from "react";
import { AuthContext } from "../../context";

interface LeaveJoinButtonsProps {
    isMember: boolean;
    setIsMember: (isMember: boolean) => void;
}

const LeaveJoinButtons = ({ isMember, setIsMember }: LeaveJoinButtonsProps) => {
    const { user } = useContext(AuthContext);

    const handleJoinGroup = () => {
        if (user) {
            setIsMember(true);
        }
    };

    const handleLeaveGroup = () => {
        if (user) {
            setIsMember(false);
        }
    };

    return (
        <>
            {!isMember && (
                <Button flat auto rounded css={{ color: '#fedebe', bg: '#f6d8d826 ' }} onPress={handleJoinGroup}>
                    <Text css={{ color: 'inherit' }} size={14} weight="bold" onPress={handleJoinGroup}>
                        Join Group
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
