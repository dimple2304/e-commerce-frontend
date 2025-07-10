// let array = JSON.parse(localStorage.getItem("array")) || [];
// let container = document.querySelector("#userContainer");
// let logoutBtn = document.querySelector("#logoutBtn");
// let welcome = document.querySelector("#welcome");

// let cartContainer = document.querySelector(".cartContainer");

// let liveUser = JSON.parse(localStorage.getItem("liveUser")) || [];
// console.log(liveUser);

// logoutBtn.addEventListener("click", function () {
//     syncLiveUserCartsToDetails();
//     localStorage.removeItem("liveUser");
//     window.location.href = "../index.html";
// })


// welcome.innerHTML = `<h2>Welcome ${liveUser.username}</h2>`;

// array.forEach(item => {
//     let div = document.createElement("div");
//     div.className = "cart";
//     let name = document.createElement("p");
//     name.innerText = `Name: ${item.name}`;
//     let qty = document.createElement("p");
//     qty.innerText = `Quantity: ${item.quantity}`;
//     let price = document.createElement("p");
//     price.innerText = `Price: ${item.price}`;
//     let desc = document.createElement("p");
//     desc.innerText = `Description: ${item.description}`;

//     let addToCart = document.createElement("button");
//     addToCart.innerText = "Add to cart";

//     addToCart.addEventListener("click", function () {
//         let liveUserCartsArray = { id: item.id, Name: item.name, Quantity: item.quantity, price: item.price, Description: item.description }
//         liveUser.liveUserCarts.push(liveUserCartsArray);
//         syncLiveUserCartsToDetails();
//         // liveUserArray.push(liveUser);
//         console.log(liveUser);

//         // localStorage.setItem("liveUser", JSON.stringify(liveUser));
//         // localStorage.setItem("details", JSON.stringify(details));


//          let userCart = document.createElement("div");
//         userCart.className = "userCart";

//         let cartItemName = document.createElement("p");
//         cartItemName.innerText = `Name: ${cartItem.name}`;
//         let cartItemQty = document.createElement("p");
//         cartItemQty.innerText = `Quantity: ${cartItem.quantity}`;
//         let cartItemPrice = document.createElement("p");
//         cartItemPrice.innerText = `Price: ${cartItem.price}`;
//         let cartItemDesc = document.createElement("p");
//         cartItemDesc.innerText = `Description: ${cartItem.description}`;

//         userCart.appendChild(cartItemName);
//         userCart.appendChild(cartItemQty);
//         userCart.appendChild(cartItemPrice);
//         userCart.appendChild(cartItemDesc);

//         cartContainer.appendChild(userCart);
//     })

//     div.appendChild(name);
//     div.appendChild(qty);
//     div.appendChild(price);
//     div.appendChild(desc);
//     div.appendChild(addToCart);

//     container.appendChild(div);


// });

// // console.log("Products loaded from localStorage:", array);
// function syncLiveUserCartsToDetails() {
//     let details = JSON.parse(localStorage.getItem("details")) || [];
//     let liveUser = JSON.parse(localStorage.getItem("liveUser"));

//     if (liveUser) {
//         let index = details.findIndex(user => user.id === liveUser.id);
//         if (index !== -1) {
//             details[index].liveUserCarts = liveUser.liveUserCarts;
//             localStorage.setItem("details", JSON.stringify(details));
//         }
//     }
// }

// syncLiveUserCartsToDetails()