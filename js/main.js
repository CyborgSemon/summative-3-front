let url;
let onProductPage = false;

$(document).ready(()=> {
	if (sessionStorage.length > 0 && sessionStorage.userId) {
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
        getHome();
    }
});

$(`#registerInstead`).click(()=> {
	$(`#loginModal`).modal(`hide`);
	$(`#registerModal`).modal(`show`);
});

$(`#loginInstead`).click(()=> {
	$(`#registerModal`).modal(`hide`);
	$(`#loginModal`).modal(`show`);
});

$(`#buyListing`).click(()=> {
	if (sessionStorage.length > 0 && sessionStorage.userId) {
		$(`#buyModal`).modal({
			backdrop: `static`,
			keyboard: false
		});
		$(`#buyModal`).modal(`show`);
	} else {
		$(`#loginModal`).modal(`show`);
	}
});

$(`#buyProduct`).click(()=> {
	if (sessionStorage.length > 0 && sessionStorage.userId) {
		$.ajax({
			url: `${url}/buyListing`,
			type: `PATCH`,
			data: {
				id: $(`#productPage`).attr(`data-listingId`),
				userId: sessionStorage.userId
			},
			error: (err)=> {
				console.log(err);
			},
			success: (result)=> {
				if (result != `invalid`) {
					onProductPage = false;
					$(`#buyModal`).modal(`hide`);
				    $(`#homeContainer`).show();
				    $(`#listingsPage`).addClass(`d-none`);
					$(`#productPage`).addClass(`d-none`);
					getHome();
				} else {
					console.log(`You can not buy your own listing`);
				}
			}
		});
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
				$(`#registerModal`).modal(`hide`);
				if (onProductPage) {
					refreshCommentsDiv();
				} else {
					refreshView();
				}
			},
			error: (err)=> {
				console.log(err);
				console.log(`Failed to regester user`);
			}
		});
	}
});

const getListingsData = ()=> {
    $.ajax({
        url: `${url}/allListings`,
        type: `GET`,
        dataType: `json`,
        success: (data)=> {
            $(`#listingPageList`).html(null);
            data.map((listing)=> {
				let listingCard = ``;
				 listingCard += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 mt-3 text-center">`;
					listingCard += `<div class="card h-100 border-dark">`;
						listingCard += `<div class="card-body">`;
							listingCard += `<div class="img-top" style="background-image: url('${url}/${listing.filePath.replace(/\\/g, "/")}'); background-size: cover; background-position: center; background-repeat: no-repeat; height: 200px;">`;
							listingCard += `</div>`;
							listingCard += `<h5 class="card-title pt-2">${listing.title}</h5>`;
							listingCard += `<div class="d-flex justify-content-between">`;
								listingCard += `<span>$${listing.price}</span>`;
								listingCard += `<div class="btn btn-primary viewBtn" data-id="${listing._id}">View</div>`;
						listingCard += `</div>`;
					listingCard += `</div>`;
				listingCard += `</div>`;
                $(`#listingList`).append(listingCard);
                $(`#listingPageList`).append(listingCard);
            });
			refreshView();
        }
    });
};

const getHome = ()=> {
	$.ajax({
		url: `${url}/home`,
		type: `GET`,
		dataType: `json`,
		success: (data)=> {
			$(`#featuredListing`).html(`<div class="container">
											<div class="row">
												<h3 class="text-center featuredTitle">Featured Listing</h3>
											</div>
											<div class="card mb-3 border-dark" style="width: 100%;">
												<div class="row no-gutters">
													<div class="col-md-4" style="background-image: url('${url}/${data[0].filePath.replace(/\\/g, "/")}'); background-size: cover; background-position: center; background-repeat: no-repeat; height: 300px;">
												</div>
												<div class="col-md-8">
													<div class="card-body" style="max-height: 100%; margin: 0 auto;">
														<h5 class="card-title">${data[0].title}</h5>
														<p class="card-text">${data[0].description}</p>
														<div class="row">
															<div class="col">
																<p class="card-text">$${data[0].price}</p>
															</div>
															<div class="col d-flex justify-content-end">
																<button class="btn btn-secondary viewBtn" data-id="${data[0]._id}">Learn More</button>
															</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>`);

			$(`#listingList`).html(null);
			data.map((item, i)=> {
				if (i > 0) {
					let homeListings = ``;
					homeListings += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 mt-3 text-center">`;
	                	homeListings += `<div class="card h-100 border-dark">`;
	                		homeListings += `<div class="card-body">`;
	                			homeListings += `<div class="img-top" style="background-image: url('${url}/${data[i].filePath.replace(/\\/g, "/")}'); background-size: cover; background-position: center; background-repeat: no-repeat; height: 200px;">`;
								homeListings += `</div>`;
	                			homeListings += `<h5 class="card-title pt-2">${data[i].title}</h5>`;
	                			homeListings += `<div class="d-flex justify-content-between">`;
	                				homeListings += `<span>$${data[i].price}</span>`;
									homeListings += `<div class="btn btn-primary viewBtn" data-id="${data[i]._id}">View</div>`;
							homeListings += `</div>`;
						homeListings += `</div>`;
					homeListings += `</div>`;

				$(`#listingList`).append(homeListings);
				}
			});
			refreshView();
		},
		error: (err)=> {
			console.log(err);
			console.log(`could not get the home page listings`);
		}
	});
};

