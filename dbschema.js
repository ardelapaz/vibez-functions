let db = {
	users: [
		{
			userId: 'fjk2htlkj2nklgs',
			email: 'user@address.com',
			handle: 'username',
			createdAt: '2019-09-23T10:54:25.235Z',
			imageUrl: 'image/1501298510fdklsa',
			bio: 'Example of a user bio here',
			soundcloud: 'https://soundcloud.com/user/username',
			location: 'City, State'
		}
	],
	waves: [
		{
			userHandle: 'user',
			title: 'this is a title',
			body: 'this is a body',
			createdAt: '2019-09-18T05:46:25.644Z',
			upvoteCount: 5,
			commentCount: 3
		}
	],
	comments: [
		{
			userHandle: 'user',
			wavemId: 'kdjsfgdksuufhgkdsufky',
			body: 'nice one mate!',
			createdAt: '2019-03-15T10:59:52.798Z'
		}
	],
	notifications: [
		{
			recipient: 'user',
			sender: 'john',
			read: 'true | false',
			waveId: 'kdjsfgdksuufhgkdsufky',
			type: 'like | comment',
			createdAt: '2019-03-15T10:59:52.798Z'
		}
	]
};

const userDetails = {
	// Redux data
	credentials: {
		userId: 'N43KJ5H43KJHREW4J5H3JWMERHB',
		email: 'user@email.com',
		handle: 'user',
		createdAt: '2019-03-15T10:59:52.798Z',
		imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
		bio: 'Hello, my name is user, nice to meet you',
		website: 'https://user.com',
		location: 'Lonodn, UK'
	},
	likes: [
		{
			userHandle: 'user',
			screamId: 'hh7O5oWfWucVzGbHH2pa'
		},
		{
			userHandle: 'user',
			screamId: '3IOnFoQexRcofs5OhBXO'
		}
	]
};
