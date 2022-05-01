const form = document.querySelector("#add-todo-form");
if (form){
    form.addEventListener("submit", addList);
}

// const ref = firebase.database().ref("userList");

function addList(event) {
    event.preventDefault();
    let title = document.getElementById("title").value;
    const currentUser = firebase.auth().currentUser
    ref.child(currentUser.uid).push({
        title,
    });
    console.log("Add list complete!");
    document.getElementById("title").value = "";
}

function readList(snapshot){
    document.getElementById("name-list").innerHTML = "";
    snapshot.forEach((data) => {
        const id = data.key;
        const title = data.val().title;
        const newdiv = `<li id=${id} class='list-group-item row'><div class='col-11 d-inline-block'>${title}</div><div class='col-1 d-inline-block text-end'><button type="button" class="btn btn-outline-danger btn-delete" data-id="${id}"><i class="bi bi-trash3"></i></button></div></li>`;
        const newElement = document.createRange().createContextualFragment(newdiv);
        document.getElementById("name-list").appendChild(newElement)
    })
    document.querySelectorAll("button.btn-delete").forEach((btn) => {
        btn.addEventListener("click", deleteList)
    })
}

// ref.on("value", (data) => {
//     readList(data)
// })

function deleteList(event){
    const id = event.currentTarget.getAttribute('data-id');
    const currentUser = firebase.auth().currentUser;
    ref.child(currentUser.uid).child(id).remove();
    console.log(`delete on id: ${id}`);
}

// function getList(user) {
//     if (user) {
//         ref.child(user.uid).on('value', (snapshot) => {
//             readList(snapshot)
//         })
//     }
// }

const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');
const Content = document.getElementById('ContentAll')

function setupUI(user) {
    if (user) {
        loginItems.forEach((item) => { item.style.display = 'inline-block' })
        logoutItems.forEach((item) => { item.style.display = 'none' })
        Content.classList.add('d-flex')
      
        document.querySelector("#user-profile-name").innerHTML = user.email
    } else {
        loginItems.forEach((item) => { item.style.display = 'none' })
        logoutItems.forEach((item) => { item.style.display = 'inline-block' })
        Content.classList.remove('d-flex')
    }
}