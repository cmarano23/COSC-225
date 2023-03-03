const ns = "http://www.w3.org/2000/svg";

const box = document.querySelector("#draw-box");
box.addEventListener("click", drawLine);

function drawLine(e) {
    console.log("you clicked to draw a line")
    drawDot(e);
    let rect = box.getBoundingClientRect();
    let x1 = e.clientX - rect.left;
    let y1 = e.clientY - rect.top;
    box.addEventListener("mousemove", followLine(e, x1, y1));
    clearDot(e);
    box.addEventListener("click", stopDraw);
}

function followLine(e, x1, y1) {
    console.log("you are drawing a line!");
    let rect = box.getBoundingClientRect();
    let x2 = e.clientX - rect.left;
    let y2 = e.clientY - rect.top;
    let line = document.createElementNS(ns, "line");
    line.setAttributeNS(null, "x1", x1);
    line.setAttributeNS(null, "y1", y1);
    line.setAttributeNS(null, "x2", x2);
    line.setAttributeNS(null, "y2", y2);
    console.log("you drew a line!");
    followLine(e, x2, y2);
}

function stopDraw(e) {
    box.removeEventListener("mousemove", followLine);
    box.removeEventListener("click", stopDraw);
}

function drawDot(e) {
    console.log("you drew a dot!");
    let rect = box.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let dot = document.createElementNS(ns, "circle");
    dot.setAttributeNS(null, "cx", x);
    dot.setAttributeNS(null, "cy", y);
    dot.classList.add("dot");
    box.appendChild(dot);
}

function clearDot(e) {
    console.log("you cleared a dot!");
    let dot = document.querySelector(".dot");
    dot.remove();
}