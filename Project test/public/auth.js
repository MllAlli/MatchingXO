const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", createUser);

const signupFeedback = document.querySelector("#feedback-msg-signup");
const signupModal = new bootstrap.Modal(document.querySelector("#modal-signup"))

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener('submit', loginUser);

const loginFeedback = document.querySelector("#feedback-msg-login");
const loginModal = new bootstrap.Modal(document.querySelector("#modal-login"))

function createUser(event){
    event.preventDefault();
    const email = signupForm['input-email-signup'].value;
    const pwd = signupForm['input-password-signup'].value;

    firebase.auth().createUserWithEmailAndPassword(email, pwd)
    .then(() => {
        signupFeedback.style = `color:green`;
        signupFeedback.innerHTML = `<i class='bi bi-check-circle-fill'></i> Signup completed.`
        setTimeout(() => {
            signupModal.hide()
            signupForm.reset()
            signupFeedback.innerHTML = ``;
        }, 1000)
    })
    .catch((error) => {
        signupFeedback.style = `color:crimson`;
        signupFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}.`;
    })
}

firebase.auth().onAuthStateChanged((user) => {
    console.log('User: ', user);
    // getList(user)
    setupUI(user)
    loadInfo(user)
})

const btnLogout = document.querySelector("#btnLogout");
btnLogout.addEventListener('click', () => {
    firebase.auth().signOut()
    console.log('Logout completed.');
})

function loginUser(event){
    event.preventDefault();
    const email = loginForm['input-email-login'].value;
    const pwd = loginForm['input-password-login'].value;

    firebase.auth().signInWithEmailAndPassword(email, pwd)
    .then(() => {
        loginFeedback.style = `color:green`;
        loginFeedback.innerHTML = `<i class='bi bi-check-circle-fill'></i> Login completed.`
        setTimeout(() => {
            loginModal.hide()
            loginForm.reset()
            loginFeedback.innerHTML = ``;
        }, 1000)
    })
    .catch((error) => {
        loginFeedback.style = `color:crimson`;
        loginFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}.`;
    })
}

const btnCancel = document.querySelectorAll(".btn-cancel").forEach((btn) => {
    btn.addEventListener('click', () => {
        signupForm.reset()
        signupFeedback.innerHTML = ``;
        loginForm.reset()
        loginFeedback.innerHTML = ``;
    })
})