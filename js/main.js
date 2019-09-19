let url;
let mapsKey;
let editing = false;

$(document).ready(function(){
    console.log(sessionStorage);
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
        getListingsData();
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
            },
            error: (err)=> {
                console.log(err);
                console.log(`something went wrong`);
            }
        });
    }
});

getListingsData = ()=> {
    $.ajax({
        url: `${url}/allListings`,
        type: `GET`,
        dataType: `json`,
        success: (data)=> {
            console.log(data);
            $(`#listingList`).empty();
            data.map((listing)=> {
                let listingCard =
                // `<li class="list-group-item d-flex justify-content-between align-items-center listingItem" data-listingId="${listing._id}">
                // <span class="listingName">${listing.title}</span>`;
                // // if (sessionStorage.uploaderId) {
                //     listingCard += `<div>
                //     <button class="btn btn-info editBtn">Edit</button>
                //     <button class="btn btn-danger removeBtn">Remove</button>
                //     </div>`;
                // // }
                // listingCard +=`</li>`;
                `<div class="col-12 col-sm-6 col-md-4 mb-3 mt-3 text-center"`;
                listingCard += `<div class="card h-100 border-dark" >`;
                listingCard += `<div class="card-body">`;
                listingCard += `<img src="" class="card-img-top" alt="">`;
                listingCard += `<h5 class="card-title">${listing.title}</h5>`;
                listingCard += `<div class="d-flex justify-content-between">
                <span>$${listing.price}</span>
                <div class="btn btn-primary">Edit</div>
                </div>`;
                $(`#listingList`).append(listingCard);
            });
        }
    });
};

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

        if (editing === true) {
            const id = $('#productID').val();
            $.ajax({
                url: `${url}/product/${id}`,
                type: 'PATCH',
                data: {
                    name: productName,
                    price: productPrice,
                    userId: sessionStorage.userId
                },
                success:function(result){
                    console.log(result);
                    $(`#listingTitle`).val(null);
                    $(`#listingDescription`).val(null);
                    $('#listingPrice').val(null);
                    $(`#addProductButton`).text(`Add Listing`).addClass(`btn-warning`);
                    $(`#heading`).text(`Add Product`);
                    editing = false;
                    const allProducts = $(`.productItem`);
                    allProducts.each(function(){
                        if($(this).data(`id`) === id){
                            $(this).find(`.productName`).text(productName);
                        }
                    });
                },
                error: function(err){
                    console.log(err);
                    console.log(`something went wront with editing the product`);
                }
            });
        } else {
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

$(`#commentList`).on(`click`, `.editBtn`, ()=> {
    event.preventDefault();
    if (!sessionStorage.userId) {
        alert(`401, permission denied`);
        return;
    }
    // const id = (idk what the target was)
    $.ajax({
        url: `${url}/getComment`,
        type: `post`,
        data: {
            userId: sessionStorage.userId
        },
        dataType: `json`,
        success:(comment)=> {
            console.log(comment);
            $(`#commentText`).val(comment.text);
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
