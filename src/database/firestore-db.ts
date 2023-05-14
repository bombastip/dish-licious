import 'firebase/compat/firestore';
import { db } from '../config/firebase-config';
import { doc, setDoc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { User } from '../interfaces';

export async function createUserCollection(user: User, username: string) {
    const docRef = doc(db, 'users', user.uid);
    const data = {
        id: user.uid,
        username: username,
        photoURL: 'https://icon-library.com/images/2693a2979d_91160.png',
        following: [],
        followers: [],
        followNotif: [],
        posts: [],
        favourites: [],
        feed: [],
    };
    setDoc(docRef, data)
        .then(() => {
            console.log('User written with ID: ', user.uid);
        })
        .catch(error => {
            console.log(error);
        });
}

export async function getUserData(uid: string) {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // console.log('Document data:', docSnap.data());
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
        return false;
    }
}

export async function checkUsername(username: string) {
    const q = query(collection(db, 'users'), where('username', '==', username));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return true;
    }
    return false;
}

export const changeUsername = async (uid: string, newUsername: string) => {
    const docRef = doc(db, 'users', uid);
    try {
        await setDoc(docRef, { newUsername }, { merge: true });
    } catch (error: unknown) {
        throw new Error(`Error changing username: ${error}`);
    }
};

export const changePhotoURL = async (uid: string, newPhotoUrl: string) => {
    const docRef = doc(db, 'users', uid);
    try {
        await setDoc(docRef, { photoURL: newPhotoUrl }, { merge: true });
    } catch (error: unknown) {
        throw new Error(`Error changing photoURL: ${error}`);
    }
};
// function to get following array from firestore users collection
export async function getFollowing(id: string) {
    const followRef = doc(db, 'users', id);
    const docSnap = await getDoc(followRef);
    if (docSnap.exists()) {
        console.log('Document data from getFollowing:', docSnap.data().following);
        return docSnap.data().following;
    } else {
        console.log('No such document!');
        return null;
    }
}

// function to get followers array from firestore users collection
export async function getFollowers(id: string) {
    const followRef = doc(db, 'users', id);
    const docSnap = await getDoc(followRef);
    if (docSnap.exists()) {
        console.log('Document data from getFollowers:', docSnap.data().followers);
        return docSnap.data().followers;
    } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
        return false;
    }
}

// add followUser to user's following array in firestore in users collection
export async function follow(wantToFollow: string, user: string) {
    const followRef = doc(db, 'users', user);
    const followingList = await getFollowing(user);
    if (followingList) {
        // console.log('Document data:', followingList);
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
                    console.log('Following added successfully in followingList: ', followingList);
                })
                .catch(error => {
                    console.log(error);
                });
            // add user to wantToFollow's followers array in firestore in users collection
            const followersRef = doc(db, 'users', wantToFollow);
            const followersList = await getFollowers(wantToFollow);
            if (followersList) {
                followersList.push(user);
                const data = {
                    followers: followersList,
                };
                setDoc(followersRef, data, { merge: true })
                    .then(() => {
                        console.log('Followers added successfully in followersList: ', followersList);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                return true;
            }
        }
    }
}

// remove followUser from user's following array in firestore in users collection
export async function unfollow(wantToUnfollow: string, user: string) {
    const followRef = doc(db, 'users', user);
    const followingList = await getFollowing(user);
    if (followingList) {
        const updatedList = followingList.filter((element: string) => element !== wantToUnfollow);
        const data = {
            following: updatedList,
        };

        setDoc(followRef, data, { merge: true })
            .then(() => {
                console.log('Following removed successfully from followingList: ', wantToUnfollow);
            })
            .catch(error => {
                console.log(error);
            });

        // remove user from wantToUnfollow's followers array in firestore in users collection
        const followersRef = doc(db, 'users', wantToUnfollow);
        const followersList = await getFollowers(wantToUnfollow);
        if (followersList) {
            const updatedList = followersList.filter((element: string) => element !== user);
            const data = {
                followers: updatedList,
            };
            setDoc(followersRef, data, { merge: true })
                .then(() => {
                    console.log('Followers removed successfully from followersList: ', user);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
}

// function to check if user is following another user
export async function checkFollow(user: string, wantToFollow: string): Promise<boolean> {
    const followingList = await getFollowing(user);
    if (followingList === null) {
        console.log('Document does not exist!');
        return false;
    }
    console.log('Document data from checkFollow:', followingList);
    if (
        followingList.some((element: string) => {
            return element === wantToFollow;
        })
    ) {
        return true;
    }
    return false;
}

// function to get followNotif array from firestore users collection
export async function getFollowNotif(id: string) {
    const followNotifRef = doc(db, 'users', id);
    const docSnap = await getDoc(followNotifRef);
    if (docSnap.exists()) {
        console.log('Document data from getFollowNotif:', docSnap.data().followNotif);
        return docSnap.data().followNotif;
    } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
        return false;
    }
}
