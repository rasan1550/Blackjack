// Prelaoder JS
let loader = document.querySelector('#loader')

window.addEventListener('load', () => {
    loader.classList.add('disppear')
})

// Popup JS
let popup = document.querySelector('#popup')
let popupCloseBtn = document.querySelector('#popup-close')

popupCloseBtn.addEventListener('click', () => {
    popup.classList.add('disppear')
})

// BlackJack JS
let blackjackGame = {
    'player' : {'scoreSpan' : '#player-score', 'div' : '#player', 'score' : 0},
    'dealer' : {'scoreSpan' : '#dealer-score', 'div' : '#dealer', 'score' : 0},
    'card' : ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'],
    'cardsMap' : {'2' : 2, '3' : 3, '4' : 4, '5' : 5, '6' : 6, '7' : 7, '8' : 8, '9' : 9, '10' : 10, 'jack' : 10, 'queen' : 10, 'king' : 10, 'ace' : [1,11]},
    'wins' : 0,
    'loses' : 0,
    'draws' : 0,
    'hitClicked' : false,
    'isStand' : false,
    'turnsOver' : false,
}

const Player = blackjackGame['player']
const Dealer = blackjackGame['dealer']

let hitSound = new Audio('dist/sounds/swish.m4a')
let winSound = new Audio('dist/sounds/cash.mp3')
let lostSound = new Audio('dist/sounds/aww.mp3')

let hitButton = document.querySelector('#hit-button')
let standButton = document.querySelector('#stand-button')
let dealButton = document.querySelector('#deal-button')

hitButton.addEventListener('click', blackjackHit)
standButton.addEventListener('click', dealerLogic)
dealButton.addEventListener('click', blackjackDeal)


function randomCard(){
    let cardIndex = Math.floor(Math.random() * 13)
    return blackjackGame['card'][cardIndex]
}

function blackjackHit(){
    if(blackjackGame['isStand'] === false){
        let card = randomCard()
        showCard(Player, card)
        updateScore(Player, card)
        showScore(Player)
        blackjackGame['hitClicked'] = true
    }
}

function showCard(active,card){
    if(active['score'] <= 21){
        let cardImg = document.createElement('img')
        document.querySelector(active['div']).appendChild(cardImg)
        cardImg.src = `dist/img/spade-${card}.webp`
        hitSound.play()
    }
}

function blackjackDeal(){
    if(blackjackGame['turnsOver'] === true){
        removeCard(Player)
        removeCard(Dealer)

        scoreReset(Player)
        scoreReset(Dealer)

        blackjacResults.textContent = `Let's play`
        blackjacResults.style.color = '#EEF2FF'

        blackjackGame['hitClicked'] = false
        blackjackGame['isStand'] = false
        blackjackGame['turnsOver'] = false
    }
}

function removeCard(active){
    let cards = document.querySelector(active['div']).querySelectorAll('img')
    cards.forEach(element => {
        element.remove()
    });
}

function updateScore(active,card){
    if(card === 'ace'){
        if(active['score'] + blackjackGame['cardsMap'][card][1] <= 21){
            active['score'] += blackjackGame['cardsMap'][card][1]
        }else{
            active['score'] += blackjackGame['cardsMap'][card][0]
        }
    }else{
        active['score'] += blackjackGame['cardsMap'][card]
    }
}

function showScore(active){
    let scoreSpan = document.querySelector(active['scoreSpan'])
    if(active['score'] > 21){
        scoreSpan.textContent = 'Bust!'
        scoreSpan.style.color = '#FD5D5D'
    }else{
        scoreSpan.textContent = active['score']
    }
}

function scoreReset(active){
    active['score'] = 0
    let scoreSpan = document.querySelector(active['scoreSpan'])
    scoreSpan.textContent = 0
    scoreSpan.style.color = '#EEF2FF'
}

function sleep(ms){
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

async function dealerLogic (){
    if(blackjackGame['hitClicked'] === true){
        blackjackGame['isStand'] = true
        while(Dealer['score'] < 16 && blackjackGame['isStand'] === true){
            let card = randomCard()
            showCard(Dealer, card)
            updateScore(Dealer, card)
            showScore(Dealer)
            await sleep(1000)
        }
        blackjackGame['turnsOver'] = true
        let winner = computeWinner()
        showResult(winner)
    }
}

function computeWinner(){
    let playerScore = Player['score'],
        dealerScore = Dealer['score'],
        winner
    if(playerScore <= 21){
        if(playerScore > dealerScore || dealerScore > 21){
            winner = Player
            blackjackGame['wins']++
        }else if(dealerScore > playerScore){
            winner = Dealer
            blackjackGame['loses']++
        }else if(playerScore === dealerScore){
            blackjackGame['draws']++
        }
    }else if(playerScore > 21 && dealerScore > 21){
        blackjackGame['loses']++
    }else if(playerScore > 21 && dealerScore <= 21){
        winner = Dealer
        blackjackGame['loses']++
    }
    return winner

}

let blackjacResults = document.querySelector('#results')
function showResult(winner){
    let message, messageColor,
        tableWins = document.querySelector('#wins'),
        tableLoses = document.querySelector('#loses'),
        tableDraws = document.querySelector('#draws')

    if(winner === Player){
        tableWins.textContent = blackjackGame['wins']
        message = 'You won!'
        messageColor = '#6ECB63'
        winSound.play()
    }else if(winner === Dealer){
        tableLoses.textContent = blackjackGame['loses']
        message = 'You Lost!'
        messageColor = '#FD5D5D'
        lostSound.play()
    }else{
        tableDraws.textContent = blackjackGame['draws']
        message = 'You Draw!'
        messageColor = '#FFD124'
    }
    blackjacResults.textContent = message
    blackjacResults.style.color = messageColor
}