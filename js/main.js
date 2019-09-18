let url;
let mapsKey;

$.ajax({
	url: `config.json`,
	type: `GET`,
	dataType: `json`,
	error: (err)=> {
		console.log(`There was an issue getting the config file`);
		console.log(err);
	},
	success: (result)=> {
		url = `${result.SERVER_URL}:${result.SERVER_PORT}`;
		mapsKey = result.GOOGLE_MAPS_KEY;
	}
});

$(`#registerForm`).click(()=> {
    event.preventDefault();
    const registerName = $(`#registerName`).val();
    const registerAddress = $(`#registerAddress`).val();
    const registerUsername = $(`#registerUsername`).val();
    const registerPassword = $(`#registerPassword`).val();
    const registerConfirmPassword = $(`#registerConfirmPassword`).val();
    const registerEmail = $(`#registerEmail`).val();
    const registerDOB = $(`#registerDOB`).val();
    if (registerName.length === 0) {
        console.log(`please enter a name for register`);
    } else if (registerAddress.length === 0) {
        console.log(`please enter an address for register`);
    } else if (registerUsername.length === 0) {
        console.log(`please enter a username for register`);
    } else if (registerPassword.length === 0) {
        console.log(`please enter a password for register`);
    } else if (registerConfirmPassword.length === 0) {
        console.log(`please confirm password`);
    } else if (registerPassword !== registerConfirmPassword) {
        console.log(`password does not match`);
    } else if (registerEmail.length === 0) {
        console.log(`please enter an email for register`);
    } else if (registerDOB.length === 0) {
        console.log(`please enter a date of birth for register`);
    } else{
        $.ajax({
            url: `${url}/registerUser`,
            type: `POST`,
            data: {
                name: registerName,
                address: registerAddress,
                username: registerUsername,
                password: registerPassword,
                email: registerEmail,
                dob: registerDOB,
                registerDate: Date.now()
            },
            success: (result)=> {
                console.log(result);
            },
            error: (err)=> {
                console.log(err);
                console.log(`something went wrong`);
            }
        });
    }
});

$(`#listingForm`).click(() => {
    event.preventDefault();
    const listingTitle = $(`#listingTitle`).val();
    const listingDescription = $(`#listingDescription`).val();
    const listingPrice = $(`#listingPrice`).val();
    if (listingTitle.length === 0) {
        console.log(`listing title needs an input`);
    } else if (listingDescription.length === 0) {
        console.log(`listing description needs an input`);
    } else if (listingPrice.length === 0) {
        console.log(`listing price needs an input`);
    } else {
        let fd = new FormData();
        const file = $(`#listingImageFile`)[0].files[0];
        fd.append(`filePath`, file);
        fd.append(`originalName`, file.name);
        fd.append(`title`, listingTitle);
        fd.append(`description`, listingDescription);
        fd.append(`price`, listingPrice);

        console.log(fd);

        $.ajax({
            url: `${url}/newListing`,
            method: `POST`,
            data: fd,
            contentType: false,
            processData: false,
            success: (data)=> {
                console.log(`successful`);
            },
            error: (err)=> {
                console.log(err);
                console.log(`did not work`);
            }
        });
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
                console.log(result);
				sessionStorage.userId = result._id;
				sessionStorage.username = result.username;
				sessionStorage.name = result.name;
				sessionStorage.email = result.email;
				sessionStorage.address = result.address;
			}
		});
	} else {
		console.log(`You have not filled in all the login inputs`);
	}
});

$(`#logoutBtn`).click(()=> {
	sessionStorage.clear();
});
