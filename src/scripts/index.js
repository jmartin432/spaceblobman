function initializeGame() {
    let start = 0.0;
    triesLeft = 6;
    manParts = 0;
    colorList = Array.from(colorListInit);
    drawNewButtons();
    pickWord();
    makePuzzle();
    document.getElementById('tries-left').innerText = 'Tries Left: ' + triesLeft;
    function render(now) {
        now *= .001;
        if (start === undefined)
            start = now;
        const elapsed = now - start;
        threeD ? drawMan3D(gl, programInfo, buffers, elapsed) : drawMan(canvasWidth, canvasHeight, manParts);
        window.requestAnimationFrame(render);
    }
    window.requestAnimationFrame(render);
}

function drawNewButtons(){
    document.getElementById('buttons').innerHTML = '';
    for (let i = 0; i < 26; i++) {
        let btn = document.createElement('BUTTON');
        let id_string = '' + i + '';
        btn.classList.add('letter');
        btn.setAttribute('id', id_string);
        btn.setAttribute('onClick', 'checkLetter(this.id)');
        btn.innerHTML = '<b>' + alphabet[i] + '</b>';
        document.querySelector('#buttons').appendChild(btn);
    }
}

function pickWord(){
    let random = Math.floor((Math.random() * wordList.length));
    word = wordList[random];
}

function makePuzzle(){
    puzzle = '';
    for (let i = 0; i < word.length; i++) {
        puzzle += '_';
    }
    document.getElementById('puzzle').innerText = puzzle;
}

