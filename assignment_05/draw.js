// Namespace
const ns = "http://www.w3.org/2000/svg";

// Drawing Box
const box = document.querySelector("#draw-box");
const rect = box.getBoundingClientRect();

// Var to track if drawing is active
var drawing = false;

// Event Listener to track a click
box.addEventListener("mousedown", clicked);

// Clicked function
function clicked(e) {
    // If not already drawing, start drawing line
    if (!drawing) {
        drawing = true;
        console.log("var drawing set to true")
        drawDot(e);
        clearUp();
        drawLine(e);
    // If already drawing, stop drawing the line
    } else {
        drawing = false;
        console.log("var drawing set to false")
        stopDrawing(e)
    }
}

function drawLine(e) {
    console.log("you clicked to draw a line")
    let x1 = e.clientX - rect.left;
    let y1 = e.clientY - rect.top;
    var line = document.createElementNS(ns, "line");
    line.setAttributeNS(null, "x1", x1);
    line.setAttributeNS(null, "y1", y1);
    console.log("you started drawing a line with start point: x = " + x1 + "y = " + y1);
    line.classList.add("line");
    box.addEventListener("mousemove", function followLine(e) {
        x2 = e.clientX - rect.left;
        y2 = e.clientY - rect.top;
        if (drawing) {
            line.setAttributeNS(null, "x2", x2);
            line.setAttributeNS(null, "y2", y2);
            console.log("Set x2: " + x2 + "\nSet y2: " + y2)
            box.appendChild(line);
        } else {
            box.removeEventListener("mousemove",followLine);
            console.log("else test");
        }
    });
}

function stopDrawing(e) {
    console.log("Stopping draw due to second click")
    drawDot(e);
    clearUp();
}

function drawDot(e) {
    console.log("you drew a dot!");
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let dot = document.createElementNS(ns, "circle");
    dot.setAttributeNS(null, "cx", x);
    dot.setAttributeNS(null, "cy", y);
    dot.classList.add("dot");
    box.appendChild(dot);
}

function clearDot() {
    console.log("you cleared a dot!");
    let dot = document.querySelector(".dot");
    dot.remove();
}

function clearUp() {
    box.addEventListener("mouseup", function wipe() {
        clearDot();
        box.removeEventListener("mouseup", wipe);
    });
}