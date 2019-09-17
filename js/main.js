let url;
let mapsKey;

$.ajax({
	url: `config.json`,
	type: `GET`,
	dataType: 'json',
	error: (err)=> {
		console.log(`There was an issue getting the config file`);
		console.log(err);
	},
	success: (result)=> {
		url = `${result.SERVER_URL}:${result.SERVER_PORT}`;
		mapsKey = result.GOOGLE_MAPS_KEY;
	}
});

$(`#loginForm`).submit(()=> {
	event.preventDefault();
	let loginUsername = $(`#loginUsername`).val();
	let loginPassword = $(`#loginPassword`).val();

	if (loginUsername.length !== 0 && loginPassword.length !== 0) {
		$.ajax({
			url: `${url}/login`,
			type: `POST`,
			data: {
				username: loginUsername,
				password: loginPassword
			},
			error: (err)=> {
				console.log(`Error logging in`);
				console.log(err);
			},
			success: (result)=> {
				sessionStorage.userId = result._id;
				sessionStorage.username = result.username;
				sessionStorage.name = result.name;
				sessionStorage.email = result.email;
				sessionStorage.address = result.address;
			}
		});
	} else {
		console.log('You have not filled in all the login inputs');
	}
});

