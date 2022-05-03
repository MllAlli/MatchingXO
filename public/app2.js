/* Login & Sign Up Part */
const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
const modalTutorial = document.querySelector(".modal-tutorial")
const openTutorial = document.querySelector(".tutorial")

signupBtn.onclick = (()=>{
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});

loginBtn.onclick = (()=>{
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});

/* Login & Sign Up Part */
  

/* Database Part */


/* Database Part */

const startBtn = document.querySelector('#btnStartGame')
startBtn.disabled = false;
startBtn.addEventListener('click', () =>{

    wait.style.display = 'none'
    userTab.style.display = 'flex'
    matching.style.display = 'flex'
})

const toStatBtn = document.querySelector('#toStat-btn')
toStatBtn.addEventListener('click', () =>{

    wait.style.display = 'none'
    ttt.style.display = 'none'
    matching.style.display = 'none'
    userTab.style.display = 'flex'
    statPage.style.display = 'flex'
    home.style.display = 'none'
})

const toWaitBtn = document.querySelector('#toWait-btn')
toWaitBtn.addEventListener('click', () =>{

    wait.style.display = 'flex'
    ttt.style.display = 'none'
    matching.style.display = 'none'
    userTab.style.display = 'flex'
    statPage.style.display = 'none'
    home.style.display = 'none'
})

const fromAnnounceToStatBtn = document.querySelector('#fromAnnounceToStat')
fromAnnounceToStatBtn.addEventListener('click', () =>{

    announceModal.style.display = 'none'
    wait.style.display = 'none'
    ttt.style.display = 'none'
    matching.style.display = 'none'
    userTab.style.display = 'flex'
    statPage.style.display = 'flex'
    home.style.display = 'none'
})

const fromAnnounceToWaitBtn = document.querySelector('#fromAnnounceToWait')
fromAnnounceToWaitBtn.addEventListener('click', () =>{

    announceModal.style.display = 'none'
    wait.style.display = 'flex'
    ttt.style.display = 'none'
    matching.style.display = 'none'
    userTab.style.display = 'flex'
    statPage.style.display = 'none'
    home.style.display = 'none'
})


// const nextBtn = document.querySelector('#goToTTT')
// nextBtn.addEventListener('submit', goToTTT)


// function startGame(event){

//     console.log('Add playerInfo complete!')
//     wait.style.display = 'none'
//     userTab.style.display = 'flex'
//     matching.style.display = 'flex'
// };

// function goToTTT(event){

//   matching.style.display = 'none'
//   userTab.style.display = 'flex'
//   ttt.style.display = 'flex'
// };

/* Set Up UI */
const home = document.querySelector('.homepage') 
const wait = document.querySelector('.waiting') 
const matching = document.querySelector('.matching')
const ttt = document.querySelector('.ttt')
const userTab = document.querySelector('.dropdown')
const statPage = document.querySelector('.statPage')
const announceModal = document.querySelector('#announceModal')
wait.style.display = 'none'
userTab.style.display = 'none'
ttt.style.display = 'none'
matching.style.display = 'none'
statPage.style.display = 'none'
announceModal.style.display = 'none'

function setupUI(user){
    if(user){
        document.querySelector('#user-email').innerHTML = user.email + '&emsp;';
        document.querySelector("#playerStatTag").innerHTML = user.email + `'s Stat`;
        home.style.display = 'none'
        wait.style.display = 'flex'
        userTab.style.display = 'flex'
    }else{
        home.style.display = 'flex'
        wait.style.display = 'none'
        userTab.style.display = 'none'
        ttt.style.display = 'none'
        matching.style.display = 'none'
        statPage.style.display = 'none'
        announceModal.style.display = 'none'
    }
}
/* Set Up UI */