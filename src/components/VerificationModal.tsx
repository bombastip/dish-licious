import { Modal, Text, Button, Card, Row, Spacer } from '@nextui-org/react';
import { FC } from 'react';

interface VerificationModalProps {
    visible: boolean;
    setVisible: (value: boolean) => void;
    handler: () => void;
}

const VerificationModal: FC<VerificationModalProps> = props => {
    const closeHandler = () => {
        props.setVisible(false);
    };
    return (
        <Modal blur aria-labelledby="modal-title" open={props.visible} onClose={closeHandler}>
            <Modal.Body>
                <Card css={{ $$cardColor: '$colors$primary' }}>
                    <Card.Body>
                        <Row>
                            <Text id="modal-title" size={18} color="white">
                                Verification Email Sent!
                            </Text>
                        </Row>
                        <Row justify="center" align="center">
                            <Text id="modal-title" size={16} color="white">
                                A verification email was sent to the provided email address.
                            </Text>
                        </Row>
                        <Spacer y={1} />
                        <Button auto onPress={closeHandler} color="white">
                            Understood
                        </Button>
                    </Card.Body>
                </Card>
            </Modal.Body>
        </Modal>
    );
};

export default VerificationModal;
