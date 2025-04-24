import { db } from './FirebaseAdmin.js';
import { adminAuth } from './FirebaseAdmin.js';
import admin from 'firebase-admin';
const { Timestamp } = admin.firestore;


export const uploadImagetoMessages = async (url, sender, id, chatId) => {
    try {
        const imagesCollectionRef = db.collection('messages').doc(chatId);
        
        await imagesCollectionRef.update({
            images: admin.firestore.FieldValue.arrayUnion({
                date: Timestamp.now(),
                id: id,
                image_url: url,
                senderId: sender,
            })
        }),{ merge: true };;
        
              
        console.log('Image metadata successfully added to the images subcollection!');
    } catch (error) {
        console.error('Error adding document to the images subcollection: ', error);
    }
}

export const uploadImagetoProfile = async (url, id) => {
    try {
        const userRef = db.collection('users').doc(id); 
        await userRef.update({ photoURL: url });
        
        await adminAuth.updateUser(id, {
            photoURL: url
          });
        console.log('Image metadata successfully added to the images subcollection!');
    } catch (error) {
        console.error('Error adding document to the images subcollection: ', error);
    }
}