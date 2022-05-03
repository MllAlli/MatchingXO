const refTTT = firebase.database().ref("TTTGame")
const refTTTScore = firebase.database().ref("TTTScores")
const playerSign = document.querySelector(".playerSign")
const playerPawn = document.querySelector(".playerPawn")
const playerSpecialPawn = document.querySelector(".playerSpecialPawn")
const playerStatTag = document.querySelector("#playerStatTag")

refTTT.on("value", snapshot => {
    getTTTGameInfo(snapshot)
})

refTTTScore.on("value", snapshot => {
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

function getTTTGameInfo(snapshot){
    const currentUser = firebase.auth().currentUser

    document.getElementById('inputPlayer-x').value = ''
    document.getElementById('inputPlayer-o').value = ''

    document.querySelector('#btnJoin-x').disabled = false;
    document.querySelector('#btnJoin-o').disabled = false;

    document.querySelector("#wait").innerHTML = "Waiting for players..."

    snapshot.forEach((data) => {
        const gameTTTInfos = data.val()
        Object.keys(gameTTTInfos).forEach(key => {
            switch (key) {
                case 'user-x-email':
                    playerX = gameTTTInfos[key]
                    document.getElementById('inputPlayer-x').value = playerX
                    document.querySelector('#btnJoin-x').disabled = true;
                    playerPawn.innerHTML = 'Pawn: '+ gameTTTInfos.x_Pawn
                    console.log(gameTTTInfos.x_Pawn)
                    playerSpecialPawn.innerHTML = 'Special Item: '+ gameTTTInfos.x_EX
                    break
                case 'user-o-email':
                    playerO = gameTTTInfos[key]
                    document.getElementById('inputPlayer-o').value = playerO
                    document.querySelector('#btnJoin-o').disabled = true;
                    playerPawn.innerHTML = 'Pawn: '+ gameTTTInfos.o_Pawn
                    playerSpecialPawn.innerHTML = 'Special Item: '+ gameTTTInfos.o_EX
                    console.log(gameTTTInfos.o_Pawn)
                    break
            }

            if (currentUser.email == gameTTTInfos[key]){
                document.querySelector('#btnJoin-x').disabled = true;
                document.querySelector('#btnJoin-o').disabled = true;
            }
        })

        if (gameTTTInfos["user-x-email"] && gameTTTInfos["user-o-email"]){
            document.querySelector("#wait").innerHTML = "Click START GAME"
        }
        else {
            document.querySelector("#wait").innerHTML = "Waiting for players..."
        }

        if (gameTTTInfos.status === "start"){
            checkWinner()
            document.querySelector("#btnCancel-x").disabled = true
            document.querySelector("#btnCancel-o").disabled = true
            const boxes = document.querySelectorAll(".table-col")
            boxes.forEach(box => {box.addEventListener("click", inputBox)})
            boxes.forEach(box => {box.onclick = ()=>{}})

            
            // let playerPawnNum = data.val()+`.${player}._Pawn`
            // playerPawn.innerHTML = playerPawnNum
            // console.log(playerPawnNum)

            
        }
        else if (gameTTTInfos.status === "finish") {
            document.querySelector("#btnCancel-x").disabled = true
            document.querySelector("#btnCancel-o").disabled = true
            const boxes = document.querySelectorAll(".table-col")
            boxes.forEach(box => {box.removeEventListener("click", inputBox)})
            announceModal.style.display = 'block'
        }
        else if (gameTTTInfos.status === "change") {
            checkWinner()
            document.querySelector("#btnStartGame").disabled = true
            document.querySelector("#btnCancel-x").disabled = true
            document.querySelector("#btnCancel-o").disabled = true
            const boxes = document.querySelectorAll(".table-col")
            boxes.forEach(box => {box.removeEventListener("click", inputBox)})
            boxes.forEach(box => {box.onclick = function(){

                if(gameTTTInfos.status != "change") return false
                
                if(isKeep == true){
                    if((box.innerHTML).includes('X') || (box.innerHTML).includes('O')){
                        alert(`This box is already filled.`)
                        return false
                    }
                    box.innerHTML = "<p class='display-4'>" + gameTTTInfos.turn + "</p>"
                    let id = box.id
                    refTTT.child("game-1").child("tables").update({
                        [id]: gameTTTInfos.turn
        
                    })
                    if(gameTTTInfos.turn == 'X'){
                        refTTT.child("game-1").update({
                            turn: "O"
                        })
                    }else{
                        refTTT.child("game-1").update({
                            turn: "X"
                        })
                    }
                    isKeep = false
                    gameTTTInfos.status = "start"
                    
                    refTTT.child("game-1").update({
                        status: "start",
                    })

                }else{
                    changePosition(this)
                }
            };})
        }
        else if (gameTTTInfos.status === "switch") {
            checkWinner()

            document.querySelector("#btnStartGame").disabled = true
            document.querySelector("#btnCancel-x").disabled = true
            document.querySelector("#btnCancel-o").disabled = true
            const boxes = document.querySelectorAll(".table-col")
            boxes.forEach(box => {box.removeEventListener("click", inputBox)})
            boxes.forEach(box => {
                if(box.innerHTML == "<p class='display-4'>X</p>"){
                    console.log(box)
                    //document.querySelector(`#${box} p`).innerHTML = 'O'
                    refTTT.child("game-1").child("tables").update({
                        [id]: 'O'
        
                    })
                }else if(box.innerHTML == "<p class='display-4'>O</p>"){
                    console.log(box)
                    //document.querySelector(`#${box} p`).innerHTML = 'X'
                    refTTT.child("game-1").child("tables").update({
                        [id]: 'X'
        
                    })
                }
            })
        }
        else{
            document.querySelector("#btnCancel-x").disabled = false
            document.querySelector("#btnCancel-o").disabled = false
            const boxes = document.querySelectorAll(".table-col")
            boxes.forEach(box => {box.removeEventListener("click", inputBox)})
        }

        if (gameTTTInfos.tables){
            for (const box in gameTTTInfos.tables){
                document.querySelector(`#${box} p`).innerHTML = gameTTTInfos.tables[box]
            }
        }
        else{
            const boxes = document.querySelectorAll(".table-col p")
            boxes.forEach(box => {box.innerHTML = ""})
        }

        if (gameTTTInfos.winner == "draw"){
            announceModal.style.display = 'flex'
            document.querySelector("#winTag").style.display = 'none'
            document.querySelector("#playerWinner").innerHTML = `GAME DRAW`
        }
        else if (gameTTTInfos.winner){
            announceModal.style.display = 'flex'
            announceModal.addEventListener('shown.bs.modal', function () {
                document.querySelector("#playerWinner").innerHTML = `Player ${gameTTTInfos.winner}`
                announceModal.focus()
            })
            
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
            let matchEmail = `player_${player}`
            
            refTTT.child('game-1').update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email
            })

            refInfo.once("value", snapshot => {
                dataInfo = snapshot.val()
                refInfo.child('game-1').update({
                    gameID: 1,
                    [matchEmail]: currentUser.email,
                    o_Pawn : 0,
                    o_EX : 0,
                    x_Pawn : 0,
                    x_EX : 0,
                    status: "start",
                    turn: "x",
                    tables: "",      
                })
                // data = snapshot.val()
                // if (data === null) {
                //     refInfo.child('game-1').update({
                //         o_Pawn : 0,
                //         o_EX : 0,
                //         x_Pawn : 0,
                //         x_EX : 0,
                //         status: "start",
                //         turn: "x",
                //         tables: "",
                //         player_x: dataInfo['game-1']['player_x'],
                //         player_o: dataInfo['game-1']['player_o'],
                //     })
                //     this.turn = data['turn']
                //     console.log(this.turn)
                // }
                // this.turn = data['turn']
                // console.log(this.turn)
                
            })
            playerSign.innerHTML = `${player}`.toUpperCase()

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
            refTTT.child('game-1').child(tmpID).remove()
            refTTT.child('game-1').child(tmpEmail).remove()
            refInfo.child('game-1').remove()
            console.log(`delete on id: ${currentUser.uid}`);
            document.querySelector(`#btnJoin-${player}`).disabled = false
        }
    }
}

const nextBtn = document.querySelector("#goToTTT");
nextBtn.addEventListener("click", goToTTT)

function goToTTT(event){
    refTTT.child("game-1").update({
        status: "start",
        turn: "X",
        tables: ""
    })

    matching.style.display = 'none'
    userTab.style.display = 'flex'
    ttt.style.display = 'flex'
}

btnLogout.addEventListener("click", terminateGame)
fromAnnounceToStatBtn.addEventListener("click", terminateGame)
fromAnnounceToWaitBtn.addEventListener("click", terminateGame)
toStatBtn.addEventListener("click", terminateGame)
toWaitBtn.addEventListener("click", terminateGame)

function terminateGame(event){
    // refTTT.child("game-1").child("status").remove()
    // refTTT.child("game-1").child("turn").remove()
    // refTTT.child("game-1").child("tables").remove()
    // refTTT.child("game-1").child("winner").remove()
    // refTTT.child("game-1").child("user-o-email").remove()
    // refTTT.child("game-1").child("user-x-email").remove()
    // refTTT.child("game-1").child("user-o-id").remove()
    // refTTT.child("game-1").child("user-x-id").remove()
    refTTT.child("game-1").remove()
    refInfo.child("game-1").remove()
}

function inputBox(event){
    refTTT.child("game-1").once("value", snapshot => {
        data = snapshot.val()
        currentUser = firebase.auth().currentUser
        id = event.currentTarget.id
        if (data.turn === "X" && data["user-x-email"] === currentUser.email && !data["tables"][id]){
            refTTT.child("game-1").child("tables").update({
                [id]: data.turn
                
            })
            refTTT.child("game-1").update({
                turn: "O"
                //o_Pawn: phraseInt(data.o_Pawn) - 1
            })
            const pawn = data.x_Pawn
            refTTT.child('game-1').update({
                x_Pawn: pawn-1,

            })
        }
        else if (data.turn === "O" && data["user-o-email"] === currentUser.email && !data["tables"][id]){
            refTTT.child("game-1").child("tables").update({
                [id]: data.turn
            })
            refTTT.child("game-1").update({
                turn: "X"
            })
            const pawn = data.o_Pawn
            refTTT.child('game-1').update({
                o_Pawn: pawn-1,

            })
        }
    })
}

function checkWinner(){
    refTTT.child("game-1").once("value", snapshot => {
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
                refTTT.child("game-1").update({
                    status: "finish",
                    winner: turn
                })
                id = data[`user-${turn.toLowerCase()}-id`]
                refTTTScore.once("value", snapshot => {
                    scores = snapshot.val()
                    if (!scores || !scores[id]){
                        refTTTScore.child(currentUser.uid).update({
                            [id]: 1
                        })
                    }
                    else{
                        score = scores[id]
                        refTTTScore.child(currentUser.uid).update({
                            [id]: parseInt(score) + 1
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
                refTTT.child("game-1").update({
                    status: "finish",
                    winner: "draw"
                })

                id1 = data[`user-x-id`]
                id2 = data[`user-o-id`]

                // refTTTScore.once("value", snapshot => {
                //     scores = snapshot.val()
                //     if (!scores || !scores[id1]){
                //         refTTTScore.update({
                //             [id1]: 1
                //         })
                //     }
                //     else{
                //         score = scores[id1]
                //         refTTTScore.update({
                //             [id1]: parseInt(score) + 1
                //         })
                //     }

                //     if (!scores || !scores[id2]){
                //         refTTTScore.update({
                //             [id2]: 1
                //         })
                //     }
                //     else{
                //         score = scores[id2]
                //         refTTTScore.update({
                //             [id2]: parseInt(score) + 1
                //         })
                //     }
                //     return
                // })
                id = data[`user-${turn.toLowerCase()}-id`]
                refTTTScore.once("value", snapshot => {
                    scores = snapshot.val()
                    if (!scores || !scores[id]){
                        refTTTScore.child(currentUser.uid).update({
                            draw: 1
                        })
                    }
                    else{
                        score = scores[id]
                        refTTTScore.child(currentUser.uid).update({
                            draw: parseInt(score) + 1
                        })
                    }
                })
            }
        }
    })
}

const btnChangePosition = document.querySelector("#btnChangePosition");
btnChangePosition.addEventListener("click", chooseChangePosition)

function chooseChangePosition(event){
    refTTT.child("game-1").update({
        status: "change"
    })

}

const btnSwitchPawn = document.querySelector("#btnSwitchPawn");
btnSwitchPawn.addEventListener("click", switchPawn)

function switchPawn(event){
    refTTT.child("game-1").update({
        status: "switch"
    })

}

let isKeep = false;

function changePosition(that){


    refTTT.child("game-1").once("value", snapshot => {
        data = snapshot.val() //db objects
        currentUser = firebase.auth().currentUser
        //id1 = this.currentTarget.id //row-1-col-1
        

        if (data.turn === "X" && data["user-x-email"] === currentUser.email && data["tables"][that.id]){
            refTTT.child("game-1").child("tables").update({
                [that.id]: ``

            })
            document.querySelector(`#${that.id} p`).innerHTML = ''
            console.log('1')
            isKeep = true;
            // if(document.querySelector(`#${that.id} p`).innerHTML = ''){
            //     ref.child("game-1").child("tables").update({
            //         [id1]: data.turn
            //     })
            // }

        }
        else if (data.turn === "O" && data["user-o-email"] === currentUser.email && data["tables"][that.id]){
            refTTT.child("game-1").child("tables").update({
                [that.id]: ``

            })
            document.querySelector(`#${that.id} p`).innerHTML = ''
            console.log('1')
            isKeep = true;
            // ref.child("game-1").child("tables").update({
            //     [id]: data.turn
            // })

        }
    })
}







//Matching Area     //Matching Area     //Matching Area     //Matching Area     //Matching Area     

const ref = firebase.database().ref("Games")
const refInfo = firebase.database().ref("GameInfo")



refInfo.on("value", snapshot => {
    getGameInfo(snapshot)
})

class MixOrMatch {
    constructor(cards) {
        this.cardsArray = cards;
        this.ticker = document.getElementById('flips');
    }

    startGame() {

        this.TwoPairCheck = "";
        this.UScore = 0;
        this.Score = 0;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        this.turn = "x"
        setTimeout(() => {
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
    }

    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;

            if (this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countdown);
        clearInterval(this.UScore);

        document.getElementById('game-over-text').classList.add('visible');
    }
    victory() {
        clearInterval(this.countdown);
        document.getElementById('victory-text').classList.add('visible');
    }
    hideCards() {
        this.cardsArray.forEach(cards => {
            cards.classList.remove('visible');
            cards.classList.remove('matched');
        });
    }
    flipCard(cards) {
        refInfo.child('game-1').once("value", snapshot => {
            const data = snapshot.val()
            const currentUser = firebase.auth().currentUser
            const id = cards.id

            if (data["turn"] === "x" && data["player_x"] === currentUser.email && !data["tables"][id]) {
                console.log("เข้า")
                this.totalClicks++;
                console.log(`คลิ้กทั้งหมด${this.totalClicks}`);
                refInfo.child('game-1').child("tables").update({
                    [id]: data.turn

                })
                if (this.cardToCheck) {
                    this.ca
                    this.checkForCardMatch(cards);

                } else {
                    this.cardToCheck = cards
                }
                if (this.totalClicks === 2) {


                    this.turn = "o";

                    refInfo.child('game-1').update({
                        turn: this.turn,
                    })
                    this.totalClicks = 0

                }
            }

            if (data["turn"] === "o" && data["player_o"] === currentUser.email && !data["tables"][id]) {
                this.totalClicks++;
                console.log(`คลิ้กทั้งหมด${this.totalClicks}`);
                refInfo.child('game-1').child("tables").update({
                    [id]: data.turn

                })
                if (this.cardToCheck) {
                    this.checkForCardMatch(cards);

                } else {
                    this.cardToCheck = cards;
                }
                if (this.totalClicks === 2) {
                    this.turn = "x";
                    this.totalClicks = 0
                    refInfo.child('game-1').update({
                        turn: this.turn,
                    })

                }
            }
        })
    }
    checkForCardMatch(cards) {
        console.log(`this.cards:${this.getCardType(cards)}`)
        console.log(`this.cardToCheck:${this.getCardType(this.cardToCheck)}`)
        if (this.getCardType(cards) === this.getCardType(this.cardToCheck)) {
            if (this.getCardType(cards) === this.TwoPairCheck) {
                refInfo.child('game-1').once("value", snapshot => {
                    const data = snapshot.val()
                    const currentUser = firebase.auth().currentUser
                    if(data.player_o === currentUser.email){
                        const ExScore = data.o_EX
                        refInfo.child('game-1').update({
                            o_EX: ExScore+1,
                        })
                    }
                    else if(data.player_x === currentUser.email){
                        const ExScore = data.x_EX
                        refInfo.child('game-1').update({
                            x_EX: ExScore+1,
                        })
                    }
                })
            }
            this.cardMatch(cards, this.cardToCheck);
            this.totalClicks = 0
            this.TwoPairCheck = this.getCardType(cards);

        }
        else
            this.cardMismatch(cards, this.cardToCheck);
        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        refInfo.child('game-1').once("value", snapshot => {
            const currentUser = firebase.auth().currentUser
            const data = snapshot.val()
            if(data.player_o === currentUser.email){
                const score = data.o_Pawn
                
                refInfo.child('game-1').update({
                    o_Pawn: score+1,
                })
            }
            else if(data.player_x === currentUser.email){
                const score = data.x_Pawn
                refInfo.child('game-1').update({
                    x_Pawn: score+1,

                })
            }
        })
        refInfo.child('game-1').child("tables").update({
            [card1.id]: `player_${this.turn}`,
            [card2.id]: `player_${this.turn}`
        })
        card1.classList.add('matched');
        card2.classList.add('matched');

        if (this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card1, card2) {
        console.log(card1)
        console.log(card2)
        refInfo.child('game-1').once("value", snapshot => {
            const data = snapshot.val()
            refInfo.child('game-1').child("tables").child(card1.id).remove()
            refInfo.child('game-1').child("tables").child(card2.id).remove()
            refInfo.child('game-1').child("remove").update({
                [card1.id]: "",
                [card2.id]: ""
            })
        })
        this.busy = true;
        setTimeout(() => {
            this.TwoPairCheck = " ";
            this.busy = false;
        }, 1000);
    }
    shuffleCards(cardsArray) {
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));

            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }
    getCardType(cards) {
        return cards.getElementsByClassName('card-value')[0].src;

    }
    canFlipCard(cards) {
        return !this.busy && !this.matchedCards.includes(cards) && cards !== this.cardToCheck;
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    refInfo.once("value", snapshot => {
        dataInfo = snapshot.val()
        refInfo.child('game-1').once("value", snapshot => {
            data = snapshot.val()

            let overlays = Array.from(document.getElementsByClassName('overlay-text'));
            // let cards = Array.from(document.getElementsByClassName('cards'));
            const cards = document.querySelectorAll(".cards")
            let game = new MixOrMatch(cards);
            game.startGame();
            cards.forEach(cards => {
                cards.addEventListener('click', () => {
                    game.flipCard(cards);
                });
            });
        })
    })
}

function getGameInfo(snapshot) {
    refInfo.once("value", snapshot => {
        dataInfo = snapshot.val()

    })
    snapshot.forEach((data) => {
        const gameInfos = data.val()
        console.log(gameInfos)
        const currentUser = firebase.auth().currentUser
        console.log(gameInfos)
        if(gameInfos.player_o === currentUser.email){
                refInfo.child('game-1').update({
                    gameID: 1,
                    player_o: currentUser.email,
                })
            
                console.log('scoreUpdate')
                document.getElementById("UltraScore").innerText = `${gameInfos.o_EX}`;
                document.getElementById("Score").innerText = `${gameInfos.o_Pawn}`;
                
        }
        else if(gameInfos.player_x === currentUser.email){
                refInfo.child('game-1').update({
                    gameID: 1,
                    player_x: currentUser.email,
                })
                
            
                console.log('scoreUpdate')
                document.getElementById("UltraScore").innerText = `${gameInfos.x_EX}`;
                document.getElementById("Score").innerText = `${gameInfos.x_Pawn}`;
                
        }
        if (gameInfos.turn) {
            document.getElementById("turn").innerText = `${gameInfos.turn}`;
        }
        if (gameInfos.tables) {
            for (const box in gameInfos.tables) {
                document.getElementById(`${box}`).classList.add('visible')
            }
        }
        if (!gameInfos.tables) {
            refInfo.child('game-1').update({
                tables: "",
            })
        }
        if (gameInfos.remove) {
            setTimeout(() => {
                for (const del in gameInfos.remove) {
                    document.getElementById(`${del}`).classList.remove('visible')
                }
                refInfo.child('game-1').child("remove").remove()
            }, 1000);
        }
        if (data.child('tables').numChildren() === 36) {
            refInfo.child('game-1').update({
                status : 'end'
            
            })
            document.getElementById("turn").innerText = `End`;
            
        }
        if(gameInfos.status === 'end'){
            if(parseInt(gameInfos.o_Pawn) < 5 ){
                refInfo.child(`game-1`).update({
                    o_Pawn : 5,
                    x_Pawn : 13,
                })
            }
            else if(parseInt(gameInfos.x_Pawn) < 5 ){
                refInfo.child(`game-1`).update({
                    x_Pawn : 5,
                    o_Pawn : 13,
                })
            }
        }
        refTTT.child('game-1').update({
            
            x_Pawn: gameInfos.x_Pawn,
            o_Pawn: gameInfos.o_Pawn,
            x_EX: gameInfos.x_EX,
            o_EX: gameInfos.o_EX,
        })
        // if (currentUser) {
        // const btnJoinID = event.currentTarget.getAttribute("id")
        // const player = btnJoinID[btnJoinID.length - 1]

        // const playerForm = document.getElementById(`inputPlayer-${player}`);
        // if (playerForm.value == "") {
        //     let tmpID = `user-${player}-id`
        //     let tmpEmail = `user-${player}-email`
        //     refInfo.child('game-1').update({
        //         [tmpID]: currentUser.uid,
        //         [tmpEmail]: currentUser.email
        //     })

        //     event.currentTarget.disabled = true;
        // }
        //  }
    })
}


function loadInfo(user) {
    const currentUser = firebase.auth().currentUser
    console.log(currentUser.email)
    // refInfo.child('game-1').update({
    //     gameID: 1,
    //     player_x: "thitipol32@gmail.com",
    //     player_o: "thitipol3@gmail.com",
    // })
    refInfo.once("value", snapshot => {
        dataInfo = snapshot.val()

        refInfo.child('game-1').once("value", snapshot => {
            data = snapshot.val()
            if (data === null) {
                refInfo.child('game-1').update({
                    o_Pawn : 0,
                    o_EX : 0,
                    x_Pawn : 0,
                    x_EX : 0,
                    status: "start",
                    turn: "x",
                    tables: "",
                    player_x: dataInfo['game-1']['player_x'],
                    player_o: dataInfo['game-1']['player_o'],
                })
                this.turn = data['turn']
                console.log(this.turn)
            }
            this.turn = data['turn']
            console.log(this.turn)
        })
    })
}




//Matching Area     //Matching Area     //Matching Area     //Matching Area     //Matching Area     