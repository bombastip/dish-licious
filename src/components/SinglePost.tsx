import { Card, Text, Button, Row, User, Spacer, Image } from '@nextui-org/react';
import { HeartIcon } from './HeartIcon';
import { useEffect, useState } from 'react';
import {  getDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { PostType } from '../interfaces';

type Props = {
    post: PostType;
};

function SinglePost({ post }: Props) {
   
    const { user } = useContext(AuthContext);
    const userCollectionRef = collection(db, 'users');
    const [likesLength, setLikesLength] = useState<number>(0);
    //console.log(currentPostId);

    
    const addToFav = async () => {
        if (user) {
            const userDocRef = doc(userCollectionRef, user.uid);
            try {
                await updateDoc(userDocRef, {
                    favourites: arrayUnion(post.id),
                });
            } catch (err) {
                console.error(err);
            }
        }
    };

    const like = async () => {
        try {
            if (user !== null) {
                setLikesLength(likesLength+1);
                post.likes.push(user.uid);
               
        }} catch (err) {
            console.error(err);
        }
    };

    return (
        <Card isPressable isHoverable variant="bordered" css={{ mw: '400px' }}>
            <Card.Header>
                <Text b css={{ whiteSpace: 'nowrap' }}>
                    {post.title}
                </Text>
                <Row justify="flex-end">
                    <User
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        name="Ariana Wattson"
                    />
                </Row>
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ py: '$10' }}>
                <Image
                    width={400}
                    height={170}
                    containerCss={{ borderRadius: '3%' }}
                    src={post.photoURL}
                    alt="Default Image"
                    objectFit="cover"
                />
                <Spacer y={0.2} />
                <Row>
                    <Text color="#ec9127" css={{ marginLeft: '$1' }}>
                        {' '}
                        Liked by {likesLength}{' '}
                    </Text>
                </Row>
                <Spacer y={0.3} />
                <Text
                    css={{
                        height: '5em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                    }}
                >
                    Mod de preparare: {post.description}
                </Text>
                {/* <Text>
        Ingrediente:
        <Text>
            {post.ingredients.map((ingredient: Ingredient, index: number) => (
                <li
                    key={index}
                >{`${ingredient.quantity} ${ingredient.unit} of ${ingredient.name} `}</li>
            ))}
        </Text>
        </Text> */}
                <Text>
                    {' '}
                    Time Cost: {post.timeCost} {post.timeUnit}
                </Text>
            </Card.Body>
            <Card.Divider />
            <Card.Footer>
                <Row justify="flex-start">
                    <Button
                        auto
                        color="error"
                        css={{ mr: '$2' }}
                        icon={<HeartIcon fill="currentColor" filled onClick={() => like()} />}
                    />
                    <Button flat color="error" auto onClick={() => addToFav()} >
                        Save
                    </Button>
                </Row>
                <Row justify="flex-end">
                    <Button.Group>
                        <Button css={{ mr: '$2' }}> + </Button>
                        <Button>View comment list</Button>
                    </Button.Group>
                </Row>
            </Card.Footer>
        </Card>
    )
}
export default SinglePost;