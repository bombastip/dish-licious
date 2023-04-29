import { Badge, Button, Popover } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import { errorMessasge } from '../interfaces/helper';

interface PopoverProps {
    error: errorMessasge;
    defaultMessage: string;
    buttonName: string;
    clickFunc: (value: string) => void;
}

const AuthButton: FC<PopoverProps> = props => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Popover offset={60} isOpen={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger>
                <Button onPress={props.clickFunc}>{props.buttonName}</Button>
            </Popover.Trigger>
            <Popover.Content>
                {!props.error ? (
                    <Badge color="success" size = "lg">{props.defaultMessage}</Badge>
                ) : <Badge color="error" size = "lg">{props.error}</Badge>}
            </Popover.Content>
        </Popover>
    );
};

export default AuthButton;
