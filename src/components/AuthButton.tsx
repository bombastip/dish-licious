import { Button, Card, Popover, Row, Text } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import { ErrorMessasge } from '../interfaces';

interface PopoverProps {
    error: ErrorMessasge;
    buttonName: string;
    setError: (value: ErrorMessasge) => void;
    clickFunc: (value: string) => void;
    placement: 'top' | 'right' | 'bottom' | 'left';
    offset: number;
}

const formatErrorMessage = (err: ErrorMessasge): ErrorMessasge => {
    if (!err) {
        return null;
    }
    if (err === 'Firebase: Error (auth/invalid-email).') {
        return 'Email is invalid. Please enter a correct email.';
    }

    if (err === 'Firebase: Error (auth/user-not-found).') {
        return 'There is no user using this email.\n Please create or new account or try another email.';
    }
    if (err === 'Firebase: Error (auth/wrong-password).') {
        return 'Wrong password.';
    }
    if (err.includes('(auth/too-many-requests).')) {
        return 'Access to this account has been temporarily disabled due to many failed login attempts.';
    }
    return err;
};

const AuthButton: FC<PopoverProps> = props => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (props.error) {
            setIsOpen(true);
            setTimeout(() => {
                setIsOpen(false);
                props.setError(null);
            }, 3000);
        }
    }, [isOpen, props.error]);

    return (
        <Popover placement={props.placement} shouldFlip={false} offset={props.offset} isOpen={isOpen}>
            <Popover.Trigger>
                <Button onPress={props.clickFunc}>{props.buttonName}</Button>
            </Popover.Trigger>
            <Popover.Content>
                {props.error && isOpen && (
                    <Card css={{ $$cardColor: '$colors$error', mw: '300px' }}>
                        <Card.Body>
                            <Row justify="center" align="center">
                                <Text h6 size={13} color="white" css={{ m: 0 }}>
                                    {formatErrorMessage(props.error)}
                                </Text>
                            </Row>
                        </Card.Body>
                    </Card>
                )}
            </Popover.Content>
        </Popover>
    );
};

export default AuthButton;
