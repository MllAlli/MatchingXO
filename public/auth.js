const signUpForm = document.querySelector('#signup-form');
signUpForm.addEventListener('submit', createUser);

function createUser(event){
    
    event.preventDefault();
    const email = signUpForm['input-email-signup'].value;
    const pwd = signUpForm['input-password-signup'].value;

    firebase.auth().createUserWithEmailAndPassword(email, pwd)
    .then(() => {
        alert('Sign Up Complete!')
        signUpForm.reset();

    })
    .catch((error) => {
        alert(`${error.message}`)
        signUpForm.reset();
    });

}

firebase.auth().onAuthStateChanged((user) => {
    if(user){
        console.log(user)
    }else{
        console.log('Unavailable user')
    }
})


firebase.auth().onAuthStateChanged((user) => {
    console.log('User: ', user);
    // getList(user)
    setupUI(user)
    //loadInfo(user)
})


const btnLogout = document.querySelector('#logout-btn');
btnLogout.addEventListener('click', ()=>{
    firebase.auth().signOut();
    console.log('logout complete!')  
})


const loginPart = document.querySelector('#login-form') 
loginPart.addEventListener('submit', loginUser)

function loginUser(event){
    
    event.preventDefault();
    const email = loginPart['input-email-login'].value;
    const pwd = loginPart['input-password-login'].value;

    firebase.auth().signInWithEmailAndPassword(email, pwd)
    .then(() => {
        alert('Login Complete!')
        loginPart.reset();

        
    })
    .catch((error) => {
        alert(`${error.message}`)
        loginPart.reset();
    });

}