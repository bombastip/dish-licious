import { Badge, Button, Popover } from '@nextui-org/react';
import { FC, useEffect, useRef, useState } from 'react';
import { ErrorMessasge } from '../interfaces';

interface PopoverProps {
    error: ErrorMessasge;
    buttonName: string;
    setError: (value: ErrorMessasge) => void;
    clickFunc: (value: string) => void;
}

const AuthButton: FC<PopoverProps> = props => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (props.error) {
            setIsOpen(true);
            setTimeout(() => {
                setIsOpen(false);
                props.setError(null);
            }, 2000);
        }
    }, [isOpen, props.error]);

    return (
        <Popover offset={60} isOpen={isOpen}>
            <Popover.Trigger>
                <Button onPress={props.clickFunc}>{props.buttonName}</Button>
            </Popover.Trigger>
            <Popover.Content>
                {props.error && isOpen && (
                    <Badge color="error" size="lg">
                        {props.error}
                    </Badge>
                )}
            </Popover.Content>
        </Popover>
    );
};

export default AuthButton;