$(`#listingsPageBtn`).click(() => {
	onProductPage = false;
    $(`#homeContainer`).hide();
    $(`#listingsPage`).removeClass(`d-none`);
	$(`#productPage`).addClass(`d-none`);
	getListingsData();
});

$(`#homeBtn`).click(() => {
	onProductPage = false;
    $(`#homeContainer`).show();
    $(`#listingsPage`).addClass(`d-none`);
	$(`#productPage`).addClass(`d-none`);
	getHome();
});

$(`#addAListing`).click(()=> {
	$(`#listingModal`).modal(`show`);
});

$(`#listingImageFile`).change(()=> {
	$(`#fileUploadLabel`).text($(`#listingImageFile`)[0].files[0].name);
});

$(`#listingForm`).click(() => {
	event.preventDefault();
	if (sessionStorage.length > 0 && sessionStorage.userId) {

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
			fd.append(`userId`, sessionStorage.userId);

			$.ajax({
				url: `${url}/newListing`,
				method: `POST`,
				data: fd,
				contentType: false,
				processData: false,
				success: (data)=> {
					$(`#listingTitle`).val(null);
				    $(`#listingDescription`).val(null);
				    $(`#listingPrice`).val(null);
					$(`#listingImageFile`).val(null);
					$(`#fileUploadLabel`).text(`Upload an Image`);
					$(`#toastNotification`).html(`<div class="toast-header">
			    		<strong class="mr-auto">Congratulations!</strong>
						<small class="pl-2 text-muted">just now</small>
			    		<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
			      			<span aria-hidden="true">&times;</span>
			    		</button>
			  		</div>
			  		<div class="toast-body">
			    		Your listing was posted!
			  		</div>`);
					$(`#toastNotification`).toast(`show`);
					$(`#listingModal`).modal(`hide`);
				},
				error: (err)=> {
					console.log(err);
					console.log(`Could not add listing`);
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
				let check = true;
				if (result == `Invalid Username`) {
					check = false;
					$(`#loginUsername`).addClass(`is-invalid`);
					$(`#loginUsername`).parent().children().last().show();
				}

				if (result == `Invalid Password`) {
					check = false;
					$(`#loginPassword`).addClass(`is-invalid`);
					$(`#loginPassword`).parent().children().last().show();
				}
				if (check) {
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
					if (onProductPage) {
						refreshCommentsDiv($(`#productPage`)[0]);
					}
				}
			}
		});
	}
});

$(`#logoutBtn`).click(()=> {
	sessionStorage.clear();
	$(`#logoutBtn`).addClass(`d-none`);
	$(`#addAListing`).addClass(`d-none`);
	$(`#registerModalBtn`).removeClass(`d-none`);
	$(`#loginModalBtn`).removeClass(`d-none`);
	$(`.loginActive`).remove();
	$(`#toastNotification`).html(`<div class="toast-header">
		<strong class="mr-auto">Logging out</strong>
		<small class="pl-2 text-muted">just now</small>
		<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	<div class="toast-body">
		You are now logged out of your account
	</div>`);
	$(`#toastNotification`).toast(`show`);
});

const refreshView = ()=> {
	$(`.viewBtn`).click((e)=> {
		onProductPage = true;
		refreshCommentsDiv(e.target);
	});
};

