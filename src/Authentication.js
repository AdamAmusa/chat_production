import { useAuthState } from 'react-firebase-hooks/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { ChatContext } from "./ChatContext";


export const signUpUser = async (email, password, displayName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Get the signed-in user information
        const user = userCredential.user;

        await updateProfile(user, { displayName });

        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            displayName,
            email,
            photoURL: null
        });

        await setDoc(doc(db, 'userChats', user.uid), {});

        // Return success and user info
        return {
            success: true,
            user: user,
        };

    } catch (error) {
        console.log(error.code);
        // Return the error details
        return {
            success: false,
            errorCode: error.code,
            errorMessage: error.message,
        };
    }
};

export const signInUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Get the signed-in user information
        const user = userCredential.user;

        // Return success and user info
        return {
            success: true,
            user: user,
        };

    } catch (error) {
        console.log(error.code);
        // Return the error details
        return {
            success: false,
            errorCode: error.code,
            errorMessage: error.message,
        };
    }
};

export const usesignInGoogle = async () => {

    const provider = new GoogleAuthProvider();
    try {
        // Await the sign-in process
        signInWithPopup(auth, provider);
        console.log("User signed in successfully");

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
    }
}


export const useFetch = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            console.log("redirected" + user);
            navigate("/chatpage")
        } else {
            console.log("No successful sign in");

        }

    }, [user]);
};

export const useSignOut = () => {
    const navigate = useNavigate();
    const {dispatch } = useContext(ChatContext);

    const signOutUser = async () => {
        if (auth.currentUser) {
            await auth.signOut();
            dispatch({ type: 'CLEAR_CHAT'});
            navigate("/login");
        }
    };
    return signOutUser;
}

export const setLastConversation = async (chatId) => {
    try {
        console.log("Setting last conversation for user:", auth.currentUser.uid, "to chatId:", chatId);
        const userRef = doc(db, 'users', auth.currentUser.uid);

        if(chatId.includes(auth.currentUser.uid)){
            await updateDoc(userRef, {
            lastConversation: chatId
        });
        }
        else{
            console.error("Invalid chatId format. It should include the user's UID.");
        }
    } catch (error) {
        console.error("Error setting last conversation:", error);
    }
}

export const getUser = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            console.log("User data:", userSnap.data());
            return userSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export const updateDisplayName = async (newDisplayName) => {
    try {
        const user = auth.currentUser;
        const userRef = doc(db, "users", user.uid);
        if (user) {
            await updateProfile(user, { displayName: newDisplayName });
            await updateDoc(userRef, { displayName: newDisplayName });
            console.log("Display name updated successfully:", newDisplayName);
        } else {
            console.error("No user is currently signed in.");
        }
    } catch (error) {
        console.error("Error updating display name:", error);
    }


}

export const getLastConversation = async () => {
    console.log("Fetching last conversation for user:", auth.currentUser.uid);
    try {
        const userChatsRef = doc(db, "userChats", auth.currentUser.uid);
        const userChatsSnap = await getDoc(userChatsRef);

        const lastConversationRef = doc(db, 'users', auth.currentUser.uid);
        const lastConversationSnap = await getDoc(lastConversationRef);

        const lastConversation = lastConversationSnap.data()?.lastConversation || null;
        if (lastConversation) {
            console.log("Setting last conversation found in user document:", lastConversation);
            return lastConversation;
        }
        else {
            if (userChatsSnap.exists()) {
                const firstchatsData = userChatsSnap.data();
                const firstChatId = Object.keys(firstchatsData)?.[0] || null;
                if (firstChatId) {
                    console.log("Setting last conversation found in userChats document:", firstChatId);
                    setLastConversation(firstChatId);
                    return firstChatId;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching userChats:", error);
        return null;
    }
}

export const isFriend = async (userId, searchId) => {
    if(!userId || !searchId){
        console.error("userId or searchId is null or undefined:", userId, searchId);
        return false;
    }
    try{
        const userChatRef = doc(db, "userChats", userId);
        const userChatSnap = await getDoc(userChatRef);
        const userChatData = userChatSnap.data();        
        
        for(const [chatId, chatData] of Object.entries(userChatData)){
            if(chatData.userInfo?.uid === searchId){
                console.log("User is a friend:", chatId, chatData);
                return true;
            }
        }
        return false;

    }catch (error){
        console.error("Error checking if user is a friend:", error);
        return false;
    }
}


export const setUserInbox = async (sender, receiverId, status) => {
    try {
        const inboxRef = doc(db, "inbox", receiverId);
        const inboxSnap = await getDoc(inboxRef);
        const senderKey = sender.id;
        const senderData = {
            id: sender.id,
            displayName: sender.displayName,
            email: sender.email,
            status: status 
        };

        if (inboxSnap.exists()) {
            const inboxData = inboxSnap.data();
            
            if (inboxData.requests?.[senderKey]) {
                if (inboxData.requests[senderKey].status !== status) {
                    await updateDoc(inboxRef, {
                        [`requests.${senderKey}.status`]: status
                    });
                    console.log(`Friend request status updated to: ${status}`);
                } else {
                    console.log(`Friend request already has status: ${status}`);
                }
                return;
            }

            await updateDoc(inboxRef, {
                [`requests.${senderKey}`]: senderData
            });
            console.log("New friend request added to inbox for user:", receiverId);
        } else {
            await setDoc(inboxRef, {
                requests: {
                    [senderKey]: senderData
                }
            });
            console.log("Inbox created and friend request sent.");
        }
    } catch (error) {
        console.error("Error setting friend request:", error);
    }
};

export const useCheckUserInbox = (userId) => {
    const [requests, setRequests] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const inboxRef = doc(db, "inbox", userId);

        const unsubscribe = onSnapshot(inboxRef, (docSnap) => {
            if (docSnap.exists()) {
                const allRequests = docSnap.data().requests || {};
                const pendingRequests = Object.fromEntries(
                    Object.entries(allRequests).filter(([_, request]) => request.status === "pending")
                );
                setRequests(pendingRequests);
            } else {
                setRequests({});
            }
            setLoading(false);
        }, (err) => {
            console.error("Error fetching inbox:", err);
            setError(err);
            setLoading(false);
        });

        // Cleanup
        return () => unsubscribe();
    }, [userId]);

    return { requests, loading, error };
};



