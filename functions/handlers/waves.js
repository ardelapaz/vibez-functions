const { db } = require('../utility/admin');

// Return all waves

exports.getAllWaves = (req, res) => {
	db.collection('waves')
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let waves = [];
			data.forEach((doc) => {
				waves.push({
					waveId: doc.id,
					...doc.data()
				});
			});
			return res.json(waves);
		})
		.catch((err) => console.error(err));
};

// Create a wave

exports.postWave = (req, res) => {
	if (req.body.body.trim() === '') {
		return res.status(400).json({ body: 'Body must not be empty' });
	}
	const name = `${req.user.firstName} ${req.user.lastName}`;
	const newWave = {
		body: req.body.body,
		userHandle: req.user.handle,
		createdAt: new Date().toISOString(),
		userImage: req.user.imageUrl,
		upvoteCount: 0,
		commentCount: 0,
		userName: name
	};

	db.collection('waves')
		.add(newWave)
		.then((doc) => {
			const resWave = newWave;
			resWave.waveId = doc.id;
			res.json({ resWave });
		})
		.catch((err) => {
			res.status(500).json({ error: 'something went wrong' });
			console.error(err);
		});
};

// Retrieve wave data

exports.getWave = (req, res) => {
	let waveData = {};

	db.doc(`/waves/${req.params.waveId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: 'Whoops! Wave not found.' });
			}
			waveData = doc.data();
			waveData.waveId = doc.id;
			return db
				.collection('comments')
				.orderBy('createdAt', 'desc')
				.where('waveId', '==', req.params.waveId)
				.get();
		})
		.then((data) => {
			waveData.comments = [];
			data.forEach((doc) => {
				waveData.comments.push(doc.data());
			});
			return res.json(waveData);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};

// Comment on wave

exports.commentOnWave = (req, res) => {
	if (req.body.body.trim() === '')
		return res.status(400).json({ comment: 'Must not be empty' });

	const name = `${req.user.firstName} ${req.user.lastName}`;
	const newComment = {
		body: req.body.body,
		userHandle: req.user.handle,
		createdAt: new Date().toISOString(),
		waveId: req.params.waveId,
		userImage: req.user.imageUrl,
		userName: name
	};

	db.doc(`/waves/${req.params.waveId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: 'Wave does not exist! ' });
			}
			return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
		})
		.then(() => {
			return db.collection('comments').add(newComment);
		})
		.then(() => {
			res.json(newComment);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'Something went wrong!' });
		});
};

// Upvote a wave

exports.upvoteWave = (req, res) => {
	const upvoteDocument = db
		.collection('upvotes')
		.where('userHandle', '==', req.user.handle)
		.where('waveId', '==', req.params.waveId)
		.limit(1);

	const waveDocument = db.doc(`/waves/${req.params.waveId}`);
	let waveData;

	waveDocument
		.get()
		.then((doc) => {
			if (doc.exists) {
				waveData = doc.data();
				waveData.waveId = doc.id;
				return upvoteDocument.get();
			} else {
				return res.status(404).json({ error: 'Wave not found!' });
			}
		})
		.then((data) => {
			if (data.empty) {
				return db
					.collection('upvotes')
					.add({
						waveId: req.params.waveId,
						userHandle: req.user.handle
					})
					.then(() => {
						waveData.upvoteCount++;
						return waveDocument.update({ upvoteCount: waveData.upvoteCount });
					})
					.then(() => {
						return res.json(waveData);
					});
			} else {
				return res.status(400).json({ error: 'Wave already upvoted' });
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};

// Remove upvote on a wave

exports.unupvoteWave = (req, res) => {
	const upvoteDocument = db
		.collection('upvotes')
		.where('userHandle', '==', req.user.handle)
		.where('waveId', '==', req.params.waveId)
		.limit(1);

	const waveDocument = db.doc(`/waves/${req.params.waveId}`);
	let waveData;

	waveDocument
		.get()
		.then((doc) => {
			if (doc.exists) {
				waveData = doc.data();
				waveData.waveId = doc.id;
				return upvoteDocument.get();
			} else {
				return res.status(404).json({ error: 'Wave not found!' });
			}
		})
		.then((data) => {
			if (data.empty) {
				return res.status(400).json({ error: 'Wave not upvoted! ' });
			} else {
				return db
					.doc(`/upvotes/${data.docs[0].id}`)
					.delete()
					.then(() => {
						waveData.upvoteCount--;
						return waveDocument.update({ upvoteCount: waveData.upvoteCount });
					})
					.then(() => {
						res.json(waveData);
					});
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};

// Delete a wave

exports.deleteWave = (req, res) => {
	const document = db.doc(`/waves/${req.params.waveId}`);
	document
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: 'Wave not found' });
			}
			if (doc.data().userHandle !== req.user.handle) {
				return res.status(403).json({ error: 'Unauthorized' });
			} else {
				return document.delete();
			}
		})
		.then(() => {
			res.json({ message: 'Wave deleted successfully!' });
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};
