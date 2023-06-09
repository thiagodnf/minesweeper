import StopWatch from "./game/StopWatch.js";
import Game from "./game/Game.js";
import RandomUtils from "./utils/RandomUtils.js";

let game = null;

let rows = 10;
let columns = 10;
let mines = 15;
let seed = new Date().getTime();

let squareSize = 40;

let stopWatch = new StopWatch();

let canvas = null;
let ctx = null;
let mouseX = 0.0;
let mouseY = 0.0;

let options = {
    showField: false,
    showMines: true,
    showHints: true,
    showFlags: true
};

function drawClosedCell(i, j) {

    let color = "green";

    if ((i + j) % 2 == 0) {
        color = "lightgreen";
    }

    drawSquare(i, j, color);
}

function drawVisibleCell(i, j) {

    let color = "#D2B99D";

    if ((i + j) % 2 == 0) {
        color = "#DBC0A0";
    }

    drawSquare(i, j, color);
}

function drawSquare(i, j, color = "white") {

    let x = j * squareSize;
    let y = i * squareSize;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, squareSize, squareSize);
}

function drawText(i, j, text, color = "red") {

    let x = j * squareSize;
    let y = i * squareSize;

    ctx.beginPath();

    ctx.font = "25px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, x + squareSize / 2, y + squareSize / 2);
}

function drawMines(i, j) {

    if (!options.showMines) {
        return;
    }

    drawText(i, j, "💣");
}

function drawFlags(i, j) {

    if (!options.showFlags) {
        return;
    }

    if (game.hasFlag(i, j)) {
        drawText(i, j, "🚩");
    }
}

function drawHints(i, j) {

    if (!options.showHints) {
        return;
    }

    let value = game.cells[i][j].hint;

    if (value == 1) {
        drawText(i, j, value, "blue");
    } else if (value == 2) {
        drawText(i, j, value, "green");
    } else if (value == 3) {
        drawText(i, j, value, "red");
    } else if (value == 4) {
        drawText(i, j, value, "darkblue");
    } else if (value == 5) {
        drawText(i, j, value, "darkred");
    } else if (value == 6) {
        drawText(i, j, value, "blue");
    } else if (value == 7) {
        drawText(i, j, value, "green");
    } else if (value == 8) {
        drawText(i, j, value, "red");
    }
}

function drawCanvas() {

    for (let i = 0; i < game.rows; i++) {

        for (let j = 0; j < game.columns; j++) {

            drawVisibleCell(i, j);

            let cell = game.cells[i][j];

            if (game.hasMine(i, j)) {
                drawMines(i, j);
            } else {
                drawHints(i, j);
            }

            if (!options.showField) {
                if (!cell.visible) {
                    drawClosedCell(i, j);
                }
            }

            drawFlags(i, j);
        }
    }
}

function showAlert(title, msg) {

    $("#alert .modal-title").html(title);
    $("#alert .modal-body").html(msg);
    $("#alert").modal("show");

    document.getElementById("alert").addEventListener("hidden.bs.modal", event => {

        options.showField = $("#show-field").prop("checked");

        game.reset();
    });
}

function resetGame() {

    game = new Game(rows, columns, mines);

    game.on("win", function (game) {
        showAlert("Congratulations!", "You win!");
        stopWatch.stop();
    });

    game.on("loose", function () {
        options.showField = true;
        showAlert("=(", "You loose!");
        stopWatch.stop();
    });

    game.on("change", function (game) {
        $("#number-of-flags").text(game.availableFlags);
    });

    game.on("reset", function (game) {
        stopWatch.reset();
        stopWatch.start();
        $("#number-of-flags").text(game.availableFlags);
    });

    game.reset();
}

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCanvas();

    window.requestAnimationFrame(animate);
}

function init() {

    console.debug("Initializing game");

    canvas.width = columns * squareSize;
    canvas.height = rows * squareSize;

    resetGame();

    stopWatch.on("change", function (elapsedTime) {
        $("#elapsed-time").text(elapsedTime);
    });

    stopWatch.start();

    window.requestAnimationFrame(animate);
}


function resizeCanvas() {
    $(".card").height($(window).height() - 100);
}

$(function () {

    var url = new Url;

    rows = parseInt(url.query.rows || rows);
    columns = parseInt(url.query.columns || rows);
    mines = parseInt(url.query.mines || mines);
    seed = parseInt(url.query.seed || seed);

    RandomUtils.setSeed(seed);

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener("click", function (event) {

        event.preventDefault();

        const i = Math.floor(mouseY / squareSize);
        const j = Math.floor(mouseX / squareSize);

        game.leftClick(i, j);
    });

    canvas.addEventListener("contextmenu", function (event) {

        event.preventDefault();
        event.stopPropagation();

        const i = Math.floor(mouseY / squareSize);
        const j = Math.floor(mouseX / squareSize);

        game.rightClick(i, j);
    });

    $(window).resize(resizeCanvas).trigger("resize");

    $("#show-field").change(function () {
        options.showField = $(this).prop("checked");
    }).prop("checked", options.showField);

    $("#show-mines").change(function () {
        options.showMines = $(this).prop("checked");
    }).prop("checked", options.showMines);

    $("#show-hints").change(function () {
        options.showHints = $(this).prop("checked");
    }).prop("checked", options.showHints);

    $("#show-flags").change(function () {
        options.showFlags = $(this).prop("checked");
    }).prop("checked", options.showFlags);

    $("#seed").change(function () {
        seed = parseInt($(this).val());
        init();
    }).val(seed);

    $("#rows").change(function () {
        rows = parseInt($(this).val());
        init();
    }).val(rows);

    $("#columns").change(function () {
        columns = parseInt($(this).val());
        init();
    }).val(columns);

    $("#mines").change(function () {
        mines = parseInt($(this).val());
        init();
    }).val(mines);

    $("#btn-new-game").click(function () {
        init();
    });

    $("#btn-share").click(function () {

        let u = new Url;

        u.clearQuery();

        u.query.seed = seed;
        u.query.rows = rows;
        u.query.columns = columns;
        u.query.mines = mines;

        showAlert("<i class=\"bi bi-share me-2\"></i>Share", `<textarea rows="3" class="form-control">${u.toString()}</textarea>`);
    });

    init();
});
