import admin from 'firebase-admin';
import serviceAccount from './chat-e48d2-firebase-adminsdk-ft2h1-5efe1bf6d2.json' assert { type: 'json' };


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const adminAuth = admin.auth();

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    const token = authHeader.split('Bearer ')[1];
  
    try {
      // Use adminAuth instead of getAuth
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }


export const db = admin.firestore();
export { adminAuth, verifyToken };