function checkLetter(letter_index) {
    console.log(manParts)
    let index_string = letter_index.toString();
    let btn = document.getElementById(index_string);
    btn.classList.add('animate');
    $(btn).on('animationend', function() {$(this).removeClass('animate');});
    let letter = alphabet[letter_index];
    let puzzle_update = '';
    let class_list = btn.classList.toString();
    if((class_list.indexOf('picked') < 0)) {
        setTimeout(function() {btn.classList.add('picked');}, 1100);
        if (word.includes(letter)) {
            for (let i = 0; i < word.length; i++) {
                (word[i] === letter) ? puzzle_update = puzzle_update + letter : puzzle_update = puzzle_update + puzzle[i];
            }
            puzzle = puzzle_update;
            document.getElementById('puzzle').innerText = puzzle;
        }
        else {
            manParts += 1;
            triesLeft -= 1;
            switch(manParts) {
                case 1:
                    colorList[0] = 0.0;
                    colorList[1] = 1.0;
                    colorList[2] = 0.1;
                    break;
                case 2:
                    colorList[3] = 0.0;
                    colorList[4] = 1.0;
                    colorList[5] = 0.1;
                    colorList[6] = 0.0;
                    colorList[7] = 1.0;
                    colorList[8] = 0.1;
                    colorList[9] = 0.0;
                    colorList[10] = 1.0;
                    colorList[11] = 0.1;
                    break;
                case 3:
                    colorList[12] = 0.0;
                    colorList[13] = 1.0;
                    colorList[14] = 0.1;
                    colorList[15] = 0.0;
                    colorList[16] = 1.0;
                    colorList[17] = 0.1;
                    break;
                case 4:
                    colorList[18] = 0.0;
                    colorList[19] = 1.0;
                    colorList[20] = 0.1;
                    colorList[21] = 0.0;
                    colorList[22] = 1.0;
                    colorList[23] = 0.1;
                    break;
                case 5:
                    colorList[24] = 0.0;
                    colorList[25] = 1.0;
                    colorList[26] = 0.1;
                    colorList[27] = 0.0;
                    colorList[28] = 1.0;
                    colorList[29] = 0.1;
                    break;
                case 6:
                    colorList[30] = 0.0;
                    colorList[31] = 1.0;
                    colorList[32] = 0.1;
                    colorList[33] = 0.0;
                    colorList[34] = 1.0;
                    colorList[35] = 0.1;
                    break;
                default:
                // code block
            }
            console.log(colorList)
            document.getElementById('tries-left').innerText = 'Tries Left: ' + triesLeft;
        }
        if (triesLeft === 0) {
            modalHeader.innerText = 'You Lose'
            modalText.innerText = 'The Word was ' + word;
            modalContainer.style.display = 'block';
        }
        if (word === puzzle) {
            modalHeader.innerText = 'You Win!'
            modalText.innerText = 'Great job';
            modalContainer.style.display = 'block';
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
    ctx.strokeStyle = 'blue';
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
    $.ajax({ method: 'GET', url: 'https://raw.githubusercontent.com/jmartin432/hangman/master/src/assets/english-words.txt'})
    .done(function(data) {
        data = data.split('\n');
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
    
    void main() {
        gl_Position = aVertexPosition;
  }
`;

const fsSource = `
    precision mediump float;
    
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec3 uColors[12];
    
    vec3 blob(vec2 uv, vec3 color, vec2 speed, vec2 amp, vec2 offset, float size, float time) {
        vec2 point = vec2(sin(speed.x * time) * amp.x + offset.x, cos(speed.y * time) * amp.y + offset.y);
    
        float d = 1.0 / distance(uv, point) / size;
        d = pow(d / 8.5, 2.5);

        return vec3(color.r * d, color.g * d, color.b * d);
    }
    
    void main() {
    vec2 uv = gl_FragCoord.xy/uResolution * 2.0 - 1.0;
    float time = uTime * 0.75;
    
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    // head
    color.rgb += blob(uv, vec3(uColors[0].r, uColors[0].g, uColors[0].b), vec2(2.2, 2.4), vec2(0.03, 0.03), vec2(0.1, 0.7), 1.4, time);
    //body
    color.rgb += blob(uv, vec3(uColors[1].r, uColors[1].g, uColors[1].b), vec2(2.25, 2.35), vec2(0.03, 0.03), vec2(0.1, 0.5), 1.4, time);
    color.rgb += blob(uv, vec3(uColors[2].r, uColors[2].g, uColors[2].b), vec2(2.3, 2.1), vec2(0.03, 0.03), vec2(0.1, 0.3), 1.4, time);
    color.rgb += blob(uv, vec3(uColors[3].r, uColors[3].g, uColors[3].b), vec2(2.15, 2.0), vec2(0.03, 0.03), vec2(0.1, 0.1), 1.4, time);
    //right arm
    color.rgb += blob(uv, vec3(uColors[4].r, uColors[4].g, uColors[4].b), vec2(2.5, 2.15), vec2(0.03, 0.03), vec2(0.2, 0.45), 1.4, time);
    color.rgb += blob(uv, vec3(uColors[5].r, uColors[5].g, uColors[5].b), vec2(2.2, 2.45), vec2(0.03, 0.03), vec2(0.3, 0.35), 1.4, time);
    //left arm
    color.rgb += blob(uv, vec3(uColors[6].r, uColors[6].g, uColors[6].b), vec2(2.05, 2.1), vec2(0.03, 0.03), vec2(0.0, 0.45), 1.4, time);
    color.rgb += blob(uv, vec3(uColors[7].r, uColors[7].g, uColors[7].b), vec2(2.4, 2.2), vec2(0.03, 0.03), vec2(-0.1, 0.35), 1.4, time);
    //right leg
    color.rgb += blob(uv, vec3(uColors[8].r, uColors[8].g, uColors[8].b), vec2(2.0, 2.2), vec2(0.03, 0.03), vec2(0.2, 0.05), 1.4, time);
    color.rgb += blob(uv, vec3(uColors[9].r, uColors[9].g, uColors[9].b), vec2(2.3, 2.15), vec2(0.03, 0.03), vec2(0.3, -0.05), 1.4, time);
    //left arm
    color.rgb += blob(uv, vec3(uColors[10].r, uColors[10].g, uColors[10].b), vec2(2.22, 2.38), vec2(0.03, 0.03), vec2(0.0, 0.05), 1.4, time);
    color.rgb += blob(uv, vec3(uColors[11].r, uColors[11].g, uColors[11].b), vec2(2.17, 2.02), vec2(0.03, 0.03), vec2(-0.1, -0.05), 1.4, time);
    
    gl_FragColor = color;
  }
`;

function initBuffers(gl) {
    const quadVertices = [
        -1, -1,  // first triangle
         1, -1,
        -1,  1,
        -1,  1,  // second triangle
         1, -1,
         1,  1,
    ];
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVertices), gl.STATIC_DRAW);

    return {
        quad: quadBuffer
    };
}

function drawMan3D(gl, programInfo, buffers, time = 0.0) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0,0,canvas.width,canvas.height);

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
        [-0.0, 0.0, -1.0]);  // amount to translate

    {
        const numComponents = 2;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
                                  // 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.quad);
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

    gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);
    gl.uniform1f(programInfo.uniformLocations.time, time);
    gl.uniform3fv(programInfo.uniformLocations.colors, colorList);


    {
        const vertexCount = 6
        //const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
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
    console.log(shaderProgram);
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
let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let threeD = false;
let buffers = {};
let shaderProgram = {};
let programInfo = {};
const colorListInit = [
    0.0, 0.0, 0.1,
    0.0, 0.0, 0.1,
    0.0, 0.0, 0.1,
    0.0, 0.0, 0.1,
    0.0, 0.0, 0.1,
    0.0, 0.0, 0.1,
    0.0, 0.0, 0.1,
    0.0, 0.0, 0.1,
    0.0, 0.0, 0.1,
    0.0, 0.0, 0.1,
    0.0, 0.0, 0.1,
    0.0, 0.0, 0.1
];
let colorList = Array.from(colorListInit);

window.onload = (event) => {
    main = document.getElementById('main');
    gameBoard = document.getElementById('game-board');
    modalContainer = document.getElementById('modal-container');
    resultsModal = document.getElementById('results-modal');
    modalText = document.getElementById('modal-text');
    modalHeader = document.getElementById('modal-header');
    closeButton = document.getElementById('close-button');
    canvas = document.getElementById('canvas');
    window.addEventListener('resize', (event) => {
        canvas.setAttribute('width', canvasWidth.toString());
        canvas.setAttribute('height', canvasHeight.toString());
        canvasWidth = gameBoard.offsetWidth;
        canvasHeight = gameBoard.offsetHeight;
        threeD ? drawMan3D(gl, programInfo, buffers) : drawMan(canvasWidth, canvasHeight, manParts);
    })
    closeButton.addEventListener('click', function() {
        modalContainer.style.display = 'none';
        initializeGame();
    })
    canvasWidth = gameBoard.offsetWidth;
    canvasHeight = gameBoard.offsetHeight;
    canvas.setAttribute('width', canvasWidth.toString());
    canvas.setAttribute('height', canvasHeight.toString());
    //ctx = canvas.getContext('2d');
    gl = canvas.getContext('webgl');
    if (gl === null) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it. Using 2d Canvas instead.');
        threeD = false;
        ctx = canvas.getContext('2d');
    } else {
        threeD = true;
    }
    buffers = initBuffers(gl);
    shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            resolution: gl.getUniformLocation(shaderProgram, 'uResolution'),
            time: gl.getUniformLocation(shaderProgram, 'uTime'),
            colors: gl.getUniformLocation(shaderProgram, 'uColors')
        },
    };
    threeD ? drawMan3D(gl, programInfo, buffers, 0.0) : drawMan(canvasWidth, canvasHeight, manParts);
    getWords();
}

