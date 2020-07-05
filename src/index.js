function initializeGame() {
    drawNoose();
    drawNewButtons();
    pickWord();
    makePuzzle();
    triesLeft = 6;
    document.getElementById("tries-left").innerText = "Tries Left: " + triesLeft;
    game_over = false;
}

function drawNewButtons(){
    document.getElementById("buttons").innerHTML = "";
    for (let i = 0; i < 26; i++) {
        let btn = document.createElement("BUTTON");
        let id_string = "" + i + "";
        btn.classList.add("letter");
        btn.setAttribute("id", id_string);
        btn.setAttribute("onClick", "checkLetter(this.id)");
        btn.innerHTML = '<b>' + alphabet[i] + '</b>';
        document.querySelector("#buttons").appendChild(btn);
    }
}

function pickWord(){
    let random = Math.floor((Math.random() * wordList.length));
    word = wordList[random];
}

function makePuzzle(){
    puzzle = "";
    for (let i = 0; i < word.length; i++) {
        puzzle += "_";
    }
    document.getElementById("puzzle").innerText = puzzle;
}

function drawNoose(){
    ctx.fillStyle = "pink";
    ctx.strokeStyle = "green";
    ctx.fillRect(0, 0, 200, 400);
    ctx.beginPath();
    ctx.moveTo(20, 380);
    ctx.lineTo(180, 380);
    ctx.stroke();
    ctx.lineTo(160, 380);
    ctx.stroke();
    ctx.lineTo(160, 20);
    ctx.stroke();
    ctx.lineTo(100, 20);
    ctx.stroke();
    ctx.lineTo(100, 60);
    ctx.stroke();
}

function checkLetter(letter_index) {
    let index_string = letter_index.toString();
    let btn = document.getElementById(index_string);
    btn.classList.add("animate");
    $(btn).on("animationend", function() {$(this).removeClass("animate");});
    let letter = alphabet[letter_index];
    let puzzle_update = "";
    let class_list = btn.classList.toString();
    if((class_list.indexOf("picked") < 0)) {
        setTimeout(function() {btn.classList.add("picked");}, 1100);
        if (word.includes(letter)) {
            for (let i = 0; i < word.length; i++) {
                if (word[i] === letter) {
                    puzzle_update = puzzle_update + letter;
                }
                else {
                    puzzle_update = puzzle_update + puzzle[i];
                }
            }
            puzzle = puzzle_update;
            document.getElementById("puzzle").innerText = puzzle;
        }
        else {
            if (triesLeft > 0){
                drawMan();
            }
            triesLeft -= 1;
            document.getElementById("tries-left").innerText = "Tries Left: " + triesLeft;
        }
        if (triesLeft === 0) {
            modalHeader.innerText = "You Lose"
            modalText.innerText = "The Word was " + word;
            resultsModal.style.display = "block";
        }
        if (word === puzzle) {
            modalHeader.innerText = "You Win!"
            modalText.innerText = "Great job";
            resultsModal.style.display = "block";
        }
    }
}

function drawMan(){
    switch (triesLeft){
        case 6:
            ctx.moveTo(125, 85);
            ctx.arc(100, 85, 25, 0, 2 * Math.PI);
            ctx.stroke();
            break;
        case 5:
            ctx.moveTo(100, 110);
            ctx.lineTo(100, 220);
            ctx.stroke();
            break;
        case 4:
            ctx.moveTo(100, 140);
            ctx.lineTo(150, 150);
            ctx.stroke();
            break;
        case 3:
            ctx.moveTo(100, 140);
            ctx.lineTo(50, 150);
            ctx.stroke();
            break;
        case 2:
            ctx.moveTo(100, 220);
            ctx.lineTo(150, 270);
            ctx.stroke();
            break;
        case 1:
            ctx.moveTo(100, 220);
            ctx.lineTo(50, 270);
            ctx.stroke();
            break;
    }
}

function getWords () {
    $.ajax({ method: "GET", url: "https://raw.githubusercontent.com/jmartin432/hangman/master/src/assets/english-words.txt"})
    .done(function(data) {
        data = data.split("\n");
        wordList = data.filter(word => word.length > 8).map(word => word.toUpperCase())
        initializeGame();
    })
    .fail(function() {
        wordList = ['HOPSCOTCH', 'BAMBOOZLE', 'RHINOCEROS'];
        initializeGame();
    });
}

let word;
let wordList = [];
let puzzle;
let triesLeft;
let game_over;
let canvas = '';
let ctx = '';
let resultsModal = '';
let modalText = '';
let modalHeader = '';
let closeButton = '';
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

window.onload = (event) => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    resultsModal = document.getElementById("results-modal");
    modalText = document.getElementById("modal-text");
    modalHeader = document.getElementById("modal-header");
    closeButton = document.getElementById("close-button");
    closeButton.addEventListener('click', function() {
        resultsModal.style.display = "none";
        initializeGame();
    })
    getWords();
}
