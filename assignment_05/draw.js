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

// Function to draw the line
function drawLine(e) {
    console.log("you clicked to draw a line")
    // Set x1 and y1
    let x1 = e.clientX - rect.left;
    let y1 = e.clientY - rect.top;
    // Create line element and assign x1 and y1
    var line = document.createElementNS(ns, "line");
    line.setAttributeNS(null, "x1", x1);
    line.setAttributeNS(null, "y1", y1);
    console.log("you started drawing a line with start point: x = " + x1 + "y = " + y1);
    line.classList.add("line");
    // Use mousemove event listener to dynamically update x2 and y2
    box.addEventListener("mousemove", function followLine(e) {
        // Set x2 and y2 to the current mouse position
        x2 = e.clientX - rect.left;
        y2 = e.clientY - rect.top;
        if (drawing) {
            // If you are supposed to be drawing, set the end of the line
            line.setAttributeNS(null, "x2", x2);
            line.setAttributeNS(null, "y2", y2);
            console.log("Set x2: " + x2 + "\nSet y2: " + y2)
            box.appendChild(line);
        } else {
            // If not supposed to be drawing, remove this event listener
            box.removeEventListener("mousemove",followLine);
        }
    });
}

// Function to stop drawing
function stopDrawing(e) {
    console.log("Stopping draw due to second click")
    drawDot(e);
    clearUp();
}

// Function to draw a dot
function drawDot(e) {
    console.log("you drew a dot!");
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let dot = document.createElementNS(ns, "circle");
    dot.setAttributeNS(null, "cx", x);
    dot.setAttributeNS(null, "cy", y);
    dot.setAttributeNS(null, "r", 15);
    dot.classList.add("dot");
    box.appendChild(dot);
}

// Function to remove a dot
function clearDot() {
    console.log("you cleared a dot!");
    let dot = document.querySelector(".dot");
    dot.remove();
}

// Function used to clear the dot when the mouse is no longer pressed (as seen in Prof. Rosenbaum's video)
function clearUp() {
    box.addEventListener("mouseup", function wipe() {
        clearDot();
        box.removeEventListener("mouseup", wipe);
    });
}