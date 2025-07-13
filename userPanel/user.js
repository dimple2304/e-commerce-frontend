let container = document.querySelector("#userContainer");
let logoutBtn = document.querySelector("#logoutBtn");
let welcome = document.querySelector("#welcome");
let cartContainer = document.querySelector(".cartContainer");
let myCartHeading = document.querySelector("#myCartHeading");
let nextBtn = document.querySelector("#nextBtn");
let previousBtn = document.querySelector("#previousBtn");

let productsFromAdmin = JSON.parse(localStorage.getItem("array")) || [];
// let details = JSON.parse(localStorage.getItem("details")) || [];
let liveUser = JSON.parse(localStorage.getItem("liveUser"));

if (!liveUser) {
    window.location.href = "../index.html"; // Redirect to login if not logged in
} else {
    liveUser.liveUserCarts = liveUser.liveUserCarts || [];
    liveUser.itemsBought = liveUser.itemsBought || [];
    welcome.innerHTML = `Welcome ${liveUser.username}`;
}

logoutBtn.addEventListener("click", function () {
    syncliveUserCartsToDetails();
    localStorage.removeItem("liveUser");
    window.location.href = "../index.html";
});

let array = [];
const itemsPerPage = 10;
let currentPage = 1;

window.onload = () => {
    array = productsFromAdmin.map(product => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        description: product.description
    }));

    renderPaginatedProducts();
    renderUserCarts();
};

function renderPaginatedProducts() {
    container.innerHTML = "";

    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let paginatedItems = array.slice(startIndex, endIndex);

    paginatedItems.forEach(item => {
        let div = document.createElement("div");
        div.className = "cart";

        let name = document.createElement("p");
        name.innerText = `Name: ${item.name}`;

        let qty = document.createElement("p");
        qty.innerText = `Quantity: ${item.quantity}`;

        let price = document.createElement("p");
        price.innerText = `Price: $${item.price}`;

        let desc = document.createElement("p");
        desc.innerText = `Description: ${item.description}`;

        let addToCart = document.createElement("button");
        addToCart.innerText = "Add to cart";
        addToCart.setAttribute("data-id", item.id);

        let alreadyAdded = liveUser.liveUserCarts.some(cart => cart.id === item.id);
        if (alreadyAdded) {
            addToCart.innerText = "Added to cart";
            addToCart.disabled = true;
        }

        if (item.quantity <= 0) {
            let outMsg = document.createElement("p");
            outMsg.innerText = "Out of stock";
            outMsg.style.color = "red";
            div.appendChild(outMsg);
            addToCart.disabled = true;
        }

        addToCart.addEventListener("click", () => {
            if (liveUser.liveUserCarts.some(cart => cart.id === item.id)) return;

            liveUser.liveUserCarts.push({ ...item });
            localStorage.setItem("liveUser", JSON.stringify(liveUser));
            syncliveUserCartsToDetails();
            renderUserCarts();
            renderPaginatedProducts();
        });

        div.appendChild(name);
        div.appendChild(qty);
        div.appendChild(price);
        div.appendChild(desc);
        div.appendChild(addToCart);
        container.appendChild(div);
    });

    document.querySelector(".pageno").innerText = `${currentPage}`;
    updatePaginationButtons();
}

function updatePaginationButtons() {
    previousBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * itemsPerPage >= array.length;
}

nextBtn.addEventListener("click", () => {
    if (currentPage * itemsPerPage < array.length) {
        currentPage++;
        renderPaginatedProducts();
    }
});

previousBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderPaginatedProducts();
    }
});

