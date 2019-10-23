exports.validateSignupData = (newUser) => {
	let errors = {};

	if (isEmpty(newUser.email)) {
		errors.email = 'Must not be empty';
	} else if (!isEmail(newUser.email)) {
		errors.email = 'Must be a valid email address';
	}

	if (isEmpty(newUser.password)) errors.password = 'Must not be empty';
	if (newUser.password != newUser.confirmPassword)
		errors.confirmPassword = 'Passwords must match';
	if (newUser.password.length < 6)
		errors.password = 'Must be at least 6 characters';
	if (isEmpty(newUser.handle)) errors.handle = 'Must not be empty';
	if (isEmpty(newUser.firstName)) errors.firstName = 'Must not be empty';
	if (isEmpty(newUser.lastName)) errors.lastName = 'Must not be empty';

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	};
};

exports.validateLoginData = (user) => {
	let errors = {};

	if (isEmpty(user.email)) errors.email = 'Must not be empty';
	if (isEmpty(user.password)) errors.password = 'Must not be empty';

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	};
};

exports.reduceUserDetails = (data) => {
	let userDetails = {};

	if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
	else userDetails.bio = '';
	if (!isEmpty(data.soundcloud.trim())) {
		if (data.soundcloud.trim().substring(0, 4) !== 'http') {
			userDetails.soundcloud = `https://${data.soundcloud.trim()}`;
		} else userDetails.soundcloud = data.soundcloud;
	} else userDetails.soundcloud = 'Website not available';
	if (!isEmpty(data.location.trim())) userDetails.location = data.location;
	else userDetails.location = 'Location not available';

	return userDetails;
};

// Helper Functions

// Testing helper functions
exports.isEmail = (email) => {
	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.match(regEx)) return true;
	else return false;
};

exports.isEmpty = (string) => {
	if (string.trim() === '') return true;
	else return false;
};

const isEmail = (email) => {
	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.match(regEx)) return true;
	else return false;
};

const isEmpty = (string) => {
	if (string.trim() === '') return true;
	else return false;
};
