import { Modal, Text, Button, Card, Row, Spacer } from '@nextui-org/react';
import { FC } from 'react';

interface VerificationModalProps {
    modalTitle: string;
    modalBody: string;
    visible: boolean;
    buttonMessage: string;
    setVisible: (value: boolean) => void;
    buttonFunction?: () => void;
}

const VerificationModal: FC<VerificationModalProps> = props => {
    const closeHandler = () => {
        props.setVisible(false);
        if (props.buttonFunction) {
            props.buttonFunction();
        }
    };
    return (
        <Modal blur aria-labelledby="modal-title" open={props.visible} onClose={closeHandler}>
            <Modal.Body>
                <Card css={{ $$cardColor: '$colors$primary' }}>
                    <Card.Body>
                        <Row>
                            <Text id="modal-title" size={18} color="white">
                                {props.modalTitle}
                            </Text>
                        </Row>
                        <Row justify="center" align="center">
                            <Text id="modal-title" size={16} color="white">
                                {props.modalBody}
                            </Text>
                        </Row>
                        <Spacer y={1} />
                        <Button auto onPress={closeHandler} color="white">
                            {props.buttonMessage}
                        </Button>
                    </Card.Body>
                </Card>
            </Modal.Body>
        </Modal>
    );
};

export default VerificationModal;
