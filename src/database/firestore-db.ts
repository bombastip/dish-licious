import 'firebase/compat/firestore';
import { db } from '../config/firebase-config';
import {
    doc,
    setDoc,
    getDoc,
    query,
    where,
    getDocs,
    collection,
    updateDoc,
    arrayUnion,
    deleteDoc,
} from 'firebase/firestore';
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

export const getUsernamePhotos = async (uid: string) => {
    const userdocRef = doc(db, 'users', uid);
    const docUserSnap = await getDoc(userdocRef);
    if (!docUserSnap.exists()) {
        return { photoURL: '', username: '' };
    }
    const photoURL = docUserSnap.data().photoURL as string;
    const username = docUserSnap.data().username as string;
    return { photoURL, username };
};

export const addComment = async (postId: string, comment: string, uid: string) => {
    const userDocRef = doc(db, 'posts', postId);
    try {
        await updateDoc(userDocRef, {
            comments: arrayUnion({ comment: comment, uid: uid }),
        });
    } catch (err) {
        console.error(err);
    }
};

export const changeUsername = async (uid: string, newUsername: string) => {
    const docRef = doc(db, 'users', uid);
    try {
        await setDoc(docRef, { username: newUsername }, { merge: true });
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

// add followNotif to user's followNotif array in firestore in users collection
export async function addNotification(wantToFollow: string, user: string) {
    const followNotifRef = doc(db, 'users', wantToFollow);
    const followNotifList = await getFollowNotif(wantToFollow);
    if (followNotifList) {
        console.log('foloooow:', followNotifList);
        if (!followNotifList.includes(user)) {
            followNotifList.push(user);
            const data = {
                followNotif: followNotifList,
            };
            setDoc(followNotifRef, data, { merge: true })
                .then(() => {
                    console.log('FollowNotif added successfully in followNotifList: ', followNotifList);
                })
                .catch(error => {
                    console.log(error);
                });
            return true;
        }
    }
}

// remove followNotif from user's followNotif array in firestore in users collection
export async function removeNotification(user: string, wantToRemove: string) {
    const followNotifRef = doc(db, 'users', user);
    const followNotifList = await getFollowNotif(user);
    if (followNotifList) {
        if (followNotifList.includes(wantToRemove)) {
            const updatedList = followNotifList.filter((element: string) => element !== wantToRemove);
            const data = {
                followNotif: updatedList,
            };

            setDoc(followNotifRef, data, { merge: true })
                .then(() => {
                    console.log('FollowNotif removed successfully from followNotifList: ', wantToRemove);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
}

export async function deletePost(post: string) {
    const postRef = doc(db, 'posts', post);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
        console.log('Document data from deletePost:', postSnap.data());
        const userRef = doc(db, 'users', postSnap.data().userID);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const updatedList = userSnap.data().posts.filter((element: string) => element !== post);
            const favoritesList = userSnap.data().favourites.filter((element: string) => element !== post);
            const data = {
                posts: updatedList,
                favourites: favoritesList,
            };
            setDoc(userRef, data, { merge: true })
                .then(() => {
                    console.log('Post removed successfully from postsList and favoritesList: ', post);
                })
                .catch(error => {
                    console.log(error);
                });
            const userCollectionRef = collection(db, 'users');
            const q = query(userCollectionRef, where('favourites', 'array-contains', post));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async user => {
                const docRef = doc(db, 'users', user.id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const updatedList = docSnap.data().favourites.filter((element: string) => element !== post);
                    const data = {
                        favourites: updatedList,
                    };
                    setDoc(docRef, data, { merge: true })
                        .then(() => {
                            console.log('Post removed successfully from favouritesList: ', post);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    console.log('No user document!');
                }
            });
            await deleteDoc(postRef);
            console.log('Post deleted successfully: ', post);
        } else {
            console.log('No user document!');
        }
    } else {
        console.log('No post document!');
    }
}

// add followUser to user's following array in firestore in users collection
export async function follow(wantToFollow: string, user: string) {
    const followRef = doc(db, 'users', user);
    const followingList = await getFollowing(user);
    if (followingList) {
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
            }
        }
        addNotification(wantToFollow, user);
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
        removeNotification(wantToUnfollow, user);
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
