import { Input } from '@nextui-org/react';
import { FC } from 'react';

interface PasswordInputProps {
    password: string;
    setPassword: (value: string) => void;
}

const PasswordInput: FC<PasswordInputProps> = props => {
    return (
        <Input.Password
            label="Password"
            clearable
            bordered
            fullWidth
            color="default"
            size="lg"
            type="password"
            value={props.password}
            onChange={e => props.setPassword(e.target.value)}
        />
    );
};

export default PasswordInput;
