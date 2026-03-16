const canvas = document.getElementById("drawCanvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function draw() {
    //context.fillStyle = 'white';
    //context.fillRect(0, 0, canvas.width, canvas.height);
}

//This function takes in an amount of time in seconds and an audio element's ID. It automatically starts the audio playing and fades in for the specified amount of time.

/*<!--     <script src="main.js"></script>
<button onclick="playAudio(3,'menuMusic')">Play Menu Loop</button>
<button onclick="stopAudio(3,'menuMusic')">Stop Menu Loop</button>
<audio id="menuMusic" loop="true" src="./assets/music/MenuLoop.mp3" type="audio/mpeg"> -->*/

function playAudio(fadeTime, elementID) {
    let audio = document.getElementById(elementID);
    audio.currentTime = 0;
    audio.volume = 0;
    audio.play();
    let fadeIn = setInterval(() => {
        if (audio.volume < 0.65) {
            audio.volume += 0.05;
        } else {
            audio.volume = 0.7;
        }
        console.log(`Current audio level: ${audio.volume}`);
    }, 50 * fadeTime);
    setTimeout(clearInterval, ((fadeTime * 1000) + 500), fadeIn);
}

function audioNotPlaying(elementID) {
    let audio = document.getElementById(elementID);
    return audio.paused;
}

//This function takes in an amount of time in seconds and an audio element's ID. It automatically stops the audio and fades out for the specified amount of time.
function stopAudio(fadeTime, elementID) {
    let audio = document.getElementById(elementID);
    audio.volume = 1;
    let fadeOut = setInterval(() => {
        if (audio.volume > 0.05) {
            audio.volume -= 0.05;
        } else {
            audio.volume = 0;
            audio.pause();
            audio.currentTime = 0;
        }
        console.log(`Current audio level: ${audio.volume}`);
    }, 50 * fadeTime);
    setTimeout(clearInterval, ((fadeTime * 1000) + 500), fadeOut);
}

let itemNametoImgLocation = {
    "Stone": "./assets/images/Rock Warm 2.png",
    "Paperclip": "./assets/images/Paperclip Warm.png",
    "Penny": "./assets/images/Penny Warm.png",
    "BinderClip": "./assets/images/Clip Warm.png",
    "Button": "./assets/images/Button Warm.png",
    "StoneFour": "./assets/images/Rock Warm 4.png"
}


//This is the code for the dragging functionality.
let counter = 0;
function dragObject(itemName) {
    if (document.getElementById("cursor").getAttribute("data-is-selected") == "false") {
        counter++;
        let draggedObject = document.createElement("img");
        draggedObject.src = itemNametoImgLocation[itemName];
        draggedObject.id = `${itemName}${counter}`;
        draggedObject.dataset.isSelected = "true";
        draggedObject.classList.add("allSpawnedImages");
        document.getElementById("spawnedImages").appendChild(draggedObject);
    }
}


function calcAngle(x1, y1, x2, y2) {
    let angle = (Math.atan2(y2, x2)) * (180 / Math.PI);
    return angle;
}

let oldLocation = { x: 0, y: 0};

document.addEventListener("mousemove", event => {
    if (audioNotPlaying("gardenLoop")) {
        playAudio(3, "gardenLoop");
    }
    let rakeCursor = document.getElementById("cursor");
    if (rakeCursor.getAttribute("data-is-selected") == "true") {
        rakeCursor.style.display = "initial";
        let calculatedAngle = calcAngle(oldLocation.x, oldLocation.y, (event.pageX - rakeCursor.width / 2), (event.pageY - rakeCursor.width / 2), oldLocation.angle);
        console.log(calculatedAngle);
        rakeCursor.style.transform = `translate(${event.pageX - rakeCursor.width / 2}px, ${event.pageY - rakeCursor.height / 2}px) rotate(${calculatedAngle}deg)`;
        oldLocation.x = event.pageX - rakeCursor.width / 2;
        oldLocation.y = event.pageY - rakeCursor.width / 2;
        document.body.style.cursor = "none";
    }
    Array.from(document.getElementsByClassName("allSpawnedImages")).forEach(element => {
        if (document.getElementById(element.id).getAttribute("data-is-selected") == "true") {
            element.style.transform = `matrix(0.7, 0, 0, 0.7, ${(event.pageX - element.width / 2)}, ${(event.pageY - element.height / 2)})`;
            element.style.opacity = 0.5;
        }
    });
}, false);

document.addEventListener("mousedown", event => {
    dragStartPosition = { x: event.pageX, y: event.pageY };
    Array.from(document.getElementsByClassName("allSpawnedImages")).forEach(element => {
        if (document.getElementById(element.id).getAttribute("data-is-selected") == "true") {
            element.style.opacity = 1;
            document.getElementById(element.id).setAttribute("data-is-selected", false);
        }
    });

}, false);


function startRake() {
    let rakeCursor = document.getElementById("cursor");
    if (rakeCursor.getAttribute("data-is-selected") == "true") {
        rakeCursor.dataset.isSelected = "false";
        rakeCursor.style.display = "none";
        document.body.style.cursor = "initial";
        Array.from(document.getElementsByClassName("icon")).forEach(element => {
            element.style.opacity = 1;
        });
    } else {
        rakeCursor.dataset.isSelected = "true";
        //Search through all of the navbar buttons and grey them out when the cursor is highlighted.
        Array.from(document.getElementsByClassName("icon")).forEach(element => {
            if (element.id != "rakeIcon") {
                element.style.opacity = 0.5;
            }
        });
    }

}