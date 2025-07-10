let inputBoxes = document.querySelector(".inputBoxes");
let name = document.querySelector("#name");
let quantity = document.querySelector("#quantity");
let price = document.querySelector("#price");
let description = document.querySelector("#description");
let addbtn = document.querySelector("#addbtn");
let cancelBtn = document.querySelector("#cancelBtn");
let totalbill = document.querySelector("#totalbill");
let totalbillMsg = document.querySelector(".totalbillMsg");
let container = document.querySelector(".container");
let logout = document.querySelector("#logout");

let array = [];
let id = 1;

let isInEditMode = false;
let totalBillMsg = document.createElement("p");

/*
totalbill.addEventListener("click", function () {
    totalbillMsg.appendChild(totalBillMsg);
    let sum = 0;
    array.forEach(function (item) {
        sum += parseInt(item.price) * parseInt(item.quantity);
    });
    totalBillMsg.innerText = "Your total payable bill is: " + sum;
});
*/

logout.addEventListener("click", function(){
    window.location.href = "../index.html";
})

addbtn.addEventListener("click", function () {
    inputBoxes.style.display = 'block';
    cancelBtn.style.display = 'block';
    cancelBtn.addEventListener("click", function(){
        inputBoxes.style.display = 'none';
        cancelBtn.style.display = 'none';
    })

    let nameVal = name.value.trim();
    let quantityVal = parseInt(quantity.value);
    let priceVal = parseInt(price.value);
    let descriptionVal = description.value;

    if (!nameVal || !quantityVal || !priceVal || !descriptionVal) return;

    let existingItem = array.find(item => item.name === nameVal);

    if (existingItem) {
        existingItem.quantity = parseInt(existingItem.quantity) + quantityVal;
        existingItem.price = priceVal;
        existingItem.description = descriptionVal;

        existingItem.quantityElement.innerText = "Quantity: " + existingItem.quantity;
        existingItem.priceElement.innerText = "Price: " + existingItem.price;
        existingItem.descriptionElement.innerText = "Description: " + existingItem.description;

        localStorage.setItem("array", JSON.stringify(array));
        name.value = "";
        quantity.value = "";
        price.value = "";
        description.value = "";

        // inputBoxes.style.display = 'none';
        return;
    }

    let arrayItems = {
        id: id++,
        name: nameVal,
        quantity: quantityVal,
        price: priceVal,
        description: descriptionVal,
        isItemPicked: "No",
        liveUserCarts: []
    };

    array.push(arrayItems);
    addToCart(arrayItems);
    localStorage.setItem("array", JSON.stringify(array));
});


