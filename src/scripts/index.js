function initializeGame() {
    triesLeft = 6;
    manParts = 0;
    gameOver = false;
    drawNewButtons();
    pickWord();
    makePuzzle();
    threeD ? drawMan3D(gl, programInfo, buffers) : drawMan(canvasWidth, canvasHeight, manParts);
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
                (word[i] === letter) ? puzzle_update = puzzle_update + letter : puzzle_update = puzzle_update + puzzle[i];
            }
            puzzle = puzzle_update;
            document.getElementById("puzzle").innerText = puzzle;
        }
        else {
            manParts += 1;
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
        threeD ? drawMan3D(gl, programInfo, buffers) : drawMan(canvasWidth, canvasHeight, manParts);
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

const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

function initBuffers(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -1.0, 1.0,
        1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);
    return {
        position: positionBuffer,
    };
}

function drawMan3D(gl, programInfo, buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things


  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = glMatrix.mat4.create();

  glMatrix.mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);
  const modelViewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate

  {
    const numComponents = 2;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next
                              // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

let word, puzzle;
let wordList = [];
let triesLeft, manParts;
let canvas, ctx, gl = '';
let canvasWidth, canvasHeight = 0;
let main, gameBoard, modalContainer, resultsModal, modalText, modalHeader, closeButton = '';
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let threeD = false;

window.onload = (event) => {
    main = document.getElementById("main");
    gameBoard = document.getElementById("game-board");
    modalContainer = document.getElementById("modal-container");
    resultsModal = document.getElementById("results-modal");
    modalText = document.getElementById("modal-text");
    modalHeader = document.getElementById("modal-header");
    closeButton = document.getElementById("close-button");
    canvas = document.getElementById("canvas");
    window.addEventListener('resize', (event) => {
        canvas.setAttribute('width', canvasWidth.toString());
        canvas.setAttribute('height', canvasHeight.toString());
        canvasWidth = gameBoard.offsetWidth;
        canvasHeight = gameBoard.offsetHeight;
        threeD ? drawMan3D(gl, programInfo, buffers) : drawMan(canvasWidth, canvasHeight, manParts);
    })
    closeButton.addEventListener('click', function() {
        modalContainer.style.display = "none";
        initializeGame();
    })
    canvasWidth = gameBoard.offsetWidth;
    canvasHeight = gameBoard.offsetHeight;
    canvas.setAttribute('width', canvasWidth.toString());
    canvas.setAttribute('height', canvasHeight.toString());
    //ctx = canvas.getContext('2d');
    gl = canvas.getContext('webgl');
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it. Using 2d Canvas instead.");
        threeD = false;
        ctx = canvas.getContext('2d');
    } else {
        threeD = true;
    }
    let buffers = initBuffers(gl);
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };
    threeD ? drawMan3D(gl, programInfo, buffers) : drawMan(canvasWidth, canvasHeight, manParts);
    getWords();
}