const refreshCommentsDiv = (targetDiv)=> {
	let itemId = $(targetDiv).attr(`data-id`) || $(targetDiv).attr(`data-listingid`);
	$(`#itemCommentsParent`).html(null);
	$.ajax({
		url: `${url}/product`,
		type: `POST`,
		data: {
			id: itemId
		},
		error: (err)=> {
			console.log(`Cant find listing`);
			console.log(err);
		},
		success: (data)=> {
			$(`#productPage`).attr(`data-listingId`, data.info._id);
			$(`#itemTitle`).text(data.info.title);
			if (sessionStorage.userId == data.info.uploaderId) {
				$(`#productBtns`).removeClass(`d-none`);
			}
			$(`#itemImage`).attr(`style`, `background-image: url('${url}/${data.info.filePath.replace(/\\/g, "/")}')`);
			$(`#itemPrice`).text(`$${data.info.price}`);
			$(`#itemDescription`).text(data.info.description);
			$(`#posterName`).text(data.uploaderName);

			if (sessionStorage.length > 0 && sessionStorage.userId) {
				$(`#itemCommentsParent`).html(`<form class="loginActive" id="commentForm">
					<div class="d-flex">
						<input type="text" class="form-control" id="commentInput" placeholder="Add Question / Comment" required>
						<button type="submit" class="btn btn-primary">Post</button>
					</div>
					<div id="commentValidation" class="invalid-feedback">Comment can not be empty</div>
				</form>`);

				$(`#commentForm`).submit(()=> {
					event.preventDefault();
					if (sessionStorage.length > 0 && sessionStorage.userId) {
						let passFail = true;
						let userComment = $(`#commentInput`).val();
						if (userComment.length === 0) {
							$(`#commentInput`).addClass(`is-invalid`);
							$(`#commentValidation`).parent().children().last().show();
							passFail = false;
						} else {
							$(`#commentInput`).removeClass(`is-invalid`);
							$(`#commentValidation`).parent().children().last().hide();
						}
						if (passFail) {
							$.ajax({
								url: `${url}/addAComment`,
								type: `POST`,
								data: {
									data: JSON.stringify({
										listingId: $(`#productPage`).attr(`data-listingId`),
										commentUsername: sessionStorage.username,
										commentText: userComment,
										commentDate: Date.now(),
										commentUserId: sessionStorage.userId,
										reply: false,
										replyUsername: null,
										replyText: null,
										replyDate: null,
										replyUserId: null
									})
								},
								success: (data2)=> {
									$(`#commentInput`).val(null);
									$(`#noCommentsMsg`).hide();
									let appendComment = ``;
									if (sessionStorage.length > 0 && sessionStorage.userId == data.info.uploaderId) {
										appendComment += `<div class="comment" data-commentId="${data2._id}"><div class="d-flex justify-content-between"><h5>${data2.commentUsername}</h5><button class="btn btn-primary btn-sm replyBtn loginActive">Reply</button></div><p>${data2.commentText}</p></div>`;
									} else {
										appendComment += `<div class="comment"><h5>${data2.commentUsername}</h5><p>${data2.commentText}</p></div>`;
									}

									$(`#itemComments`).append(appendComment);
									refreshReply();
								},
								error: (err2)=> {
									console.log(`did not post comment`);
									console.log(err2);
								}
							});
						}
					} else {
						console.log(`You are not logged in`);
					}
				});
			}

			$(`#itemCommentsParent`).append(`<div id="itemComments"></div>`);

			if (data.comments == `No comments found`) {
				$(`#itemComments`).append(`<h4 id="noCommentsMsg">No comments found.</h4>`);
			} else {
				let commentString = ``;
				data.comments.map((comment)=> {
					if (sessionStorage.length > 0 && sessionStorage.userId == data.info.uploaderId) {
						if (comment.commentReply.reply) {
							commentString += `<div class="comment"><h5>${comment.commentUsername}</h5><p>${comment.commentText}</p>`;
						} else {
							commentString += `<div class="comment" data-commentId="${comment._id}"><div class="d-flex justify-content-between"><h5>${comment.commentUsername}</h5><button class="btn btn-primary btn-sm replyBtn loginActive">Reply</button></div><p>${comment.commentText}</p>`;
						}
					} else {
						commentString += `<div class="comment"><h5>${comment.commentUsername}</h5><p>${comment.commentText}</p>`;
					}
					if (comment.commentReply.reply) {
						commentString += `<div class="comment reply"><h5>${comment.commentReply.replyUsername}</h5><p>${comment.commentReply.replyText}</p></div></div>`;
					} else {
						commentString += `</div>`;
					}
				});
				$(`#itemComments`).append(commentString);
			}
			$(`#homeContainer`).hide();
			$(`#listingsPage`).addClass(`d-none`);
			$(`#productPage`).removeClass(`d-none`);

			refreshReply();
		}
	});
};

const refreshReply = ()=> {
	$(`.replyBtn`).off(`click`);
	$(`.replyBtn`).on(`click`, replyFunction);
};

