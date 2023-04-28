import { Input } from '@nextui-org/react';
import { FC, useMemo } from 'react';
import { InputColorMessage } from '../interfaces/helper';

interface EmailInputProps {
    email: string;
    setEmail: (value: string) => void;
}

const validateEmail = (value: string) => {
    return value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i);
};

const EmailInput: FC<EmailInputProps> = props => {
    const helper: InputColorMessage = useMemo(() => {
        if (!props.email)
            return {
                text: '',
                color: 'default',
            };
        const isValid = validateEmail(props.email);
        return {
            text: isValid ? 'Correct email' : 'Enter a valid email',
            color: isValid ? 'success' : 'error',
        };
    }, [props.email]);

    return (
        <Input
            clearable
            shadow={false}
            bordered
            fullWidth
            size="lg"
            status={helper.color}
            color={helper.color}
            helperColor={helper.color}
            helperText={helper.text}
            type="email"
            label="Email"
            value={props.email}
            onChange={e => props.setEmail(e.target.value)}
        />
    );
};

export default EmailInput;
