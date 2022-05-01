const ref = firebase.database().ref("Games")
const refInfo = firebase.database().ref("GameInfo")



ref.on("value", snapshot => {
    getGameInfo(snapshot)
})
// function gameNumCheck(){
//     refInfo.once("value", snapshot => {
//         dataInfo = snapshot.val()
//         const gameNum = dataInfo['gameNumber']
//         console.log(gameNum)
//         return gameNum;
//     })

// }
// const gameNumber = gameNumCheck();
// console.log(gameNumber)


class AudioController {
    constructor() {
        // this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');
        // this.bgMusic.volume = 0.5;
        // this.bgMusic.loop = true;
    }
    // startMusic() {
    //     this.bgMusic.play();
    // }
    // stopMusic() {
    //     this.bgMusic.pause();
    //     this.bgMusic.currentTime = 0;
    // }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        // this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        // this.stopMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(cards) {
        this.cardsArray = cards;
        // this.totalTime = totalTime;
        // this.timeRemaining = totalTime;
        // this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }

    startGame() {
        this.gameNumber = 0;
        this.TwoPairCheck = "";
        this.UScore = 0;
        this.Score = 0;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        this.turn = "x"
        refInfo.once("value", snapshot => {
            dataInfo = snapshot.val()
            const gameNumber = dataInfo['gameNumber'];
            this.gameNumber = dataInfo['gameNumber'];
            ref.child(`game-${gameNumber}`).once("value", snapshot => {
                data = snapshot.val()
                this.turn = data['turn'];
                // document.getElementById("turn").innerText = this.turn;
            })
        })
        setTimeout(() => {
            // this.audioController.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        // this.shuffleCards(this.cardsArray);
        // this.hideCards();

        // this.timer.innerText = this.timeRemaining;
        // this.ticker.innerText = this.totalClicks;

       

        // document.getElementById("turn").innerText = this.turn;

    }

    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;

            // this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countdown);
        clearInterval(this.UScore);
        this.audioController.gameOver();

        document.getElementById('game-over-text').classList.add('visible');
    }
    victory() {
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }
    hideCards() {
        this.cardsArray.forEach(cards => {
            cards.classList.remove('visible');
            cards.classList.remove('matched');
        });
    }
    flipCard(cards) {
        ref.child(`game-${this.gameNumber}`).once("value", snapshot => {
            const data = snapshot.val()
            const currentUser = firebase.auth().currentUser
            const id = cards.id
            console.log(currentUser.email);
            console.log(data["turn"])
            console.log(data["player_x"])
            console.log(currentUser.email)

            if (data["turn"] === "x" && data["player_x"] === currentUser.email && !data["tables"][id]) {
                console.log("เข้า")
                this.audioController.flip();
                this.totalClicks++;
                console.log(`คลิ้กทั้งหมด${this.totalClicks}`);
                ref.child(`game-${this.gameNumber}`).child("tables").update({
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

                    ref.child(`game-${this.gameNumber}`).update({
                        turn: this.turn,
                    })
                    // document.getElementById("turn").innerText = this.turn;
                    this.totalClicks = 0

                }
            }

            if (data["turn"] === "o" && data["player_o"] === currentUser.email && !data["tables"][id]) {
                this.audioController.flip();
                this.totalClicks++;
                console.log(`คลิ้กทั้งหมด${this.totalClicks}`);
                ref.child(`game-${this.gameNumber}`).child("tables").update({
                    [id]: data.turn

                })
                if (this.cardToCheck) {
                    this.checkForCardMatch(cards);

                } else {
                    this.cardToCheck = cards;
                }
                if (this.totalClicks === 2) {


                    this.turn = "x";
                    // document.getElementById("turn").innerText = this.turn;
                    this.totalClicks = 0
                    ref.child(`game-${this.gameNumber}`).update({
                        turn: this.turn,
                    })

                }
            }
            //ตรงนี้
        })
        // if (this.canFlipCard(cards)) {
        //     this.audioController.flip();
        //     this.totalClicks++;
        //     console.log(this.totalClicks);
        //     // refInfo.child("gameNumber").remove()
        //     // document.getElementById("turn").innerText = this.turn;

        //     // this.ticker.innerText = this.totalClicks;
        //     // cards.classList.add('visible');

        //     if (this.cardToCheck) {
        //         this.checkForCardMatch(cards);

        //     } else {
        //         this.cardToCheck = cards;
        //     }
        //     if (this.totalClicks === 2) {
        //         if (this.turn === "x") {
        //             this.turn = "o";

        //             ref.child(`game-${this.gameNumber}`).update({
        //                 turn: this.turn,
        //             })
        //             // document.getElementById("turn").innerText = this.turn;
        //             this.totalClicks = 0
        //         }
        //         else {
        //             this.turn = "x";
        //             // document.getElementById("turn").innerText = this.turn;
        //             this.totalClicks = 0
        //             ref.child(`game-${this.gameNumber}`).update({
        //                 turn: this.turn,
        //             })
        //         }
        //     }
        // }
    }
    checkForCardMatch(cards) {
        console.log(`this.cards:${this.getCardType(cards)}`)
        console.log(`this.cardToCheck:${this.getCardType(this.cardToCheck)}`)
        if (this.getCardType(cards) === this.getCardType(this.cardToCheck)) {
            if (this.getCardType(cards) === this.TwoPairCheck) {
                ref.child(`game-${this.gameNumber}`).once("value", snapshot => {
                    const data = snapshot.val()
                    const currentUser = firebase.auth().currentUser
                    if(data.player_o === currentUser.email){
                        const ExScore = data.o_EX
                        ref.child(`game-${this.gameNumber}`).update({
                            o_EX: ExScore+1,
                        })
                    }
                    else if(data.player_x === currentUser.email){
                        const ExScore = data.x_EX
                        ref.child(`game-${this.gameNumber}`).update({
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
        ref.child(`game-${this.gameNumber}`).once("value", snapshot => {
            const currentUser = firebase.auth().currentUser
            const data = snapshot.val()
            if(data.player_o === currentUser.email){
                const score = data.o_Pawn
                
                ref.child(`game-1`).update({
                    o_Pawn: score+1,
                })
            }
            else if(data.player_x === currentUser.email){
                const score = data.x_Pawn
                ref.child(`game-1`).update({
                    x_Pawn: score+1,

                })
            }
        })
        ref.child(`game-${this.gameNumber}`).child("tables").update({
            [card1.id]: `player_${this.turn}`,
            [card2.id]: `player_${this.turn}`
        })
        card1.classList.add('matched');
        card2.classList.add('matched');

        this.audioController.match();
        // document.getElementById("Score").innerText = this.Score
        if (this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card1, card2) {
        console.log(card1)
        console.log(card2)
        ref.child(`game-${this.gameNumber}`).once("value", snapshot => {
            const data = snapshot.val()
            ref.child(`game-${this.gameNumber}`).child("tables").child(card1.id).remove()
            ref.child(`game-${this.gameNumber}`).child("tables").child(card2.id).remove()
            ref.child(`game-${this.gameNumber}`).child("remove").update({
                [card1.id]: "",
                [card2.id]: ""
            })
        })
        this.busy = true;
        setTimeout(() => {
            this.TwoPairCheck = " ";
            // card1.classList.remove('visible');
            // card2.classList.remove('visible');
            // document.getElementById(card1).classList.remove('visible')
            // document.getElementById(card2).classList.remove('visible')
            this.busy = false;
        }, 1000);
    }
    shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm.
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
        const gameNumber = dataInfo['gameNumber']
        ref.child(`game-${gameNumber}`).once("value", snapshot => {
            data = snapshot.val()
            const gameNumber = dataInfo['gameNumber']

            console.log(gameNumber)
            let overlays = Array.from(document.getElementsByClassName('overlay-text'));
            // let cards = Array.from(document.getElementsByClassName('cards'));
            const cards = document.querySelectorAll(".cards")
            let game = new MixOrMatch(cards);
            game.startGame();
            // overlays.forEach(overlay => {
            //     overlay.addEventListener('click', () => {
            //         overlay.classList.remove('visible');
            //         game.startGame();
            //     });
            // });
            // cards.forEach(cards => { cards.addEventListener("click", flipCard(cards)) });
            cards.forEach(cards => {
                cards.addEventListener('click', () => {
                    game.flipCard(cards);
                    //         // document.getElementById("turn").innerText = data['turn'];
                });
            });
        })
    })
}
function getGameInfo(snapshot) {
    refInfo.once("value", snapshot => {
        dataInfo = snapshot.val()
        this.gameNumber = dataInfo['gameNumber'];

    })
    snapshot.forEach((data) => {
        const gameInfos = data.val()
        const currentUser = firebase.auth().currentUser
        console.log(gameInfos)
        if(gameInfos.player_o === currentUser.email){
            
            
                console.log('scoreUpdate')
                document.getElementById("UltraScore").innerText = `${gameInfos.o_EX}`;
                document.getElementById("Score").innerText = `${gameInfos.o_Pawn}`;
            
        }
        else if(gameInfos.player_x === currentUser.email){
            
            
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
                // document.querySelector(`#${box} p`).innerHTML = gameInfos.tables[box]
            }
        }
        if (!gameInfos.tables) {
            ref.child(`game-1`).update({
                tables: "",
            })
        }
        if (gameInfos.remove) {
            setTimeout(() => {
                for (const del in gameInfos.remove) {
                    document.getElementById(`${del}`).classList.remove('visible')
                    // document.querySelector(`#${box} p`).innerHTML = gameInfos.tables[box]
                }
                ref.child(`game-${this.gameNumber}`).child("remove").remove()
            }, 1000);
        }
        if (data.child('tables').numChildren() === 36) {
            ref.child(`game-1`).update({
                status : 'end'
            
            })
            document.getElementById("turn").innerText = `End`;
            // console.log(gameInfos.player_o)
            // console.log(gameInfos.player_x)
            // console.log(currentUser.email)
            // if(gameInfos.player_o === currentUser.email){
                
            //     ref.child(`game-1`).update({
            //         o_Pawn : `${document.getElementById('Score').innerText}`,
            //         o_EX : `${document.getElementById('UltraScore').innerText}`
            //     })
            // }
            // if(gameInfos.player_x === currentUser.email){
               
            //     ref.child(`game-${this.gameNumber}`).update({
            //         x_Pawn : `${document.getElementById('Score').innerText}`,
            //         x_EX : `${document.getElementById('UltraScore').innerText}`
            //     })
            // }
            
        }
        // if (currentUser) {
        // const btnJoinID = event.currentTarget.getAttribute("id")
        // const player = btnJoinID[btnJoinID.length - 1]

        // const playerForm = document.getElementById(`inputPlayer-${player}`);
        // if (playerForm.value == "") {
        //     let tmpID = `user-${player}-id`
        //     let tmpEmail = `user-${player}-email`
        //     ref.child('game-1').update({
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
    refInfo.update({
        gameNumber: 1,
    })
    refInfo.child('game-1').update({
        gameID: 1,
        player_x: "thitipol32@gmail.com",
        player_o: "thitipol3@gmail.com",
    })
    refInfo.once("value", snapshot => {
        dataInfo = snapshot.val()
        const gameNumber = dataInfo['gameNumber']
        this.gameNumber = gameNumber;
        ref.child(`game-${gameNumber}`).once("value", snapshot => {
            data = snapshot.val()
            if (data === null) {
                ref.child(`game-${gameNumber}`).update({
                    o_Pawn : 0,
                    o_EX : 0,
                    x_Pawn : 0,
                    x_EX : 0,
                    status: "start",
                    turn: "x",
                    tables: "",
                    player_x: dataInfo[`game-${gameNumber}`]['player_x'],
                    player_o: dataInfo[`game-${gameNumber}`]['player_o'],
                })
                this.turn = data['turn']
                console.log(this.turn)
            }
            this.turn = data['turn']
            console.log(this.turn)
        })
    })
}