const replyFunction = (e)=> {
	$(`#replyForm`).remove();
	let replyId = $(e.target).parent().parent().attr(`data-commentId`);
	$(e.target).parent().parent().append(`<form id="replyForm" class="loginActive">
		<div class="d-flex">
			<input type="text" class="form-control" id="replyInput" placeholder="Reply" required>
			<button type="submit" class="btn btn-primary">Post</button>
		</div>
		<div id="replyValidation" class="invalid-feedback">Comment can not be empty</div>
	</form>`);

	$(`#replyForm`).submit(()=> {
		event.preventDefault();
		let passFail = true;
		let userComment = $(`#replyInput`).val();
		if (userComment.length === 0) {
			$(`#replyInput`).addClass(`is-invalid`);
			$(`#replyValidation`).parent().children().last().show();
			passFail = false;
		} else {
			$(`#replyInput`).removeClass(`is-invalid`);
			$(`#replyValidation`).parent().children().last().hide();
		}
		if (passFail) {
			$.ajax({
				url: `${url}/addReply`,
				type: `PATCH`,
				data: {
					data: JSON.stringify({
						commentId: replyId,
						replyUsername: sessionStorage.username,
						replyText: userComment,
						replyDate: Date.now(),
						replyUserId: sessionStorage._id
					})
				},
				error: (err)=> {
					console.log(`There was an error sending the reply`);
					console.log(err);
				},
				success: (replyData)=> {
					let formParent = $(`#replyForm`).parent();
					$(`#replyForm`).remove();
					formParent.append(`<div class="comment reply"><h5>${sessionStorage.username}</h5><p>${userComment}</p></div>`);
					formParent.find(`.btn-sm`).remove();
				}
			});
		}
	});
};

$(`#editListingForm`).click(()=> {
	event.preventDefault();
	if (sessionStorage.length > 0 && sessionStorage.userId) {
		let passFail = true;
		const editListingTitle = $(`#editListingTitle`).val();
		const editListingDescription = $(`#editListingDescription`).val();
		const editListingPrice = $(`#editListingPrice`).val();
		if (editListingTitle.length === 0) {
			$(`#editListingTitle`).addClass(`is-invalid`);
			$(`#editListingTitle`).parent().children().last().show();
			passFail = false;
		} else {
			$(`#editListingTitle`).removeClass(`is-invalid`);
			$(`#editListingTitle`).parent().children().last().hide();
		}
		if (editListingDescription.length === 0) {
			$(`#editListingDescription`).addClass(`is-invalid`);
			$(`#editListingDescription`).parent().children().last().show();
			passFail = false;
		} else {
			$(`#editListingDescription`).removeClass(`is-invalid`);
			$(`#editListingDescription`).parent().children().last().hide();
		}
		if (editListingPrice.length === 0) {
			$(`#editListingPrice`).addClass(`is-invalid`);
			$(`#editListingPrice`).parent().children().last().show();
			passFail = false;
		} else {
			$(`#editListingPrice`).removeClass(`is-invalid`);
			$(`#editListingPrice`).parent().children().last().hide();
		}
		if (passFail) {
			$.ajax({
				url: `${url}/updateListing`,
				type: `PATCH`,
				data: {
					id: $(`#productPage`).attr(`data-listingId`),
					title: editListingTitle,
					description: editListingDescription,
					price: editListingPrice,
					userId: sessionStorage.userId
				},
				success: (data)=> {
					$(`#itemTitle`).text(editListingTitle);
					$(`#itemDescription`).text(editListingDescription);
					$(`#itemPrice`).text(editListingPrice);
					$(`#editListingModal`).modal(`hide`);
					$(`#editListingTitle`).val(null);
					$(`#editListingDescription`).val(null);
					$(`#editListingPrice`).val(null);
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

$(`#editBtn`).click(() => {
	$(`#editListingTitle`).val($(`#itemTitle`).text());
	$(`#editListingDescription`).val($(`#itemDescription`).text());
	$(`#editListingPrice`).val(parseInt($(`#itemPrice`).text().replace(/[^a-zA-Z0-9 ]/g, "")));
	$(`#editListingModal`).modal(`show`);
});

$(`#removeBtn`).click(()=> {
	if (!sessionStorage.userId) {
		alert(`401, permission denied`);
		return;
	}
	$.ajax({
		url: `${url}/deleteListing`,
		type: `DELETE`,
		data: {
			id: $(`#productPage`).attr(`data-listingId`),
			userId: sessionStorage.userId
		},
		success:(result)=> {
			if (result == `deleted`) {
				$(`#homeContainer`).show();
				$(`#listingsPage`).addClass(`d-none`);
				$(`#productPage`).addClass(`d-none`);
				$(`#productPage`).attr(`data-listingId`, null);
				getHome();
			} else {
				console.log(`Failed to delete`);
				console.log(result);
			}
		},
		error:(err)=> {
			console.log(err);
			console.log(`something went wrong deleting the product`);
		}
	});
});
