let url;
let serverURL;
let serverPort;

$.ajax({
    url: `config.json`,
    type:  `GET`,
    dataType: `json`,
    success:(keys)=> {
        serverURL = keys.SERVER_URL;
        serverPort = keys.SERVER_PORT;
        url = `${serverURL}:${serverPort}`;
    },
    error: ()=> {
        console.log('cannot find config file');
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
    if(registerName.length === 0){
        console.log(`please enter a name for register`);
    }else if(registerAddress.length === 0){
        console.log(`please enter an address for register`);
    }else if(registerUsername.length === 0){
        console.log(`please enter a username for register`);
    }else if(registerPassword.length === 0){
        console.log(`please enter a password for register`);
    }else if(registerConfirmPassword.length === 0){
        console.log(`please confirm password`);
    }else if(registerPassword !== registerConfirmPassword){
        console.log(`password does not match`);
    }else if(registerEmail.length === 0){
        console.log(`please enter an email for register`);
    }else if(registerDOB.length === 0){
        console.log(`please enter a date of birth for register`);
    }else{
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
            success:function(result){
                console.log(result);
            },
            error:function(err){
                console.log(err);
                console.log('something went wrong');
            }
        });
    }
});

$(`#listingForm`).click(() => {
    event.preventDefault();
    const listingTitle = $(`#listingTitle`).val();
    const listingDescription = $(`#listingDescription`).val();
    const listingPrice = $(`#listingPrice`).val();
    if(listingTitle.length === 0){
        console.log(`listing title needs an input`);
    }else if(listingDescription.length === 0){
        console.log(`listing description needs an input`);
    }else if(listingPrice.length === 0){
        console.log(`listing price needs an input`);
    }else {
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
            success:function(data){
                console.log(`successful`);
            },
            error:function(err){
                console.log(err);
                console.log(`did not work`);
            }
        });
    }
});
