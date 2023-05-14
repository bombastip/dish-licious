import { Button, Card, Popover, Row, Text } from '@nextui-org/react';
import { FC } from 'react';

type NoErrPopButtonProps = {
    buttonName: string;
    clickFunc: (value: string) => void;
    placement: 'top' | 'right' | 'bottom' | 'left';
    popoverText: string;
};

const NoErrPopButton: FC<NoErrPopButtonProps> = props => {
    return (
        <Popover placement={props.placement}>
            <Popover.Trigger>
                <Button onClick={props.clickFunc}>{props.buttonName}</Button>
            </Popover.Trigger>
            <Popover.Content>
                <Card css={{ $$cardColor: '$colors$success', mw: '300px' }}>
                    <Card.Body>
                        <Row justify="center" align="center">
                            <Text h6 size={13} color="white" css={{ m: 0 }}>
                                {props.popoverText}
                            </Text>
                        </Row>
                    </Card.Body>
                </Card>
            </Popover.Content>
        </Popover>
    );
};

export default NoErrPopButton;
