import { Card, Grid, Text, Button, Row, User, Spacer, Image } from '@nextui-org/react';
import { HeartIcon } from './HeartIcon';
import SinglePost from './SinglePost'
import { useEffect, useState } from 'react';
import { getDocs,getDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { PostType } from '../interfaces';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

export const Post = () => {
    const { user } = useContext(AuthContext);
    const userCollectionRef = collection(db, 'users');
    const [likes, setLikes] = useState([]);
    const [likesLength, setLikesLength] = useState<number>(0);
    const [postList, setPostList] = useState<PostType[]>([
        { userID: '', title: '', description: '', photoURL: '', likes: [], timeCost: 0, timeUnit: '', id: '' },
    ]);
    const postCollectionRef = collection(db, 'posts');

    useEffect(() => {
        const getPostList = async () => {
            // READ THE DATA
            // SET THE POST LIST
            try {
                const data = await getDocs(postCollectionRef);
                const filteredData = data.docs.map(doc => ({
                    ...(doc.data() as PostType),
                    id: doc.id,
                }));
                setPostList(filteredData);
            } catch (err) {
                console.error(err);
            }
        };
        getPostList();
    }, []);
    // interface Ingredient {
    //     name: string;
    //     quantity: number;
    //     unit: string;
    //     likes: Array<string>;
    // }

    const addToFav = async (postId: string )=> {
        console.log(postId);
        if (user) {
            const userDocRef = doc(userCollectionRef, user.uid);
            try {
              await updateDoc(userDocRef, {
                favourites: arrayUnion(postId),
              });
            } catch (err) {
              console.error(err);
            } 
          }
    };

     const like = async (postId: string )=> {
        try {
            if (user !== null) {

                // adauga postarea in lista de postari ale utilizatorului curent
                const postDocRef = doc(postCollectionRef, postId);
                // getDoc(postDocRef)
                // .then(doc => {
                //     if (doc.exists()) {
                //         setLikesLength(doc.data().likes.length);

                //     } else {
                //         console.log(`User documentnot found`);
                //     }
                // })
                await updateDoc(postDocRef, {
                    likes: arrayUnion(user.uid),
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Grid.Container gap={2} justify="center" css={{ marginTop: '20px' }}>
            <div>
                {postList.map(post => (
                    <>
                        {/* <Link to={`/post?postId=${post.id}`}> */}
                         <SinglePost post={post} />
                        {/* </Link> */}
                        <Spacer y={0.5} />
                    </>
                ))}
            </div>
        </Grid.Container>
    );
};
