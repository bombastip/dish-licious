import { Container, Input, Row, Spacer, Text, Col, Button, Card, Grid, FormElement } from '@nextui-org/react';
import { useState, ChangeEvent, FormEvent } from 'react';

const SearchRecipe = () => {
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newTimeUnit, setNewTimeUnit] = useState('');
    const [newTimeCost, setNewTimeCost] = useState(0);

    interface recipeInfo {
        name: string;
    }

    const [formFields, setFormfields] = useState<recipeInfo[]>([
        { name: '', quantity: 0, measureUnit: '' } as recipeInfo,
    ]);

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const handleFormChange = (event: ChangeEvent<FormElement>, index: number) => {
        const data = [...formFields] as recipeInfo[];
        data[index][event.target.name as keyof recipeInfo] = event.target.value;
        setFormfields(data);
    };

    const addFields = () => {
        const object = {
            name: '',
        };
        setFormfields([...formFields, object]);
    };

    const removeFields = (index: number) => {
        console.log(index);
        const data = [...formFields];
        data.splice(index, 1);
        setFormfields(data);
    };

    return (
        //
        <Grid.Container gap={2} justify="center" alignItems="center" css={{ textAlign: 'center' }}>
            <Grid sm={12} md={5}>
                <Card aria-label="Add Post" css={{ width: '650px' }}>
                    <Card.Header>
                        <Col>
                            <Text
                                aria-label="Header-Add-Post"
                                h1
                                size={40}
                                css={{
                                    textGradient: '90deg, #fedb58, #fc924c',
                                    margin: '0 auto',
                                    display: 'inline-block',
                                }}
                                weight="bold"
                            >
                                Search Recipe
                            </Text>
                            <Text>complete at least one field</Text>
                        </Col>
                    </Card.Header>
                    <Card.Divider />
                    <Card.Body css={{ py: '$10' }}>
                        <Container
                            aria-label="Add-Post-Container"
                            justify="center"
                            alignItems="center"
                            css={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                        >
                            <Input
                                aria-label="Title-Add-Post"
                                bordered
                                labelPlaceholder="Title"
                                onChange={e => setNewPostTitle(e.target.value)}
                                css={{ width: '100%' }}
                            />
                            <Spacer y={2.5} />
                            <Input
                                aria-label="TimeCost-Add-Post"
                                bordered
                                labelPlaceholder="TimeCost"
                                type="number"
                                min="0"
                                onChange={e => setNewTimeCost(Number(e.target.value))}
                                css={{ width: '100%' }}
                            />
                            <Spacer y={2.5} />
                            <Input
                                aria-label="TimeUnit-Add-Post"
                                clearable
                                bordered
                                labelPlaceholder="TimeUnit"
                                onChange={e => setNewTimeUnit(e.target.value)}
                                css={{ width: '100%' }}
                            />
                            <Spacer y={2.5} />

                            <div>
                                <form onSubmit={submit}>
                                    {formFields.map((form, index) => {
                                        return (
                                            <table key={index} style={{ marginTop: '20px', paddingRight: '30px' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ paddingRight: '10px' }}>
                                                            <Input
                                                                aria-label="Ingredient-Name-Add-Post"
                                                                bordered
                                                                name="name"
                                                                placeholder="Name Ingredient"
                                                                width="150px"
                                                                onChange={(event: ChangeEvent<FormElement>) =>
                                                                    handleFormChange(event, index)
                                                                }
                                                                value={form.name}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Button
                                                                color="warning"
                                                                onPress={() => removeFields(index)}
                                                                auto
                                                                rounded
                                                                flat
                                                            >
                                                                Remove
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </form>
                                <Row style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <Button color="warning" onPress={addFields} auto rounded flat>
                                        Add ingredient
                                    </Button>
                                    <Spacer y={3} />
                                </Row>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            ></div>
                            <Row justify="center">
                                <Button
                                    buttonName={'Post'}
                                    // clickFunc={handler}
                                    placement="right"
                                    auto
                                    size="md"
                                    offset={15}
                                >
                                    Search
                                </Button>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
            </Grid>
        </Grid.Container>
    );
};

export default SearchRecipe;