function renderUserCarts() {
    cartContainer.innerHTML = "";

    if (liveUser.liveUserCarts.length === 0) {
        cartContainer.innerHTML = "Your cart is empty!";
        return;
    }

    liveUser.liveUserCarts.forEach((cartItem, index) => {
        const alreadyBought = liveUser.itemsBought.some(b => b.id == cartItem.id);
        const boughtItem = liveUser.itemsBought.find(b => b.id == cartItem.id);
        const quantity = alreadyBought ? boughtItem.quantity : 1;

        let userCart = document.createElement("div");
        userCart.className = "userCart";

        let cartItemName = document.createElement("p");
        cartItemName.innerText = `Name: ${cartItem.name}`;

        let cartItemQtyLabel = document.createElement("span");
        cartItemQtyLabel.innerText = "Quantity: ";

        let cartItemQty = document.createElement("input");
        cartItemQty.type = "number";
        cartItemQty.min = 1;
        let product = array.find(p => p.id === cartItem.id);
        let maxQty = alreadyBought ? boughtItem.quantity : (product?.quantity || 1);
        cartItemQty.max = maxQty;
        cartItemQty.value = quantity;

        let cartItemPrice = document.createElement("p");
        cartItemPrice.innerText = `Price: $${cartItem.price}`;

        let cartItemDesc = document.createElement("p");
        cartItemDesc.innerText = `Description: ${cartItem.description}`;

        let buyBtn = document.createElement("button");
        buyBtn.innerText = alreadyBought ? "Bought" : "Buy now";

        let billMsg = document.createElement("p");
        billMsg.innerText = `Bill: $${cartItem.price * quantity}`;

        if (!alreadyBought) {
            let removeBtn = document.createElement("button");
            removeBtn.innerText = "Remove";
            removeBtn.addEventListener("click", () => {
                liveUser.liveUserCarts.splice(index, 1);
                localStorage.setItem("liveUser", JSON.stringify(liveUser));
                syncliveUserCartsToDetails();
                renderUserCarts();
                renderPaginatedProducts();
            });
            userCart.appendChild(removeBtn);
        }

        if (alreadyBought) {
            cartItemQty.disabled = true;
        }

        buyBtn.addEventListener("click", () => {
            if (alreadyBought) return;

            const finalQty = Number(cartItemQty.value);
            liveUser.itemsBought.push({
                ...cartItem,
                quantity: finalQty,
                bill: finalQty * cartItem.price
            });

            if (product) {
                product.quantity -= finalQty;
            }

            localStorage.setItem("liveUser", JSON.stringify(liveUser));
            localStorage.setItem("array", JSON.stringify(array));
            syncliveUserCartsToDetails();
            renderPaginatedProducts();
            renderUserCarts();
        });

        let cancelBtn = document.createElement("button");
        cancelBtn.innerText = "Cancel order";
        cancelBtn.addEventListener("click", () => {
            const idx = liveUser.itemsBought.findIndex(b => b.id === cartItem.id);
            if (idx !== -1) {
                const qty = liveUser.itemsBought[idx].quantity;
                const product = array.find(p => p.id === cartItem.id);
                if (product) product.quantity += qty;

                liveUser.itemsBought.splice(idx, 1);
                localStorage.setItem("liveUser", JSON.stringify(liveUser));
                localStorage.setItem("array", JSON.stringify(array));
                syncliveUserCartsToDetails();
                renderPaginatedProducts();
                renderUserCarts();
            }
        });

        cartItemQty.addEventListener("input", () => {
            let qty = Number(cartItemQty.value);
            if (qty > maxQty) {
                qty = maxQty;
                cartItemQty.value = maxQty;
            }
            billMsg.innerText = `Bill: $${cartItem.price * qty}`;
        });

        userCart.appendChild(cartItemName);
        userCart.appendChild(cartItemQtyLabel);
        userCart.appendChild(cartItemQty);
        userCart.appendChild(cartItemPrice);
        userCart.appendChild(cartItemDesc);
        userCart.appendChild(buyBtn);
        userCart.appendChild(billMsg);

        if (alreadyBought) userCart.appendChild(cancelBtn);
        cartContainer.appendChild(userCart);
    });
}

function syncliveUserCartsToDetails() {
    let details = JSON.parse(localStorage.getItem("details")) || [];
    let currentUser = JSON.parse(localStorage.getItem("liveUser"));
    if (!currentUser) return;

    let index = details.findIndex(user => user.id === currentUser.id);
    if (index !== -1) {
        details[index].liveUserCarts = currentUser.liveUserCarts;
        details[index].itemsBought = currentUser.itemsBought;
        localStorage.setItem("details", JSON.stringify(details));
    }
}



window.addEventListener("storage", (e) => {
  if (e.key === "liveUser" && e.newValue === null) {
    window.location.href = "/";
  }

  if (e.key === "liveUser" && e.oldValue === null && e.newValue !== null) {
    location.reload();
  }
});


