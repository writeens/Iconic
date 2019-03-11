/* eslint-disable prefer-const */
// DOM Manipulation
const divIcons = document.querySelectorAll(".col div");
const icons = ["fa-twitter", "fa-facebook-f", "fa-instagram", "fa-tumblr", "fa-github", "fa-linkedin-in", "fa-medium-m", "fa-whatsapp", "fa-google-plus-g", "fa-free-code-camp", "fa-yahoo", "fa-codepen"];
const start = document.querySelector(".start-button");
const playAgain = document.querySelector(".play-again");
const i = document.querySelectorAll("i");
const time = document.querySelector(".time");
const mat = document.querySelector("#myBoard");
const intro = document.querySelector(".intro");
const outro = document.querySelector(".outro");
const timeText = document.querySelector(".time-text");
// pick at random eight icons and store it somewhere

function getNewIcons() {
    const newIcons = [];
    while (newIcons.length < i.length / 2) {
        let randomIcon = icons[Math.floor(Math.random() * icons.length)];
        if (newIcons.includes(randomIcon)) {
            randomIcon = icons[Math.floor(Math.random() * icons.length)];
        } else {
            newIcons.push(randomIcon);
        }
    }
    return newIcons;
}

function generatePositions() {
    const numbers = [];
    for (let j = 0; j < i.length; j += 1) {
        numbers.push(j);
    }
    return numbers;
}

// pick a random pair position
function getRandomPairPosition() {
    let position = generatePositions();
    let pairs = [];
    while (pairs.length < i.length / 2) {
        const randomPosX = position[Math.floor(Math.random() * position.length)];
        position.splice(position.indexOf(randomPosX), 1);
        const randomPosY = position[Math.floor(Math.random() * position.length)];
        position.splice(position.indexOf(randomPosY), 1);
        pairs.push([randomPosX, randomPosY]);
    }
    return pairs;
}

// attach the random icons to their pair positions
function attachIconsToPairs() {
    let gameIcons = getNewIcons();
    let positionPairs = getRandomPairPosition();
    let count = 0;
    for (let k = 0; k < positionPairs.length; k += 1) {
        i[positionPairs[k][0]].classList.add(`${gameIcons[count]}`);
        i[positionPairs[k][1]].classList.add(`${gameIcons[count]}`);
        count += 1;
    }
}

// Game Flow
attachIconsToPairs();

// event handler to start game
let intervalId = 0;
start.addEventListener("click", startGame);
function startGame() {
    mat.classList.remove("no-display");
    intro.classList.add("zoomOut");
    intro.classList.add("no-display");
    mat.classList.add("zoomIn");
    startTimer();
}

// Start Timer
function startTimer() {
    intervalId = setInterval(timer, 1000);
}
// Handle Timer
let currentTime = 0;
function timer() {
    currentTime += 1;
    time.textContent = `Time: ${currentTime} second(s)`;
}

divIcons.forEach((divIcon) => { divIcon.addEventListener("click", updateIcon); });

// variables
let [click, match] = [1, 0];
let [firstIcon, secondIcon] = ["", ""];
let [firstIconPosition, secondIconPosition, thirdIconPosition] = ["", "", ""];
// let firstNumber = "";

function updateIcon(e) {
    let node = e.target.childNodes[1];
    if (click % 2 !== 0) {
        if (firstIcon !== secondIcon) {
            // remove animation
            firstIconPosition.parentNode.parentNode.classList.remove("shake");
            secondIconPosition.parentNode.parentNode.classList.remove("shake");
            firstIconPosition.classList.add("hidden");
            secondIconPosition.classList.add("hidden");
        }
        firstIconPosition = node;
        if (thirdIconPosition === firstIconPosition) {
            firstIconPosition = thirdIconPosition;
        }
        // firstNumber = firstIconPosition.dataset.position;
        firstIconPosition.classList.remove("hidden");
        firstIcon = firstIconPosition.getAttribute("class");
        firstIconPosition.parentNode.removeEventListener("click", updateIcon);
    } else {
        // Handle user clicking same icon twice
        /* if (node.dataset.position === firstNumber) {
            return;
        } */

        secondIconPosition = node;
        secondIconPosition.classList.remove("hidden");
        secondIcon = secondIconPosition.getAttribute("class");
        secondIconPosition.parentNode.removeEventListener("click", updateIcon);

        if (firstIcon === secondIcon) {
            match += 1;
            firstIconPosition.parentNode.removeEventListener("click", updateIcon);
            secondIconPosition.parentNode.removeEventListener("click", updateIcon);
        } else {
            firstIconPosition.parentNode.parentNode.classList.add("shake");
            secondIconPosition.parentNode.parentNode.classList.add("shake");
            firstIconPosition.parentNode.addEventListener("click", updateIcon);
            secondIconPosition.parentNode.addEventListener("click", updateIcon);
        }
        thirdIconPosition = firstIconPosition;
    }
    click += 1;
    // Handle Score
    if (match === i.length / 2) {
        clearInterval(intervalId);
        timeText.textContent = `It took you ${currentTime} seconds to find the icons`;
        mat.classList.remove("zoomIn");
        mat.classList.add("zoomOut", "no-display");
        outro.classList.remove("zoomOut", "no-display");
        outro.classList.add("zoomIn");
        // divIcons.forEach((icon) => { icon.classList.add("unclickable"); });
    }
}


// Play Again Event
playAgain.addEventListener("click", resetBoard);

function resetBoard() {
    [click, match, currentTime] = [1, 0, 0];
    i.forEach((icon) => { icon.setAttribute("class", "fab hidden"); });
    // divIcons.forEach((divIcon) => { divIcon.classList.remove("unclickable"); });
    divIcons.forEach((divIcon) => { divIcon.addEventListener("click", updateIcon); });
    attachIconsToPairs();
    startTimer();
    outro.setAttribute("class", "outro d-flex justify-content-center align-items-center animated no-display");
    mat.classList.remove("zoomOut", "no-display");
    mat.classList.add("zoomIn");
}
