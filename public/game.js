const ref = firebase.database().ref("Game")
const refScore = firebase.database().ref("Scores")

ref.on("value", snapshot => {
    getGameInfo(snapshot)
})

refScore.on("value", snapshot => {
    data = snapshot.val()
    const currentUser = firebase.auth().currentUser

    if (currentUser){
        if (data[currentUser.uid]){
            document.querySelector("#user-score").innerHTML = `(${data[currentUser.uid]})`
        }
        else{
            document.querySelector("#user-score").innerHTML = "(0)"
        }
    }
})

function getGameInfo(snapshot){
    const currentUser = firebase.auth().currentUser

    document.getElementById('inputPlayer-x').value = ''
    document.getElementById('inputPlayer-o').value = ''

    document.querySelector('#btnJoin-x').disabled = false;
    document.querySelector('#btnJoin-o').disabled = false;

    document.querySelector("#wait").innerHTML = "Waiting for players..."

    snapshot.forEach((data) => {
        const gameInfos = data.val()
        Object.keys(gameInfos).forEach(key => {
            switch (key) {
                case 'user-x-email':
                    playerX = gameInfos[key]
                    document.getElementById('inputPlayer-x').value = playerX
                    document.querySelector('#btnJoin-x').disabled = true;
                    break
                case 'user-o-email':
                    playerO = gameInfos[key]
                    document.getElementById('inputPlayer-o').value = playerO
                    document.querySelector('#btnJoin-o').disabled = true;
                    break
            }

            if (currentUser.email == gameInfos[key]){
                document.querySelector('#btnJoin-x').disabled = true;
                document.querySelector('#btnJoin-o').disabled = true;
            }
        })

        if (gameInfos["user-x-email"] && gameInfos["user-o-email"]){
            document.querySelector("#wait").innerHTML = "Click START GAME"
        }
        else {
            document.querySelector("#wait").innerHTML = "Waiting for players..."
        }

        if (gameInfos.status === "start"){
            checkWinner()
            document.querySelector("#btnCancel-x").disabled = true
            document.querySelector("#btnCancel-o").disabled = true
            const boxes = document.querySelectorAll(".table-col")
            boxes.forEach(box => {box.addEventListener("click", inputBox)})
        }
        else if (gameInfos.status === "finish") {
            document.querySelector("#btnCancel-x").disabled = true
            document.querySelector("#btnCancel-o").disabled = true
            const boxes = document.querySelectorAll(".table-col")
            boxes.forEach(box => {box.removeEventListener("click", inputBox)})
        }
        else{
            document.querySelector("#btnCancel-x").disabled = false
            document.querySelector("#btnCancel-o").disabled = false
            const boxes = document.querySelectorAll(".table-col")
            boxes.forEach(box => {box.removeEventListener("click", inputBox)})
        }

        if (gameInfos.tables){
            for (const box in gameInfos.tables){
                document.querySelector(`#${box} p`).innerHTML = gameInfos.tables[box]
            }
        }
        else{
            const boxes = document.querySelectorAll(".table-col p")
            boxes.forEach(box => {box.innerHTML = ""})
        }

        if (gameInfos.winner == "draw"){
            alert(`GAME DRAW`)
            //document.querySelector("#wait").innerHTML = `GAME DRAW`
        }
        else if (gameInfos.winner){
            alert(`Winner: ${gameInfos.winner}`)
            //document.querySelector("#wait").innerHTML = `Winner: ${gameInfos.winner}`
        }
    })
}

const btnJoins = document.querySelectorAll(".btn-join")
btnJoins.forEach(btnJoin => btnJoin.addEventListener('click', joinGame))

function joinGame(event){
    const currentUser = firebase.auth().currentUser
    console.log("[Join] Current user:", currentUser);
    if (currentUser){
        const btnJoinID = event.currentTarget.getAttribute("id")
        const player = btnJoinID[btnJoinID.length-1]

        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value == ""){
            let tmpID = `user-${player}-id`
            let tmpEmail = `user-${player}-email`
            ref.child('game-1').update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email
            })
            console.log(currentUser.email+" added.");
            event.currentTarget.disabled = true;
        }
    }
}

