import 'firebase/compat/firestore';
import { db } from '../config/firebase-config';
import {
    doc,
    setDoc,
    getDoc,
    addDoc,
    query,
    where,
    getDocs,
    collection,
    updateDoc,
    arrayUnion,
    deleteDoc,
} from 'firebase/firestore';
import { User, PostType, groupNotif } from '../interfaces';

export async function createUserCollection(user: User, username: string) {
    const docRef = doc(db, 'users', user.uid);
    const data = {
        id: user.uid,
        username: username,
        photoURL: 'https://icon-library.com/images/2693a2979d_91160.png',
        following: [],
        followers: [],
        followNotif: [],
        groupNotif: [] as groupNotif[],
        posts: [],
        favourites: [],
        feed: [],
        groups: [],
    };
    setDoc(docRef, data)
        .then()
        .catch(error => {
            console.log(error);
        });
}

export async function createGroup(uid: string, groupName: string, description: string, photoURL: string) {
    const GroupCollectionRef = collection(db, 'groups');
    const newGroupRef = await addDoc(GroupCollectionRef, {
        name: groupName,
        photo: photoURL,
        description: description,
        admin: uid,
        members: [uid],
        feed: [],
    });
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
        groups: arrayUnion(newGroupRef.id),
    });
}

export async function getUserData(uid: string) {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return false;
    }
}

