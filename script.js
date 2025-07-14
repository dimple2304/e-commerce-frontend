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

let usernameError = document.querySelector("#usernameError");
let emailError = document.querySelector("#emailError");
let passwordError = document.querySelector("#passwordError");


let loginEmailError = document.querySelector("#loginEmailError");
let loginPasswordError = document.querySelector("#loginPasswordError");



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

    let newUsernameVal = newUsername.value.trim();
    let newEmailVal = newEmail.value.trim();
    let newPasswordVal = newPassword.value;

    // Clear previous error messages
    usernameError.innerText = "";
    emailError.innerText = "";
    passwordError.innerText = "";

    let hasError = false;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{5,}$/;

    if (!newUsernameVal) {
        usernameError.innerText = "Username is required!";
        hasError = true;
    }

    if (!newEmailVal) {
        emailError.innerText = "Email is required!";
        hasError = true;
    } else if (!emailPattern.test(newEmailVal)) {
        emailError.innerText = "Enter a valid email!";
        hasError = true;
    }

    if (!newPasswordVal.trim()) {
        passwordError.innerText = "Password is required!";
        hasError = true;
    } else if (!passwordPattern.test(newPasswordVal)) {
        passwordError.innerHTML =
            `Password must contain at least 
            <br>1 uppercase, 
            <br>1 lowercase, 
            <br>1 digit, 
            <br>1 special character, 
            <br>and be at least 5 characters.`;
        hasError = true;
    }

    if (hasError) return;

    let detailsItems = {
        id: id++, isAdmin: "No", username: newUsernameVal, email: newEmailVal, password: newPasswordVal,
        liveUserCarts: [], itemsBought: [],
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

    let emailVal = email.value.trim();
    let passwordVal = password.value;

    // Clear previous login error messages
    loginEmailError.innerText = "";
    loginPasswordError.innerText = "";

    let hasError = false;


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
        loginEmailError.innerText = "Email is required!";
        hasError = true;
    } else if (!emailPattern.test(emailVal)) {
        loginEmailError.innerText = "Enter a valid email!";
        hasError = true;
    } else {
        loginEmailError.innerText = "";
    }

    if (!passwordVal.trim()) {
        loginPasswordError.innerText = "Password is required!";
        hasError = true;
    } else {
        loginPasswordError.innerText = "";
    }

    if (hasError) return;

    details = JSON.parse(localStorage.getItem("details")) || [];

    let user = details.find(function (item) {
        return item.email == emailVal && item.password == passwordVal;
    });
    console.log(user);

    if (!user && !hasError) {
        loginPasswordError.innerText = "Incorrect email or password!";
    }

    if (user) {
        if (user.isAdmin == "Yes") {
            window.location.href = "adminPanel/products.html";
        } else {
            let liveUserDetails = {
                id: user.id, username: user.username, email: user.email, password: user.password,
                liveUserCarts: user.liveUserCarts || [], itemsBought: user.itemsBought || []
            };

            sessionStorage.setItem("liveUser", JSON.stringify(liveUserDetails));
            window.location.href = "userPanel/index.html";
        }
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
    liveUser = JSON.parse(sessionStorage.getItem("liveUser")) || null;
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


// window.addEventListener("storage", (e) => {
//   if (e.key === "liveUser" && e.newValue === null) {
//     window.location.href = "/";
//   }

//   if (e.key === "liveUser" && e.oldValue === null && e.newValue !== null) {
//     location.reload();
//   }
// });