const btnCancels = document.querySelectorAll(".btn-cancel-join-game");
btnCancels.forEach(btnCancel => {btnCancel.addEventListener('click', cancelJoin)})

function cancelJoin(event){
    const currentUser = firebase.auth().currentUser;
    console.log('[Cancel] Current user:', currentUser);
    if (currentUser){
        const btnCancelID = event.currentTarget.getAttribute("id");
        const player = btnCancelID[btnCancelID.length - 1];

        const playerForm = document.getElementById(`inputPlayer-${player}`)
        console.log(playerForm);
        if (playerForm.value && playerForm.value === currentUser.email){
            let tmpID = `user-${player}-id`
            let tmpEmail = `user-${player}-email`
            ref.child('game-1').child(tmpID).remove()
            ref.child('game-1').child(tmpEmail).remove()
            console.log(`delete on id: ${currentUser.uid}`);
            document.querySelector(`#btnJoin-${player}`).disabled = false
        }
    }
}

const nextBtn = document.querySelector("#goToTTT");
nextBtn.addEventListener("click", goToTTT)

function goToTTT(event){
    ref.child("game-1").update({
        status: "start",
        turn: "X",
        tables: ""
    })

    matching.style.display = 'none'
    userTab.style.display = 'flex'
    ttt.style.display = 'flex'
}

btnLogout.addEventListener("click", terminateGame)

function terminateGame(event){
    ref.child("game-1").child("status").remove()
    ref.child("game-1").child("turn").remove()
    ref.child("game-1").child("tables").remove()
    ref.child("game-1").child("winner").remove()
    ref.child("game-1").child("user-o-email").remove()
    ref.child("game-1").child("user-x-email").remove()
    ref.child("game-1").child("user-o-id").remove()
    ref.child("game-1").child("user-x-id").remove()
}

function inputBox(event){
    ref.child("game-1").once("value", snapshot => {
        data = snapshot.val()
        currentUser = firebase.auth().currentUser
        id = event.currentTarget.id
        if (data.turn === "X" && data["user-x-email"] === currentUser.email && !data["tables"][id]){
            ref.child("game-1").child("tables").update({
                [id]: data.turn
            })
            ref.child("game-1").update({
                turn: "O"
            })
        }
        else if (data.turn === "O" && data["user-o-email"] === currentUser.email && !data["tables"][id]){
            ref.child("game-1").child("tables").update({
                [id]: data.turn
            })
            ref.child("game-1").update({
                turn: "X"
            })
        }
    })
}

