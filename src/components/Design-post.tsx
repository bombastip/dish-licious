import { Card, Grid, Text, Button, Row, User, Spacer, Image } from '@nextui-org/react';
import { HeartIcon } from './HeartIcon';

export const Post = () => {
    return (
        <Grid.Container gap={2} justify="center">
            <Card
                isPressable
                isHoverable
                variant="bordered"
                css={{ mw: "400px" }}>
                <Card.Header>
                    <Text b css={{ whiteSpace: "nowrap" }}>Post Title</Text>
                    <Row justify="flex-end">
                        <User
                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                            name="Ariana Wattson"
                        />
                    </Row>
                </Card.Header>
                <Card.Divider />
                <Card.Body css={{ py: "$10" }}>
                    <Image
                        width={400}
                        height={170}
                        containerCss={{borderRadius: "3%"}}
                        src="https://images.services.kitchenstories.io/8OjqS2ypvWStDdcOl882SLW1p9g=/3840x0/filters:quality(80)/images.kitchenstories.io/wagtailOriginalImages/R2726-photo-final-2.jpg"
                        alt="Default Image"
                        objectFit="cover"
                    />
                     <Spacer y={1} />
                    <Text>
                        Ingrediente:
                        350 faina
                        3 oua
                        50 g unt topit
                        500 ml lapte rece
                        250 ml apa minerala
                        un praf de sare
                        optional: vanilie, coaja de lamaie
                        ulei pentru prajit
                    </Text>
                    <Text>
                        Mod de preparare:
                    </Text>
                </Card.Body>
                <Card.Divider />
                <Card.Footer>
                    <Row justify="flex-start">
                        <Button

                            auto
                            color='error'
                            css={{ mr: '$2' }}
                            icon={<HeartIcon fill="currentColor" filled />}
                        />
                        <Button flat color='error' auto>
                            Save
                        </Button>

                    </Row>
                    <Row justify="flex-end">
                        <Button.Group><Button css={{ mr: '$2' }}> + </Button>
                            <Button >View comment list</Button>
                        </Button.Group>
                    </Row>
                </Card.Footer>
            </Card>
        </Grid.Container>
    );
};
