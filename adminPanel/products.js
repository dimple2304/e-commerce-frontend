let welcomeMessage = document.querySelector(".welcome");
let inputBoxes = document.querySelector(".inputBoxes");
let name = document.querySelector("#name");
let quantity = document.querySelector("#quantity");
let price = document.querySelector("#price");
let description = document.querySelector("#description");
let addbtn = document.querySelector("#addbtn");
let cancelBtn = document.querySelector("#cancelBtn");
let totalbillMsg = document.querySelector(".totalbillMsg");
let container = document.querySelector(".container");
let logout = document.querySelector("#logout");

let adminDetail = JSON.parse(localStorage.getItem("liveUser"));

let array = [];
let id = 1;
let isInEditMode = false;
let itemsPerPage = 10;
let currentPage = 1;

logout.addEventListener("click", () => {
    window.location.href = "../index.html";
});

// if(adminDetail){
//     welcomeMessage.innerHTML = `Welcome ${adminDetail.username}`;
// }

addbtn.addEventListener("click", () => {
    inputBoxes.style.display = 'block';
    cancelBtn.style.display = 'block';

    cancelBtn.onclick = () => {
        inputBoxes.style.display = 'none';
        cancelBtn.style.display = 'none';
    };

    let nameVal = name.value.trim();
    let quantityVal = parseInt(quantity.value);
    let priceVal = parseInt(price.value);
    let descriptionVal = description.value;

    if (!nameVal || !quantityVal || !priceVal || !descriptionVal){
        return;
    }

    let existingItem = array.find(item => item.name === nameVal);

    if (existingItem) {
        existingItem.quantity += quantityVal;
        existingItem.price = priceVal;
        existingItem.description = descriptionVal;
        localStorage.setItem("array", JSON.stringify(array));
        renderPage(currentPage);
        resetForm();
        return;
    }

    let newItem = {
        id: id++,
        name: nameVal,
        quantity: quantityVal,
        price: priceVal,
        description: descriptionVal,
        // isItemPicked: "No",
        // liveUserCarts: []
    };

    array.push(newItem);
    localStorage.setItem("array", JSON.stringify(array));
    renderPage(currentPage);
    resetForm();
});

function resetForm() {
    name.value = "";
    quantity.value = "";
    price.value = "";
    description.value = "";
}

function renderPage(page) {
    container.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    array.slice(start, end).forEach(item => createCard(item));
    renderPagination();
}

function renderPagination() {
    let paginationContainer = document.querySelector("#pagination");
    if (!paginationContainer) {
        paginationContainer = document.createElement("div");
        paginationContainer.id = "pagination";
        container.after(paginationContainer);
    }

    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(array.length / itemsPerPage);

    if (totalPages <= 1) return;

    if (currentPage > 1) {
        let prevBtn = document.createElement("button");
        prevBtn.innerText = "Previous";
        prevBtn.onclick = () => {
            currentPage--;
            renderPage(currentPage);
        };
        paginationContainer.appendChild(prevBtn);
    }

    for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.innerText = i;

    if (i === currentPage) {
        pageBtn.classList.add("active-page");
    }

    pageBtn.onclick = () => {
        currentPage = i;
        renderPage(currentPage);
    };

    paginationContainer.appendChild(pageBtn);
}


    if (currentPage < totalPages) {
        let nextBtn = document.createElement("button");
        nextBtn.innerText = "Next";
        nextBtn.onclick = () => {
            currentPage++;
            renderPage(currentPage);
        };
        paginationContainer.appendChild(nextBtn);
    }
}

