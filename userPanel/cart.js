let logoutBtn = document.querySelector("#logoutBtn");
let cartContainer = document.querySelector(".cartContainer");
let liveUser = JSON.parse(sessionStorage.getItem("liveUser"));
let array = JSON.parse(localStorage.getItem("array")) || [];

if (!liveUser) {
  window.location.href = "../index.html";
}

logoutBtn.addEventListener("click", function () {
  syncliveUserCartsToDetails();
  sessionStorage.removeItem("liveUser");
  window.location.href = "../index.html";
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

    let updatedProduct = array.find(p => p.id === cartItem.id);

    let nameText = updatedProduct ? updatedProduct.name : cartItem.name;
    let priceText = updatedProduct ? updatedProduct.price : cartItem.price;
    let descText = updatedProduct ? updatedProduct.description : cartItem.description;

    let cartItemName = document.createElement("p");
    cartItemName.innerText = `Name: ${nameText}`;

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
    cartItemPrice.innerText = `Price: $${priceText}`;

    let cartItemDesc = document.createElement("p");
    cartItemDesc.innerText = `Description: ${descText}`;

    let buyBtn = document.createElement("button");
    buyBtn.innerText = alreadyBought ? "Bought" : "Buy now";

    let billMsg = document.createElement("p");
    billMsg.innerText = `Bill: $${cartItem.price * quantity}`;

    if (!alreadyBought) {
      let removeBtn = document.createElement("button");
      removeBtn.innerText = "Remove";
      removeBtn.addEventListener("click", () => {
        liveUser.liveUserCarts.splice(index, 1);
        sessionStorage.setItem("liveUser", JSON.stringify(liveUser));
        syncliveUserCartsToDetails();
        renderUserCarts();
      });
      userCart.appendChild(removeBtn);
    }

    if (alreadyBought) {
      cartItemQty.disabled = true;
    }

    // let outMsg = document.createElement("p");
    // if (!product || product.quantity <= 0) {
    //   outMsg.innerText = "Out of stock";
    //   outMsg.style.color = "red";
    // }

    buyBtn.addEventListener("click", () => {
      if (alreadyBought) {
        return;
      }

      const finalQty = Number(cartItemQty.value);

      if (!product || product.quantity < finalQty) {
        alert("Sorry, this product is out of stock or quantity is insufficient.");
        return;
      }

      liveUser.itemsBought.push({
        ...cartItem,
        quantity: finalQty,
        bill: finalQty * cartItem.price
      });


      if (product) {
        product.quantity -= finalQty;
      }

      sessionStorage.setItem("liveUser", JSON.stringify(liveUser));
      localStorage.setItem("array", JSON.stringify(array));
      syncliveUserCartsToDetails();
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
        sessionStorage.setItem("liveUser", JSON.stringify(liveUser));
        localStorage.setItem("array", JSON.stringify(array));
        syncliveUserCartsToDetails();
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
    // userCart.appendChild(outMsg);

    if (alreadyBought) userCart.appendChild(cancelBtn);
    cartContainer.appendChild(userCart);
  });
}

function syncliveUserCartsToDetails() {
  let details = JSON.parse(localStorage.getItem("details")) || [];
  let currentUser = JSON.parse(sessionStorage.getItem("liveUser"));
  if (!currentUser) return;

  let index = details.findIndex(user => user.id === currentUser.id);
  if (index !== -1) {
    details[index].liveUserCarts = currentUser.liveUserCarts;
    details[index].itemsBought = currentUser.itemsBought;
    localStorage.setItem("details", JSON.stringify(details));
  }
}

window.addEventListener("storage", (e) => {
  if (e.key === "array" && e.newValue) {
    array = JSON.parse(e.newValue); // Update local product array
    renderUserCarts(); // Rerender cart with updated stock
  }
});

window.onload = renderUserCarts;
