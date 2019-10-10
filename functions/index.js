const app = require('express')();
const FBAuth = require('./utility/FBAuth');
const functions = require('firebase-functions');
const { db } = require('./utility/admin');

const {
	getAllWaves,
	postWave,
	getWave,
	commentOnWave,
	upvoteWave,
	unupvoteWave,
	deleteWave
} = require('./handlers/waves');
const {
	signUp,
	login,
	uploadImage,
	addUserDetails,
	getAuthUser,
	getUserDetails,
	markNotificationsRead
} = require('./handlers/users');

// Wave Routes
app.get('/waves', getAllWaves);
app.post('/wave', FBAuth, postWave);
app.get('/wave/:waveId', getWave);
app.delete('/wave/:waveId', FBAuth, deleteWave);
app.get('/wave/:waveId/upvote', FBAuth, upvoteWave);
app.get('/wave/:waveId/unupvote', FBAuth, unupvoteWave);
app.post('/wave/:waveId/comment', FBAuth, commentOnWave);

// User Routes
app.post('/signup', signUp);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnUpvote = functions.firestore
	.document('upvotes/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/waves/${snapshot.data().waveId}`)
			.get()
			.then((doc) => {
				if (
					doc.exists &&
					doc.data().userHandle !== snapshot.data().userHandle
				) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'upvote',
						read: false,
						waveId: doc.id
					});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	});

exports.createNotificationOnComment = functions.firestore
	.document('comments/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/waves/${snapshot.data().waveId}`)
			.get()
			.then((doc) => {
				if (
					doc.exists &&
					doc.data().userHandle !== snapshot.data().userHandle
				) {
					console.log('test');
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'comment',
						read: false,
						waveId: doc.id
					});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	});

exports.deleteNotificationOnUnUpvote = functions.firestore
	.document('upvotes/{id}')
	.onDelete((snapshot) => {
		return db
			.doc(`/notifications/${snapshot.id}`)
			.delete()
			.catch((err) => {
				console.error(err);
				return;
			});
	});

// Update all user's images

exports.onUserImageChange = functions.firestore
	.document('/users/{userid}')
	.onUpdate((change) => {
		if (change.before.data().imageUrl !== change.after.data().imageUrl) {
			const batch = db.batch();
			return db
				.collection('waves')
				.where('userHandle', '==', change.before.data().handle)
				.get()
				.then((data) => {
					data.forEach((doc) => {
						const wave = db.doc(`/waves/${doc.id}`);
						batch.update(wave, { userImage: change.after.data().imageUrl });
					});
					return db
						.collection('comments')
						.where('userHandle', '==', change.before.data().handle)
						.get();
				})
				.then((data) => {
					data.forEach((doc) => {
						const comment = db.doc(`/comments/${doc.id}`);
						batch.update(comment, { userImage: change.after.data().imageUrl });
					});
					return batch.commit();
				})
				.catch((err) => console.error(err));
		} else return true;
	});

// Delete all associated data with wave

exports.onWaveDelete = functions.firestore
	.document('/waves/{waveId}')
	.onDelete((snapshot, context) => {
		const waveId = context.params.waveId;
		const batch = db.batch();
		return db
			.collection('comments')
			.where('waveId', '==', waveId)
			.get()
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/comments/${doc.id}`));
				});
				return db
					.collection('upvotes')
					.where('waveId', '==', waveId)
					.get();
			})
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/upvotes/${doc.id}`));
				});
				return db
					.collection('notifications')
					.where('waveId', '==', waveId)
					.get();
			})
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/notifications/${doc.id}`));
				});
				return batch.commit();
			})
			.catch((err) => console.error(err));
	});
