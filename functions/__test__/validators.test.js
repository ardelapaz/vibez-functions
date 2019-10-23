const validators = require('../utility/validators');

describe('Validators test', () => {
	describe('Helper functions tests', () => {
		it('Tests if a string is empty', () => {
			const data = '';
			const output = validators.isEmpty(data);
			expect(output).toBe(true);
		});
		it('Tests if a string is not empty', () => {
			const data = 'Random string of data1431...';
			const output = validators.isEmpty(data);
			expect(output).toBe(false);
		});
		it('Tests if email is valid', () => {
			const data = 'address@anyending.net';
			const output = validators.isEmail(data);
			expect(output).toBe(true);
		});
		it('Tests if email is invalid', () => {
			const data = 'invalid.email@com';
			const output = validators.isEmpty(data);
			expect(output).toBe(false);
		});
	});
	describe('Validate signup data', () => {
		let signupData = {
			email: 'address@anyending.net',
			password: 'inv',
			confirmPassword: 'alid',
			handle: 'username',
			firstName: 'John',
			lastName: 'Doe'
		};
		beforeEach(() => {
			signupData = {
				email: 'address@anyending.net',
				password: 'inv',
				confirmPassword: 'alid',
				handle: 'username',
				firstName: 'John',
				lastName: 'Doe'
			};
		});
		it('Tests for empty email', () => {
			signupData.email = '';
			const output = validators.validateSignupData(signupData);
			expect(output.errors.email).toEqual('Must not be empty');
		});
		it('Tests for valid email', () => {
			signupData.email = 'in--valid.com$email.address';
			const output = validators.validateSignupData(signupData);
			expect(output.errors.email).toEqual('Must be a valid email address');
		});
		it('Tests for empty password', () => {
			signupData.password = '';
			const output = validators.validateSignupData(signupData);
			expect(output.errors.password).toEqual('Must be at least 6 characters');
		});
		it('Tests if password is at least 6 characters', () => {
			signupData.password = 'passw';
			const output = validators.validateSignupData(signupData);
			expect(output.errors.password).toEqual('Must be at least 6 characters');
		});
		it('Tests if password and confirm password match', () => {
			const output = validators.validateSignupData(signupData);
			expect(output.errors.confirmPassword).toEqual('Passwords must match');
		});
		it('Tests for empty username', () => {
			signupData.handle = '';
			const output = validators.validateSignupData(signupData);
			expect(output.errors.handle).toEqual('Must not be empty');
		});
		it('Tests for empty first name', () => {
			signupData.firstName = '';
			const output = validators.validateSignupData(signupData);
			expect(output.errors.firstName).toEqual('Must not be empty');
		});
		it('Tests for empty last name', () => {
			signupData.lastName = '';
			const output = validators.validateSignupData(signupData);
			expect(output.errors.lastName).toEqual('Must not be empty');
		});
		it('Considers all signup data valid', () => {
			signupData.password = 'password';
			signupData.confirmPassword = 'password';
			const output = validators.validateSignupData(signupData);
			expect(output.valid).toEqual(true);
		});
	});
	describe('Validate login data', () => {
		let loginData = {
			email: 'address@email.com',
			password: 'password'
		};
		beforeEach(() => {
			loginData = {
				email: 'address@email.com',
				password: 'password'
			};
		});
		it('Tests for empty email', () => {
			loginData.email = '';
			const output = validators.validateLoginData(loginData);
			expect(output.errors.email).toEqual('Must not be empty');
		});
		it('Tests for empty password', () => {
			loginData.password = '';
			const output = validators.validateLoginData(loginData);
			expect(output.errors.password).toEqual('Must not be empty');
		});
		it('Considers login data valid', () => {
			const output = validators.validateLoginData(loginData);
			expect(output.valid).toEqual(true);
		});
	});
	describe('Reduce user details', () => {
		let userDetails = {
			bio:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
			soundcloud: 'https://soundcloud.com/kanyewest',
			location: 'Los Angeles, CA'
		};
		beforeEach(() => {
			userDetails = {
				bio:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
				soundcloud: 'https://soundcloud.com/kanyewest',
				location: 'Los Angeles, CA'
			};
		});
		it('Tests for empty bio', () => {
			// Users aren't required to have this filled out
			userDetails.bio = '';
			const output = validators.reduceUserDetails(userDetails);
			expect(output.bio).toEqual('');
		});
		it('Tests for empty soundcloud', () => {
			// Users aren't required to have this filled out
			userDetails.soundcloud = '';
			const output = validators.reduceUserDetails(userDetails);
			expect(output.soundcloud).toEqual('Website not available');
		});
		it('Tests for empty location', () => {
			// Users aren't required to have this filled out
			userDetails.location = '';
			const output = validators.reduceUserDetails(userDetails);
			expect(output.location).toEqual('Location not available');
		});
		it('Correctly sets soundcloud link', () => {
			userDetails.soundcloud = 'soundcloud.com/kanyewest     ';
			const output = validators.reduceUserDetails(userDetails);
			expect(output.soundcloud).toEqual('https://soundcloud.com/kanyewest');
		});
		it('Correctly sets all user details', () => {
			const output = validators.reduceUserDetails(userDetails);
			expect(output).toEqual(userDetails);
		});
	});
});
