import 'firebase/compat/firestore';
import { db } from '../config/firebase-config';
import { doc, setDoc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { User } from 'firebase/auth';

export async function createUserCollection(user: User, username: string) {
    const docRef = doc(db, 'users', user.uid);
    const data = {
        username: username,
        photoURL: 'https://icon-library.com/images/2693a2979d_91160.png',
    };
    setDoc(docRef, data)
        .then(() => {
            console.log('User written with ID: ', user.uid);
        })
        .catch(error => {
            console.log(error);
        });
}

// create follow collection for user
export async function createFollowCollection(user: User) {
    const docRef = doc(db, 'follow', user.uid);
    const data = {
        following: [],
        followers: [],
    };
    setDoc(docRef, data)
        .then(() => {
            console.log('Follow collection created for: ', user.uid);
        })
        .catch(error => {
            console.log(error);
        });
}

export async function checkUsername(username: string) {
    const q = query(collection(db, 'users'), where('username', '==', username));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data());
    });
    if (querySnapshot.empty) {
        console.log('No matching documents.');
        return true;
    }
    return false;
}

export async function changeUsername(username: string, user: User) {
    const result = await checkUsername(username);
    if (result) {
        const docRef = doc(db, 'users', user.uid);
        const data = {
            username: username,
        };
        setDoc(docRef, data, { merge: true })
            .then(() => {
                console.log('Username changed successfully in: ', username);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

export async function changePhotoURL(photoURL: string, user: User) {
    const docRef = doc(db, 'users', user.uid);
    const data = {
        photoURL: photoURL,
    };
    setDoc(docRef, data, { merge: true })
        .then(() => {
            console.log('PhotoURL changed successfully in: ', photoURL);
        })
        .catch(error => {
            console.log(error);
        });
}
// function to get following array from firestore follow collection
export async function getFollowing(user: User) {
    const followRef = doc(db, 'follow', user.uid);
    const docSnap = await getDoc(followRef);
    if (docSnap.exists()) {
        console.log('Document data:', docSnap.data().following);
        return docSnap.data().following;
    } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
        return false;
    }
}

// function to get followers array from firestore follow collection
export async function getFollowers(id: string) {
    const followRef = doc(db, 'follow', id);
    const docSnap = await getDoc(followRef);
    if (docSnap.exists()) {
        console.log('Document data:', docSnap.data().followers);
        return docSnap.data().followers;
    } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
        return false;
    }
}

// add followUser to user's following array in firestore in follow collection
export async function follow(wantToFollow: string, user: User) {
    const followRef = doc(db, 'follow', user.uid);
    const followingList = await getFollowing(user);
    if (followingList) {
        console.log('Document data:', followingList);
        if (
            followingList.some((element: string) => {
                if (element === wantToFollow) return true;
                else return false;
            })
        ) {
            console.log('Already following');
            return false;
        } else {
            followingList.push(wantToFollow);
            const data = {
                following: followingList,
            };
            setDoc(followRef, data, { merge: true })
                .then(() => {
                    console.log('Following added successfully in: ', followingList);
                })
                .catch(error => {
                    console.log(error);
                });
            // add user to wantToFollow's followers array in firestore in follow collection
            const followersRef = doc(db, 'follow', wantToFollow);
            const followersList = await getFollowers(wantToFollow);
            if (followersList) {
                followersList.push(user.uid);
                const data = {
                    followers: followersList,
                };
                setDoc(followersRef, data, { merge: true })
                    .then(() => {
                        console.log('Followers added successfully in: ', followersList);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                return true;
            }
        }
    }
}
