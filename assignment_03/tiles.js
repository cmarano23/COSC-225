function drawTiles() {
    const boxElement = document.querySelector(".grid-box");
    for (let i = 0; i < 10; i++) {
        var r = i * 10;
        var g = i * 25;
        var b = 90;
        for (let j = 0; j < 10; j++) {
            b = b + (j * 15)
            let box = document.createElement("div");
            box.id = "grid-box"
            box.style.position = "relative";
            box.style.float = "left";
            box.style.width = "50px";
            box.style.height = "50px";
            box.style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";
            boxElement.appendChild(box);
        }
    }
}