export async function getGroupData(groupId: string) {
    if (groupId === '') {
        return false;
    }
    const docRef = doc(db, 'groups', groupId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
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

export async function checkGroupName(groupName: string) {
    const q = query(collection(db, 'groups'), where('name', '==', groupName));

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

export const getGroupMembers = async (groupId: string) => {
    console.log('groupID: ', groupId);
    const groupDocRef = doc(db, 'groups', groupId);
    const docGroupSnap = await getDoc(groupDocRef);
    if (!docGroupSnap.exists()) {
        return [];
    }
    const members = docGroupSnap.data().members;
    return members;
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

export const addGroupMember = async (groupId: string, uid: string) => {
    const groupDocRef = doc(db, 'groups', groupId);
    try {
        await updateDoc(groupDocRef, {
            members: arrayUnion(uid),
        });
    } catch (err) {
        console.error(err);
    }
    const userDocRef = doc(db, 'users', uid);
    try {
        await updateDoc(userDocRef, {
            groups: arrayUnion(groupId),
        });
    } catch (err) {
        console.error(err);
    }
};

export const removeGroupMember = async (groupId: string, uid: string) => {
    const GroupRef = doc(db, 'groups', groupId);
    const memberList = await getGroupMembers(groupId);
    if (memberList) {
        if (memberList.includes(uid)) {
            const updatedList = memberList.filter((element: string) => element !== uid);
            const data = {
                members: updatedList,
            };

            setDoc(GroupRef, data, { merge: true })
                .then()
                .catch(error => {
                    console.log(error);
                });
        }
    }
    const userDocRef = doc(db, 'users', uid);
    const groupList = await getGroups(uid);
    console.log(groupList);
    if (groupList) {
        if (groupList.includes(groupId)) {
            const updatedList = groupList.filter((element: string) => element !== groupId);
            const data = {
                groups: updatedList,
            };

            setDoc(userDocRef, data, { merge: true })
                .then()
                .catch(error => {
                    console.log(error);
                });
        }
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

export const changeGroupName = async (groupId: string, newGroupName: string) => {
    const docRef = doc(db, 'groups', groupId);
    try {
        await setDoc(docRef, { name: newGroupName }, { merge: true });
    } catch (error: unknown) {
        throw new Error(`Error changing group name: ${error}`);
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

export const changeGroupPhoto = async (groupId: string, newPhoto: string) => {
    const docRef = doc(db, 'groups', groupId);
    try {
        await setDoc(docRef, { photo: newPhoto }, { merge: true });
    } catch (error: unknown) {
        throw new Error(`Error changing group photoURL: ${error}`);
    }
};

export const changeGroupDescription = async (groupId: string, newDescription: string) => {
    const docRef = doc(db, 'groups', groupId);
    try {
        await setDoc(docRef, { description: newDescription }, { merge: true });
    } catch (error: unknown) {
        throw new Error(`Error changing group description: ${error}`);
    }
};

export const getGroups = async (uid: string) => {
    const userDocRef = doc(db, 'users', uid);
    const docUserSnap = await getDoc(userDocRef);
    if (!docUserSnap.exists()) {
        return [];
    }
    const groups = docUserSnap.data().groups as string[];
    return groups;
};

// function to get following array from firestore users collection
export async function getFollowing(id: string) {
    const followRef = doc(db, 'users', id);
    const docSnap = await getDoc(followRef);
    if (docSnap.exists()) {
        return docSnap.data().following;
    } else {
        return null;
    }
}

// function to get followers array from firestore users collection
export async function getFollowers(id: string) {
    const followRef = doc(db, 'users', id);
    const docSnap = await getDoc(followRef);
    if (docSnap.exists()) {
        return docSnap.data().followers;
    } else {
        // doc.data() will be undefined in this case
        return false;
    }
}

// function to get followNotif array from firestore users collection
export async function getFollowNotif(id: string) {
    const followNotifRef = doc(db, 'users', id);
    const docSnap = await getDoc(followNotifRef);
    if (docSnap.exists()) {
        return docSnap.data().followNotif;
    } else {
        return false;
    }
}

export async function getGroupNotif(id: string) {
    const groupNotifRef = doc(db, 'users', id);
    const docSnap = await getDoc(groupNotifRef);
    if (docSnap.exists()) {
        return docSnap.data().groupNotif;
    } else {
        return [];
    }
}

// add followNotif to user's followNotif array in firestore in users collection
export async function addNotification(wantToFollow: string, user: string) {
    const followNotifRef = doc(db, 'users', wantToFollow);
    const followNotifList = await getFollowNotif(wantToFollow);
    if (followNotifList) {
        if (!followNotifList.includes(user)) {
            followNotifList.push(user);
            const data = {
                followNotif: followNotifList,
            };
            setDoc(followNotifRef, data, { merge: true })
                .then()
                .catch(error => {
                    console.log(error);
                });
            return true;
        }
    }
    return false;
}

// groupNotif is a map with userID as key and groupID as value
export async function addGroupNotif(userID: string, groupID: string, groupAdmin: string) {
    const groupNotifRef = doc(db, 'users', groupAdmin);
    const groupNotifList = await getGroupNotif(groupAdmin);
    if (groupNotifList) {
        console.log(groupNotifList);
        try {
            await updateDoc(groupNotifRef, {
                groupNotif: arrayUnion({ userID: userID, groupID: groupID }),
            });
            return true;
        } catch (err) {
            console.error(err);
            return false;
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
                .then()
                .catch(error => {
                    console.log(error);
                });
        }
    }
}

export async function removeGroupNotif(userID: string, groupID: string, groupAdmin: string) {
    const groupNotifRef = doc(db, 'users', groupAdmin);
    const groupNotifList = await getGroupNotif(groupAdmin);
    if (groupNotifList) {
        const updatedList = groupNotifList.filter(
            (element: { userID: string; groupID: string }) => element.userID !== userID && element.groupID !== groupID,
        );
        const data = {
            groupNotif: updatedList,
        };
        setDoc(groupNotifRef, data, { merge: true })
            .then()
            .catch(error => {
                console.log(error);
            });
    }
}

export async function isRequestSent(groupID: string, userID: string, groupAdmin: string) {
    const getNotifList = await getGroupNotif(groupAdmin);
    if (getNotifList) {
        const isSent = getNotifList.some(
            (element: { userID: string; groupID: string }) => element.userID === userID && element.groupID === groupID,
        );
        return isSent;
    }
}

export async function deletePost(post: string) {
    const postRef = doc(db, 'posts', post);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
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
                .then()
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
                        .then()
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    console.log('No user document!');
                }
            });
            await deleteDoc(postRef);
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
            return false;
        } else {
            followingList.push(wantToFollow);
            const data = {
                following: followingList,
            };
            setDoc(followRef, data, { merge: true })
                .then()
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
                    .then()
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
            .then()
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
                .then()
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
        return false;
    }
    if (
        followingList.some((element: string) => {
            return element === wantToFollow;
        })
    ) {
        return true;
    }
    return false;
}

export async function getPostData(postId: string) {
    const docRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as PostType;
    } else {
        return false;
    }
}

export async function getPostId(post: PostType) {
    const postsRef = collection(db, 'posts');
    const querySnapshot = await getDocs(postsRef);

    let postId = '';
    querySnapshot.forEach(doc => {
        const postFromDb = doc.data() as PostType;
        if (postFromDb.title === post.title && postFromDb.userID === post.userID) {
            postId = doc.id;
        }
    });
    return postId;
}

export async function updatePost(postId: string, post: PostType) {
    const docRef = doc(db, 'posts', postId);
    try {
        await setDoc(docRef, post, { merge: true });
    } catch (error: unknown) {
        throw new Error(`Error updating post: ${error}`);
    }
}

export async function filterPostsByIngredients(ingredients: string[]) {
    const postsRef = collection(db, 'posts');
    const querySnapshot = await getDocs(postsRef);

    const posts: PostType[] = [];
    querySnapshot.forEach(doc => {
        const post = doc.data() as PostType;
        post.id = doc.id;
        const postIngredients = post.ingredients.map(ingredient => ingredient.name.toLowerCase());

        if (postIngredients.every(ingredient => ingredients.includes(ingredient.toLowerCase()))) {
            posts.push(post);
        }
    });

    return posts;
}

export async function filterPostsByTitle(title: string) {
    const postsRef = collection(db, 'posts');
    const querySnapshot = await getDocs(postsRef);

    const posts: PostType[] = [];
    querySnapshot.forEach(doc => {
        const post = doc.data() as PostType;
        post.id = doc.id;
        if (post.title.toLowerCase() === title.toLowerCase()) {
            posts.push(post);
        }
    });

    return posts;
}

export async function filterPostsByTime(time: number, unit: string) {
    if (unit == 'h') {
        time = time * 60;
    }
    const postsRef = collection(db, 'posts');
    const querySnapshot = await getDocs(postsRef);

    const posts: PostType[] = [];
    querySnapshot.forEach(doc => {
        const post = doc.data() as PostType;
        post.id = doc.id;
        if (post.timeUnit === 'h') {
            if (post.timeCost * 60 <= time) {
                posts.push(post);
            }
        } else {
            if (post.timeCost <= time) {
                posts.push(post);
            }
        }
    });
    return posts;
}

export async function getFollowingPosts(uid: string) {
    const followingList = await getFollowing(uid);
    if (followingList) {
        const postsRef = collection(db, 'posts');
        const querySnapshot = await getDocs(postsRef);

        const posts: PostType[] = [];
        querySnapshot.forEach(doc => {
            const post = doc.data() as PostType;
            post.id = doc.id;
            if (followingList.includes(post.userID)) {
                posts.push(post);
            }
        });
        return posts;
    }
}
