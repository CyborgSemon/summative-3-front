console.log('JS has loaded');
console.log(`yeet`);

$(`#listingList`).on(`click`, `.editBtn` ()=> {
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
    })
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
    })
});
