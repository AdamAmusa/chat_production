import { collection, query, where, getDoc, getDocs, doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { db } from './firebaseConfig';
import { AuthContext } from './context';
import { setUserInbox } from './Authentication';


export const handleSearch = async (user, email) => {
    console.log("Searching for user with email:", email);
    const usersRef = query(
        collection(db, "users"),
        where("email", "==", email),
        where("uid", "!=", user)
    );
    try {
        const querySnapshot = await getDocs(usersRef);
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]; 
            console.log("User found:", userDoc.data());
            return userDoc.data(); 
        } else {
            return null; 
        }
    } catch (e) {
        console.error("Search error:", e);
        return null;
    }
};


export const acceptUser = async (currentUser, user) => {
    console.log("Accepting user:", user);
    setUserInbox({ displayName: user.displayName, email: user.email, id: user.id }, currentUser.uid, "accepted")

    const combinedID = currentUser.uid > user.id
        ? currentUser.uid + user.id
        : user.id + currentUser.id;

    console.log("user id:", currentUser.uid);
    console.log("receiver id:", user.id);
    try {
        const res = await getDoc(doc(db, "messages", combinedID));

        if (!res.exists()) {
            await setDoc(doc(db, "messages", combinedID), { messages: [] });

            const currentUserChatsDoc = await getDoc(doc(db, "userChats", currentUser.uid));
            
            if (!currentUserChatsDoc.exists()) {
                await setDoc(doc(db, "userChats", currentUser.uid), {});
            }

            console.log("Creating new chat for user:", currentUser.uid);
            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [combinedID + ".userInfo"]: {
                    uid: user.id,
                    displayName: user.displayName,
                    photoUrl: null
                },
                [combinedID + ".date"]: serverTimestamp()
            });

            await updateDoc(doc(db, "userChats", user.id), {
                [combinedID + ".userInfo"]: {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    photoUrl: null
                },
                [combinedID + ".date"]: serverTimestamp()
            });
        }
    } catch (e) {
        console.error("Error in handleSelect:", e);
    }
};
const Search = () => {

    return (
        <div></div>
    )
}

export default Search;