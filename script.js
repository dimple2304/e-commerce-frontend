let loginForm = document.querySelector("#loginForm");
let signinForm = document.querySelector("#signinForm");
let signinBtn = document.querySelector("#signinBtn");
let loginBtn = document.querySelector("#loginBtn");

let signup = document.querySelector("#signup");
let login = document.querySelector("#login");

let newUsername = document.querySelector("#newUsername");
let newPassword = document.querySelector("#newPassword");
let newEmail = document.querySelector("#newEmail");
let checkbox = document.querySelector("#checkbox");

let email = document.querySelector("#email");
let password = document.querySelector("#password");


signinBtn.addEventListener("click", function () {
    signinForm.style.display = 'block';
    loginForm.style.display = 'none';
})
loginBtn.addEventListener("click", function () {
    signinForm.style.display = 'none';
    loginForm.style.display = 'block';
})


let details = [];
let id = 1;

signup.addEventListener("click", signupHandler);
function signupHandler(event) {
    event.preventDefault();

    let newUsernameVal = newUsername.value;
    let newEmailVal = newEmail.value;
    let newPasswordVal = newPassword.value;

    let detailsItems = {
        id: id++, isAdmin: "No", username: newUsernameVal, email: newEmailVal, password: newPasswordVal,
        liveUserCarts: [], itemsBought:[],
    };

    detailsItems.isAdmin = checkbox.checked ? "Yes" : "No";

    details.push(detailsItems);
    localStorage.setItem("details", JSON.stringify(details));
    console.log(details);

    signinForm.style.display = 'none';
    loginForm.style.display = 'block';

    newUsername.value = '';
    newEmail.value = '';
    newPassword.value = '';
    checkbox.checked = false;

}

login.addEventListener("click", loginHandler);
console.log("JS loaded");
let liveUser = [];
function loginHandler(event) {
    event.preventDefault();

    let emailVal = email.value;
    let passwordVal = password.value;

    details = JSON.parse(localStorage.getItem("details")) || [];

    let user = details.find(function (item) {
        return item.email == emailVal && item.password == passwordVal;
    });
    console.log(user);


    if (user) {
        if (user.isAdmin == "Yes") {
            window.location.href = "adminPanel/products.html";
            // window.alert("Login successful");
        }
        else {
            let liveUserDetails = {
                id: user.id, username: user.username, email: user.email, password: user.password,
                liveUserCarts: user.liveUserCarts || [], itemsBought: user.itemsBought || []
            };

            localStorage.setItem("liveUser", JSON.stringify(liveUserDetails));
            window.location.href = "userPanel/index.html";
            // localStorage.setItem("liveUser", JSON.stringify(liveUser));
        }
    }
    else {
        console.log("invalid details");
    }
    email.value = "";
    password.value = "";
}

function loadDetailsStorage() {
    details = JSON.parse(localStorage.getItem("details")) || [];
    if (details.length > 0) {
        const maxId = Math.max(...details.map(item => item.id));
        id = maxId + 1;
    }
}
loadDetailsStorage();

function loadLiveUserStorage() {
    liveUser = JSON.parse(localStorage.getItem("liveUser")) || null;
    if (details.length > 0) {
        const maxId = Math.max(...details.map(item => item.id));
        id = maxId + 1;
    }
}
loadLiveUserStorage();

if (liveUser) {
    if (liveUser.isAdmin === "Yes") {
        window.location.href = "adminPanel/products.html";
    } else {
        window.location.href = "userPanel/index.html";
    }
}