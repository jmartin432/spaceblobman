function initializeGame() {
    triesLeft = 6;
    manParts = 0;
    gameOver = false;
    drawNoose();
    drawNewButtons();
    pickWord();
    makePuzzle();
    drawMan(canvasWidth, canvasHeight, manParts);
    document.getElementById("tries-left").innerText = "Tries Left: " + triesLeft;
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
    // ctx.fillRect(0, 0, 200, 400);
    // ctx.beginPath();
    // ctx.moveTo(20, 380);
    // ctx.lineTo(180, 380);
    // ctx.stroke();
    // ctx.lineTo(160, 380);
    // ctx.stroke();
    // ctx.lineTo(160, 20);
    // ctx.stroke();
    // ctx.lineTo(100, 20);
    // ctx.stroke();
    // ctx.lineTo(100, 60);
    // ctx.stroke();
}

function checkLetter(letter_index) {
    console.log(manParts)
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
            manParts += 1;
            if (triesLeft > 0){
                drawMan(canvasWidth, canvasHeight, manParts);
            }
            triesLeft -= 1;
            document.getElementById("tries-left").innerText = "Tries Left: " + triesLeft;
        }
        if (triesLeft === 0) {
            modalHeader.innerText = "You Lose"
            modalText.innerText = "The Word was " + word;
            modalContainer.style.display = "block";
        }
        if (word === puzzle) {
            modalHeader.innerText = "You Win!"
            modalText.innerText = "Great job";
            modalContainer.style.display = "block";
        }
    }
}

function drawMan(width, height, parts){
    let radius = width * 0.04;
    let startX = width * .75;
    let startY = height * .25
    let bodyLength = height * .2;
    let armStart = startY + radius + bodyLength * .1;
    let legStart = startY + radius + bodyLength;
    let armX = radius;
    let armY = radius;
    let legX = radius;
    let legY = radius;
    ctx.clearRect(0, 0, width, height)
    ctx.beginPath();
    if (parts === 0) return;
    ctx.strokeStyle = "blue";
    ctx.moveTo(startX, startY);
    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    parts--;
    if (parts === 0) return;
    ctx.moveTo(startX, startY + radius);
    ctx.lineTo(startX, startY + radius + bodyLength);
    ctx.stroke();
    parts--;
    if (parts === 0) return;
    ctx.moveTo(startX, armStart);
    ctx.lineTo(startX + armX, armStart + armY);
    ctx.stroke();
    parts--;
    if (parts === 0) return;
    ctx.moveTo(startX, armStart);
    ctx.lineTo(startX - armX, armStart + armY);
    ctx.stroke();
    parts--;
    if (parts === 0) return;
    ctx.moveTo(startX, legStart);
    ctx.lineTo(startX + legX, legStart + legY);
    ctx.stroke();
    parts--;
    if (parts === 0) return;
    ctx.moveTo(startX, legStart);
    ctx.lineTo(startX - legX, legStart + legY);
    ctx.stroke();
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
let manParts;
let gameOver;
let canvas, ctx = '';
let canvasWidth, canvasHeight = 0;
let threeD = true;
let modalContainer, resultsModal, modalText, modalHeader, closeButton = '';
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

window.onload = (event) => {
    window.addEventListener('resize', (event) => {
        canvas.setAttribute('width', canvasWidth.toString());
        canvas.setAttribute('height', canvasHeight.toString());
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        drawMan(canvasWidth, canvasHeight, manParts);
    })
    canvas = document.getElementById("canvas");
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.setAttribute('width', canvasWidth.toString());
    canvas.setAttribute('height', canvasHeight.toString());
    ctx = canvas.getContext('2d');
    // ctx = canvas.getContext('webgl');
    // if (ctx === null) {
    //     alert("Unable to initialize WebGL. Your browser or machine may not support it. Using 2d Canvas instead.");
    //     ctx = canvas.getContext('2d');
    //     threeD = false;
    // }
    modalContainer = document.getElementById("modal-container");
    resultsModal = document.getElementById("results-modal");
    modalText = document.getElementById("modal-text");
    modalHeader = document.getElementById("modal-header");
    closeButton = document.getElementById("close-button");
    closeButton.addEventListener('click', function() {
        modalContainer.style.display = "none";
        initializeGame();
    })
    getWords();
}
