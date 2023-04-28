import { Input } from '@nextui-org/react';
import { FC } from 'react';

interface UsernameInputProps {
    username: string;
    setUsername: (value: string) => void;
}

const UsernameInput: FC<UsernameInputProps> = props => {
    return (
        <Input
            label="Username"
            clearable
            bordered
            fullWidth
            color="default"
            size="lg"
            type="text"
            value={props.username}
            onChange={e => props.setUsername(e.target.value)}
        />
    );
};

export default UsernameInput;