function createCard(item) {
    let cart = document.createElement("div");
    cart.classList.add("flexclass");

    item.nameElement = document.createElement("p");
    item.nameElement.innerText = "Name: " + item.name;

    item.quantityElement = document.createElement("p");
    item.quantityElement.innerText = "Quantity: " + item.quantity;

    item.priceElement = document.createElement("p");
    item.priceElement.innerText = "Price: " + item.price;

    item.descriptionElement = document.createElement("p");
    item.descriptionElement.innerText = "Description: " + item.description;

    let modifyBtn = document.createElement("button");
    modifyBtn.innerText = "Edit";

    modifyBtn.onclick = () => {
        if (modifyBtn.innerText === "Edit") {
            if (isInEditMode) return;
            isInEditMode = true;

            item.nameInput = createInputField("Name", item.name);
            item.quantityInput = createInputField("Quantity", item.quantity, "number");
            item.priceInput = createInputField("Price", item.price, "number");
            item.descriptionInput = createInputField("Description", item.description);

            item.nameWrapper = wrapField("Name:", item.nameInput);
            item.quantityWrapper = wrapField("Quantity:", item.quantityInput);
            item.priceWrapper = wrapField("Price:", item.priceInput);
            item.descriptionWrapper = wrapField("Description:", item.descriptionInput);

            cart.replaceChild(item.nameWrapper, item.nameElement);
            cart.replaceChild(item.quantityWrapper, item.quantityElement);
            cart.replaceChild(item.priceWrapper, item.priceElement);
            cart.replaceChild(item.descriptionWrapper, item.descriptionElement);

            modifyBtn.innerText = "Save";
        } else {
            let newName = item.nameInput.value.trim();
            let duplicate = array.find(el => el.name === newName && el.id !== item.id);
            cart.querySelector(".duplicate-msg")?.remove();
            if (duplicate) {
                let msg = document.createElement("p");
                msg.innerText = "This name already exists! Try another.";
                msg.classList.add("duplicate-msg");
                msg.style.color = "red";
                cart.appendChild(msg);
                return;
            }

            item.name = newName;
            item.quantity = item.quantityInput.value;
            item.price = item.priceInput.value;
            item.description = item.descriptionInput.value;

            item.nameElement.innerText = "Name: " + item.name;
            item.quantityElement.innerText = "Quantity: " + item.quantity;
            item.priceElement.innerText = "Price: " + item.price;
            item.descriptionElement.innerText = "Description: " + item.description;

            cart.replaceChild(item.nameElement, item.nameWrapper);
            cart.replaceChild(item.quantityElement, item.quantityWrapper);
            cart.replaceChild(item.priceElement, item.priceWrapper);
            cart.replaceChild(item.descriptionElement, item.descriptionWrapper);

            modifyBtn.innerText = "Edit";
            isInEditMode = false;

            localStorage.setItem("array", JSON.stringify(array));
        }
    };

    let del = document.createElement("button");
    del.innerText = "Delete";
    del.classList.add("delete-button");
    del.onclick = () => {
        array = array.filter(el => el.id !== item.id);
        localStorage.setItem("array", JSON.stringify(array));
        renderPage(currentPage > 1 && (currentPage - 1) * itemsPerPage >= array.length ? currentPage - 1 : currentPage);
    };

    cart.appendChild(item.nameElement);
    cart.appendChild(item.quantityElement);
    cart.appendChild(item.priceElement);
    cart.appendChild(item.descriptionElement);
    cart.appendChild(modifyBtn);
    cart.appendChild(del);
    container.appendChild(cart);
}

function createInputField(placeholder, value, type = "text") {
    let input = document.createElement("input");
    input.type = type;
    input.value = value;
    input.style.width = "150px";
    return input;
}

function wrapField(labelText, inputElement) {
    let wrapper = document.createElement("div");
    wrapper.style.marginBottom = "10px";
    let label = document.createElement("label");
    label.innerText = labelText;
    label.style.display = "block";
    wrapper.appendChild(label);
    wrapper.appendChild(inputElement);
    return wrapper;
}

function loadStorage() {
    array = JSON.parse(localStorage.getItem("array")) || [];
    if (array.length > 0) {
        id = Math.max(...array.map(item => item.id)) + 1;
    }
    renderPage(currentPage);
}

loadStorage();


// Prevent multi login
window.addEventListener("storage", (e) => {
  if (e.key === "liveUser" && e.newValue === null) {
    window.location.href = "/";
  }

  if (e.key === "liveUser" && e.oldValue === null && e.newValue !== null) {
    location.reload(); 
  }
});