function checkWinner(){
    ref.child("game-1").once("value", snapshot => {
        data = snapshot.val()
        currentUser = firebase.auth().currentUser
        turns = ["X", "O"]

        if (data.winner){
            return
        }

        for (const turn of turns){
            win1 = data["tables"]["row-1-col-1"] == turn && data["tables"]["row-1-col-2"] == turn && data["tables"]["row-1-col-3"] == turn && data["tables"]["row-1-col-4"] == turn && data["tables"]["row-1-col-5"] == turn
            win2 = data["tables"]["row-2-col-1"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-2-col-3"] == turn && data["tables"]["row-2-col-4"] == turn && data["tables"]["row-2-col-5"] == turn 
            win3 = data["tables"]["row-3-col-1"] == turn && data["tables"]["row-3-col-2"] == turn && data["tables"]["row-3-col-3"] == turn && data["tables"]["row-3-col-4"] == turn && data["tables"]["row-3-col-5"] == turn 
            win4 = data["tables"]["row-4-col-1"] == turn && data["tables"]["row-4-col-2"] == turn && data["tables"]["row-4-col-3"] == turn && data["tables"]["row-4-col-4"] == turn && data["tables"]["row-4-col-5"] == turn 
            win5 = data["tables"]["row-5-col-1"] == turn && data["tables"]["row-5-col-2"] == turn && data["tables"]["row-5-col-3"] == turn && data["tables"]["row-5-col-4"] == turn && data["tables"]["row-5-col-5"] == turn 
            
            win6 = data["tables"]["row-1-col-1"] == turn && data["tables"]["row-2-col-1"] == turn && data["tables"]["row-3-col-1"] == turn && data["tables"]["row-4-col-1"] == turn && data["tables"]["row-5-col-1"] == turn
            win7 = data["tables"]["row-1-col-2"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-2"] == turn && data["tables"]["row-4-col-2"] == turn && data["tables"]["row-5-col-2"] == turn
            win8 = data["tables"]["row-1-col-3"] == turn && data["tables"]["row-2-col-3"] == turn && data["tables"]["row-3-col-3"] == turn && data["tables"]["row-4-col-3"] == turn && data["tables"]["row-5-col-3"] == turn
            win9 = data["tables"]["row-1-col-4"] == turn && data["tables"]["row-2-col-4"] == turn && data["tables"]["row-3-col-4"] == turn && data["tables"]["row-4-col-4"] == turn && data["tables"]["row-5-col-4"] == turn
            win10 = data["tables"]["row-1-col-5"] == turn && data["tables"]["row-2-col-5"] == turn && data["tables"]["row-3-col-5"] == turn && data["tables"]["row-4-col-5"] == turn && data["tables"]["row-5-col-5"] == turn
            
            win11 = data["tables"]["row-1-col-1"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-3"] == turn && data["tables"]["row-4-col-4"] == turn && data["tables"]["row-5-col-5"] == turn
            win12 = data["tables"]["row-1-col-5"] == turn && data["tables"]["row-2-col-4"] == turn && data["tables"]["row-3-col-3"] == turn && data["tables"]["row-4-col-2"] == turn && data["tables"]["row-5-col-1"] == turn

            if (win1 || win2 || win3 || win4 || win5 || win6 || win7 || win8 || win9 || win10 || win11 || win12){
                ref.child("game-1").update({
                    status: "finish",
                    winner: turn
                })
                id = data[`user-${turn.toLowerCase()}-id`]
                refScore.once("value", snapshot => {
                    scores = snapshot.val()
                    if (!scores || !scores[id]){
                        refScore.child(id).update({
                            win: 1
                        })
                    }
                    else{
                        score = scores[id]
                        refScore.child(id).update({
                            win: parseInt(score) + 1
                        })
                    }
                })

                return
            }

            if (data["tables"]["row-1-col-1"] && data["tables"]["row-1-col-2"] && data["tables"]["row-1-col-3"] && data["tables"]["row-1-col-4"] && data["tables"]["row-1-col-5"] && 
                data["tables"]["row-2-col-1"] && data["tables"]["row-2-col-2"] && data["tables"]["row-2-col-3"] && data["tables"]["row-2-col-4"] && data["tables"]["row-2-col-5"] && 
                data["tables"]["row-3-col-1"] && data["tables"]["row-3-col-2"] && data["tables"]["row-3-col-3"] && data["tables"]["row-3-col-4"] && data["tables"]["row-3-col-5"] && 
                data["tables"]["row-4-col-1"] && data["tables"]["row-4-col-2"] && data["tables"]["row-4-col-3"] && data["tables"]["row-4-col-4"] && data["tables"]["row-4-col-5"] && 
                data["tables"]["row-5-col-1"] && data["tables"]["row-5-col-2"] && data["tables"]["row-5-col-3"] && data["tables"]["row-5-col-4"] && data["tables"]["row-5-col-5"]
                ){
                ref.child("game-1").update({
                    status: "finish",
                    winner: "draw"
                })

                id1 = data[`user-x-id`]
                id2 = data[`user-o-id`]

                refScore.once("value", snapshot => {
                    scores = snapshot.val()
                    if (!scores || !scores[id1]){
                        refScore.child(id1).update({
                            win: 1
                        })
                    }
                    else{
                        score = scores[id1]
                        refScore.child(id1).update({
                            win: parseInt(score) + 1
                        })
                    }

                    if (!scores || !scores[id2]){
                        refScore.child(id2).update({
                            win: 1
                        })
                    }
                    else{
                        score = scores[id2]
                        refScore.child(id2).update({
                            win: parseInt(score) + 1
                        })
                    }
                    return
                })
            }
        }
    })
}
