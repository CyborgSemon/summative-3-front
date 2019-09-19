let url;
let mapsKey;

$(document).ready(function(){
	console.log(sessionStorage);
	if(sessionStorage[`username`]){
		console.log(`you are logged in`);
		$(`#registerModalBtn`).addClass(`d-none`);
		$(`#loginModalBtn`).addClass(`d-none`);
    	$(`#logoutBtn`).removeClass(`d-none`);
		$(`#addAListing`).removeClass(`d-none`);
	}
});

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
	let passFail = true;
    const registerName = $(`#registerName`).val();
    const registerAddress = $(`#registerAddress`).val();
    const registerUsername = $(`#registerUsername`).val();
    const registerPassword = $(`#registerPassword`).val();
    const registerConfirmPassword = $(`#registerConfirmPassword`).val();
    const registerEmail = $(`#registerEmail`).val();
    const registerDOB = $(`#registerDOB`).val();
    if (registerName.length === 0) {
        $(`#registerName`).addClass(`is-invalid`);
		passFail = false;
    }
	if (registerAddress.length === 0) {
        $(`#registerAddress`).addClass(`is-invalid`);
		passFail = false;
    }
	if (registerUsername.length === 0) {
        $(`#registerUsername`).addClass(`is-invalid`);
		passFail = false;
    }
	if (registerPassword.length === 0) {
        $(`#registerPassword`).addClass(`is-invalid`);
		passFail = false;
    }
	if (registerConfirmPassword.length === 0) {
        $(`#registerConfirmPassword`).addClass(`is-invalid`);
		passFail = false;
    }
	if (registerPassword !== registerConfirmPassword) {
        $(`#registerConfirmPassword`).addClass(`is-invalid`);
        $(`#registerConfirmPassword`).parent().append(`<div class="invalid-feedback">Passwords do not match</div>`);
		passFail = false;
    }else {
		$(`#registerConfirmPassword`).parent().children().last().remove();
	}
	if (registerEmail.length === 0) {
        $(`#registerEmail`).addClass(`is-invalid`);
		passFail = false;
    }
	if (registerDOB.length === 0) {
        $(`#registerDOB`).addClass(`is-invalid`);
		passFail = false;
    }
	if (passFail) {
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
				sessionStorage.userId = result._id;
				sessionStorage.username = result.username;
				sessionStorage.name = result.name;
				sessionStorage.email = result.email;
				sessionStorage.address = result.address;
				$(`#registerName`).val(null);
			    $(`#registerAddress`).val(null);
			    $(`#registerUsername`).val(null);
			    $(`#registerPassword`).val(null);
			    $(`#registerConfirmPassword`).val(null);
			    $(`#registerEmail`).val(null);
			    $(`#registerDOB`).val(null);
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
        // let fd = new FormData();
        // const file = $(`#listingImageFile`)[0].files[0];
        // fd.append(`filePath`, file);
        // fd.append(`originalName`, file.name);
        // fd.append(`title`, listingTitle);
        // fd.append(`description`, listingDescription);
        // fd.append(`price`, listingPrice);
		//
        // console.log(fd);

        // $.ajax({
        //     url: `${url}/newListing`,
        //     method: `POST`,
        //     data: fd,
        //     contentType: false,
        //     processData: false,
        //     success: (data)=> {
        //         console.log(`successful`);
		// 		$(`#listingTitle`).val(null);
		// 	    $(`#listingDescription`).val(null);
		// 	    $(`#listingPrice`).val(null);
        //     },
        //     error: (err)=> {
        //         console.log(err);
        //         console.log(`did not work`);
        //     }
        // });

		$.ajax({
			url: `${url}/newListing`,
			method: `POST`,
			data: {
				title: listingTitle,
				description: listingDescription,
				price: listingPrice,
				filePath: $(`#fileURL`).val()
			},
			success: (data)=> {
				console.log(`successful`);
				$(`#listingTitle`).val(null);
				$(`#listingDescription`).val(null);
				$(`#listingPrice`).val(null);
				$(`#listingModal`).modal(`hide`);
				$(`.toastListing`).removeClass(`d-none`);
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
				$(`#loginModal`).modal(`hide`);
				$(`#registerModalBtn`).addClass(`d-none`);
				$(`#loginModalBtn`).addClass(`d-none`);
				$(`#logoutBtn`).removeClass(`d-none`);
				$(`#addAListing`).removeClass(`d-none`);
			}
		});
	} else {
		console.log(`You have not filled in all the login inputs`);
	}
});

$(`#logoutBtn`).click(()=> {
	sessionStorage.clear();
	$(`#logoutBtn`).addClass(`d-none`);
	$(`#addAListing`).addClass(`d-none`);
	$(`#registerModalBtn`).removeClass(`d-none`);
	$(`#loginModalBtn`).removeClass(`d-none`);
});

$(`#addComment`).click(()=> {
	event.preventDefault();
	let userComment = $(`#userComment`).val();
	if(userComment.length === 0){
		console.log(`please enter a comment`);
	}else{
		if(sessionStorage.length !== 0){
			$.ajax({
				url: `${url}/addAComment`,
				type: `POST`,
				data: {
					commentUsername: sessionStorage.username,
					commentText: userComment,
					commentDate: Date.now()
				},
				success: (data)=> {
	                console.log(`comment posted`);
	            },
	            error: (err)=> {
	                console.log(err);
	                console.log(`did not post comment`);
	            }
			});
		}else {
			console.log(`cannot post comment`);
		}
	}
});

$(`#listingList`).on(`click`, `.editBtn`, ()=> {
    event.preventDefault();
    if (!sessionStorage.userId) {
        alert(`401, permission denied`);
        return;
    }
    // const id = (idk what the target was)
    $.ajax({
        url: `${url}/listing/${id}`,
        type: `post`,
        data: {
            userId: sessionStorage.userId
        },
        dataType: `json`,
        success:(product)=> {
            console.log(product);
            $(`#listingTitle`).val(product.title);
            $(`#listingDescription`).val(product.description);
            $('#listingPrice').val(product.price);
            $(`#addProductButton`).text(`Edit Listing`).addClass(`btn-warning`);
            $(`#heading`).text(`Edit Product`);
            editing = true;
        },
        error:(err)=> {
            console.log(err);
            console.log(`something went wrong with getting the single product`);
        }
    });
});

$(`#productList`).on(`click`, `.removeBtn`, ()=> {
    event.preventDefault();
    if (!sessionStorage.userId) {
        alert(`401, permission denied`);
        return;
    }
    // const id = $(this).parent().parent().data(`id`);
    // const li = $(this).parent().parent();
    $.ajax({
        url: `${url}/listing/${id}`,
        type: `DELETE`,
        success:(result)=> {
            li.remove();
        },
        error:function(err) {
            console.log(err);
            console.log(`something went wrong deleting the product`);
        }
    });
});
