import { Grid, Spacer, Loading } from '@nextui-org/react';
import { db } from '../config';
import { doc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context';
import { PostType } from '../interfaces';
import SinglePost from './SinglePost';

function Favorites() {
    const { user, userLoading } = useContext(AuthContext);
    const [favorites, setFavorites] = useState<PostType[]>([]);

    if (userLoading || !user) {
        return <Loading />;
    }

    useEffect(() => {
        const getMyFavorites = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const myFavorites = [];
                    for (const favorite of docSnap.data().favourites) {
                        const favRef = doc(db, 'posts', favorite);
                        const data = (await getDoc(favRef)).data() as PostType;
                        data.id = favorite;
                        myFavorites.push(data as PostType);
                    }
                    setFavorites(myFavorites);
                } else {
                    console.log('No such document!');
                    setFavorites([]);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getMyFavorites();
    }, [user]);

    return (
        <Grid.Container gap={2} justify="center" css={{ marginTop: '20px' }}>
            {favorites &&
                favorites
                    .slice()
                    .reverse()
                    .map(post => (
                        <Grid wrap="wrap" key={post.id}>
                            <SinglePost post={post} />
                            <Spacer y={0.5} />
                        </Grid>
                    ))}
        </Grid.Container>
    );
}

export default Favorites;
