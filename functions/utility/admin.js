const admin = require('firebase-admin');
const serviceAccount = require('../default-service-key.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://vibe.firebaseio.com',
	storageBucket: 'vibe-32481.appspot.com'
});

const bucket = admin.storage().bucket();

const db = admin.firestore();

module.exports = { admin, db, bucket };
