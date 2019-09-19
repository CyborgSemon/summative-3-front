let url;
let mapsKey;

$(document).ready(function(){
	console.log(sessionStorage);
	if(sessionStorage.username){
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
		$(`#registerName`).parent().children().last().show();
		passFail = false;
	} else {
		$(`#registerName`).removeClass(`is-invalid`);
		$(`#registerName`).parent().children().last().hide();
	}
	if (registerAddress.length === 0) {
		$(`#registerAddress`).addClass(`is-invalid`);
		$(`#registerAddress`).parent().children().last().show();
		passFail = false;
	} else {
		$(`#registerAddress`).removeClass(`is-invalid`);
		$(`#registerAddress`).parent().children().last().hide();
	}
	if (registerUsername.length === 0) {
		$(`#registerUsername`).addClass(`is-invalid`);
		$(`#registerUsername`).parent().children().last().show();
		passFail = false;
	} else {
		$(`#registerUsername`).removeClass(`is-invalid`);
		$(`#registerUsername`).parent().children().last().hide();
	}
	if (registerPassword !== registerConfirmPassword || registerPassword.length === 0 || registerConfirmPassword.length === 0) {
		$(`#registerPassword`).addClass(`is-invalid`);
		$(`#registerPassword`).parent().children().last().show();
		$(`#registerConfirmPassword`).addClass(`is-invalid`);
		$(`#registerConfirmPassword`).parent().children().last().show();
		passFail = false;
	} else {
		$(`#registerPassword`).removeClass(`is-invalid`);
		$(`#registerPassword`).parent().children().last().hide();
		$(`#registerConfirmPassword`).removeClass(`is-invalid`);
		$(`#registerConfirmPassword`).parent().children().last().hide();
	}
	if (registerEmail.length === 0) {
		$(`#registerEmail`).addClass(`is-invalid`);
		$(`#registerEmail`).parent().children().last().show();
		passFail = false;
	} else {
		$(`#registerEmail`).removeClass(`is-invalid`);
		$(`#registerEmail`).parent().children().last().hide();
	}
	if (registerDOB.length === 0) {
		$(`#registerDOB`).addClass(`is-invalid`);
		$(`#registerDOB`).parent().children().last().show();
		passFail = false;
	} else {
		$(`#registerDOB`).removeClass(`is-invalid`);
		$(`#registerDOB`).parent().children().last().hide();
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
	if (sessionStorage.length > 0 && sessionStorage.id) {

		let passFail = true;
		const listingTitle = $(`#listingTitle`).val();
		const listingDescription = $(`#listingDescription`).val();
		const listingPrice = $(`#listingPrice`).val();
		const listingImageFile = $(`#listingImageFile`).val();
		if (listingTitle.length === 0) {
			$(`#listingTitle`).addClass(`is-invalid`);
			$(`#listingTitle`).parent().children().last().show();
			passFail = false;
		} else {
			$(`#listingTitle`).removeClass(`is-invalid`);
			$(`#listingTitle`).parent().children().last().hide();
		}
		if (listingDescription.length === 0) {
			$(`#listingDescription`).addClass(`is-invalid`);
			$(`#listingDescription`).parent().children().last().show();
			passFail = false;
		} else {
			$(`#listingDescription`).removeClass(`is-invalid`);
			$(`#listingDescription`).parent().children().last().hide();
		}
		if (listingPrice.length === 0) {
			$(`#listingPrice`).addClass(`is-invalid`);
			$(`#listingPrice`).parent().children().last().show();
			passFail = false;
		} else {
			$(`#listingPrice`).removeClass(`is-invalid`);
			$(`#listingPrice`).parent().children().last().hide();
		}
		if (listingImageFile.length === 0) {
			$(`#listingImageFile`).addClass(`is-invalid`);
			$(`#listingImageFile`).parent().children().last().show();
			passFail = false;
		} else {
			$(`#listingImageFile`).removeClass(`is-invalid`);
			$(`#listingImageFile`).parent().children().last().hide();
		}
		if (passFail) {
			let fd = new FormData();
			const file = $(`#listingImageFile`)[0].files[0];
			fd.append(`filePath`, file);
			fd.append(`originalName`, file.name);
			fd.append(`title`, listingTitle);
			fd.append(`description`, listingDescription);
			fd.append(`price`, listingPrice);
			fd.append(`userId`, sessionStorage.id);

			$.ajax({
				url: `${url}/newListing`,
				method: `POST`,
				data: fd,
				contentType: false,
				processData: false,
				success: (data)=> {
					console.log(`successful`);
					$(`#listingTitle`).val(null);
				    $(`#listingDescription`).val(null);
				    $(`#listingPrice`).val(null);
					$(`#listingImageFile`).val(null);
					$(`#listingModal`).modal(`hide`);
					$(`.toastListing`).removeClass(`d-none`);
				},
				error: (err)=> {
					console.log(err);
					console.log(`did not work`);
				}
			});
		}
	} else {
		console.log(`You are not logged in`);
	}
});


$(`#loginForm`).submit(()=> {
	event.preventDefault();
	let passFail = true;
	let loginUsername = $(`#loginUsername`).val();
	let loginPassword = $(`#loginPassword`).val();
	if (loginUsername.length === 0) {
		$(`#loginUsername`).addClass(`is-invalid`);
		$(`#loginUsername`).parent().children().last().show();
		passFail = false;
	} else {
		$(`#loginUsername`).removeClass(`is-invalid`);
		$(`#loginUsername`).parent().children().last().hide();
	}
	if (loginPassword.length === 0) {
		$(`#loginPassword`).addClass(`is-invalid`);
		$(`#loginPassword`).parent().children().last().show();
		passFail = false;
	} else {
		$(`#loginPassword`).removeClass(`is-invalid`);
		$(`#loginPassword`).parent().children().last().hide();
	}
	if (passFail) {
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
	if (sessionStorage.length > 0 && sessionStorage.id) {
		let passFail = true;
		let userComment = $(`#userComment`).val();
		if (userComment.length === 0) {
			$(`#userComment`).addClass(`is-invalid`);
			$(`#userComment`).parent().children().last().show();
			passFail = false;
		} else {
			$(`#userComment`).removeClass(`is-invalid`);
			$(`#userComment`).parent().children().last().hide();
		}
		if (passFail) {
			$.ajax({
				url: `${url}/addAComment`,
				type: `POST`,
				data: {
					commentUsername: sessionStorage.username,
					commentText: userComment,
					commentDate: Date.now(),
					commentReply: {
						reply: false,
						replyId: null
					},
					commentUserId: sessionStorage.id,
					listingId: $(`#listingDiv`).attr(`data-listingId`)
				},
				success: (data)=> {
					console.log(`comment posted`);
				},
				error: (err)=> {
					console.log(err);
					console.log(`did not post comment`);
				}
			});
		} else {
			console.log(`Invalid text`);
		}
	} else {
		console.log(`You are not logged in`);
	}
});

// $(`#listingList`).on(`click`, `.editBtn`, ()=> {
// 	event.preventDefault();
// 	if (!sessionStorage.userId) {
// 		alert(`401, permission denied`);
// 		return;
// 	}
// 	$.ajax({
// 		url: `${url}/listing/${id}`,
// 		type: `post`,
// 		data: {
// 			userId: sessionStorage.userId
// 		},
// 		dataType: `json`,
// 		success:(product)=> {
// 			console.log(product);
// 			$(`#listingTitle`).val(product.title);
// 			$(`#listingDescription`).val(product.description);
// 			$(`#listingPrice`).val(product.price);
// 			$(`#addProductButton`).text(`Edit Listing`).addClass(`btn-warning`);
// 			$(`#heading`).text(`Edit Product`);
// 			editing = true;
// 		},
// 		error:(err)=> {
// 			console.log(err);
// 			console.log(`something went wrong with getting the single product`);
// 		}
// 	});
// });

// $(`#productList`).on(`click`, `.removeBtn`, ()=> {
// 	event.preventDefault();
// 	if (!sessionStorage.userId) {
// 		alert(`401, permission denied`);
// 		return;
// 	}
// 	// const id = $(this).parent().parent().data(`id`);
// 	// const li = $(this).parent().parent();
// 	$.ajax({
// 		url: `${url}/listing/${id}`,
// 		type: `DELETE`,
// 		success:(result)=> {
// 			li.remove();
// 		},
// 		error:(err)=> {
// 			console.log(err);
// 			console.log(`something went wrong deleting the product`);
// 		}
// 	});
// });