function addToCart(arrayItems) {
    let cart = document.createElement("div");
    cart.classList.add("flexclass");
    container.insertBefore(cart, container.firstChild);
    // container.appendChild(cart);


    arrayItems.nameElement = document.createElement("p");
    arrayItems.nameElement.innerText = "Name: " + arrayItems.name;

    arrayItems.quantityElement = document.createElement("p");
    arrayItems.quantityElement.innerText = "Quantity: " + arrayItems.quantity;

    arrayItems.priceElement = document.createElement("p");
    arrayItems.priceElement.innerText = "Price: " + arrayItems.price;

    arrayItems.descriptionElement = document.createElement("p");
    arrayItems.descriptionElement.innerText = "Description: " + arrayItems.description;

    let pickingMsg = document.createElement("p");
    pickingMsg.innerText = "Your item is not picked up yet!";

    let itemPicked = document.createElement("input");
    itemPicked.type = "checkbox";
    itemPicked.addEventListener("click", function () {
        arrayItems.isItemPicked = itemPicked.checked ? "yes" : "No";
        pickingMsg.innerText = itemPicked.checked ? "Hey!Your item is picked up." : "Your item is not picked up yet!";
        localStorage.setItem("array", JSON.stringify(array));
    });

    let modifyBtn = document.createElement("button");
    modifyBtn.innerText = "Edit";
    modifyBtn.addEventListener("click", function () {
        if (modifyBtn.innerText === "Edit") {
            if (isInEditMode) return;
            isInEditMode = true;

            arrayItems.nameInput = document.createElement("input");
            arrayItems.nameInput.innerHTML = "Name:";
            arrayItems.nameInput.value = arrayItems.name;

            arrayItems.quantityInput = document.createElement("input");
            arrayItems.quantityInput.value = arrayItems.quantity;

            arrayItems.priceInput = document.createElement("input");
            arrayItems.priceInput.value = arrayItems.price;

            arrayItems.descriptionInput = document.createElement("input");
            arrayItems.descriptionInput.value = arrayItems.description;

            cart.replaceChild(arrayItems.nameInput, arrayItems.nameElement);
            cart.replaceChild(arrayItems.quantityInput, arrayItems.quantityElement);
            cart.replaceChild(arrayItems.priceInput, arrayItems.priceElement);
            cart.replaceChild(arrayItems.descriptionInput, arrayItems.descriptionElement);

            modifyBtn.innerText = "Save";
        } else {
            let newName = arrayItems.nameInput.value.trim();
            let oldMsg = cart.querySelector(".duplicate-msg");
            if (oldMsg) oldMsg.remove();
            let duplicate = array.find(item => item.name === newName && item.id !== arrayItems.id);
            if (duplicate) {
                let msg = document.createElement("p");
                msg.classList.add("duplicate-msg");
                msg.innerText = "This name already exists! Try a different name.";
                cart.appendChild(msg);
                return;
            }


            arrayItems.name = newName;
            arrayItems.quantity = arrayItems.quantityInput.value;
            arrayItems.price = arrayItems.priceInput.value;
            arrayItems.description = arrayItems.descriptionInput.value;

            arrayItems.nameElement.innerText = "Name: " + arrayItems.name;
            arrayItems.quantityElement.innerText = "Quantity: " + arrayItems.quantity;
            arrayItems.priceElement.innerText = "Price: " + arrayItems.price;
            arrayItems.descriptionElement.innerText = "Description: " + arrayItems.description;

            cart.replaceChild(arrayItems.nameElement, arrayItems.nameInput);
            cart.replaceChild(arrayItems.quantityElement, arrayItems.quantityInput);
            cart.replaceChild(arrayItems.priceElement, arrayItems.priceInput);
            cart.replaceChild(arrayItems.descriptionElement, arrayItems.descriptionInput);

            modifyBtn.innerText = "Edit";
            isInEditMode = false;

            localStorage.setItem("array", JSON.stringify(array));
        }
    });

    let del = document.createElement("button");
    del.innerText = "Delete";
    del.addEventListener("click", function () {
        cart.remove();
        array = array.filter(item => item.id !== arrayItems.id);
        localStorage.setItem("array", JSON.stringify(array));
    });

    let billMsg = document.createElement("p");
    let billBtn = document.createElement("button");
    billBtn.innerText = "Bill";
    billBtn.addEventListener("click", function () {
        let billIs = parseInt(arrayItems.price) * parseInt(arrayItems.quantity);
        billMsg.innerText = `Your bill for ${arrayItems.name} is: ${billIs}`;
    });

    cart.appendChild(arrayItems.nameElement);
    cart.appendChild(arrayItems.quantityElement);
    cart.appendChild(arrayItems.priceElement);
    cart.appendChild(arrayItems.descriptionElement);
    // cart.appendChild(pickingMsg);
    // cart.appendChild(itemPicked);
    cart.appendChild(modifyBtn);
    cart.appendChild(del);
    // cart.appendChild(billBtn);
    // cart.appendChild(billMsg);

    name.value = "";
    quantity.value = "";
    price.value = "";
    description.value = "";
}

function loadStorage() {
    array = JSON.parse(localStorage.getItem("array")) || [];
    if (array.length > 0) {
        const maxId = Math.max(...array.map(item => item.id));
        id = maxId + 1;
    }
    array.forEach(addToCart);
}

loadStorage();
