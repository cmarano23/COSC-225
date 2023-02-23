// Function to change the rule int to binary
function ruleToBinary(rule) {
    var binary = rule.toString(2);
    while (binary.length < 8) {
        binary = "0" + binary;
    }
    return binary;
}

// Function to create the header with the Rule and Binary
function createHeader(rule) {
    const headerText = document.querySelector("#header-text");
    var binary = ruleToBinary(rule);
    let header = document.createElement("h1");
    header.id = "rule";
    header.textContent = "Cellular Automata with Rule " + rule + " (" + binary + ")";
    headerText.appendChild(header);
}

function drawBoxes(row) {
    const boxElement = document.querySelector("#grid-body");
    for (let i = 0; i < row.length; i++) {
        let box = document.createElement("div");
        box.id = "box";
        box.style.position = "relative";
        box.style.float = "left";
        box.style.margin = "auto";
        box.style.width = "10px";
        box.style.height = "10px";
        box.style.border = "0.5px solid black";
        if (row[i] == 1) {
            box.style.backgroundColor = "black";
        } else {
            box.style.backgroundColor = "white";
        }
        boxElement.appendChild(box);
    }
}

// Function to apply the rule to the grid
function applyRule(config, rule) {
    // Make the header
    createHeader(rule);

    var lenConfig = config.length;
    
    // Create a 2D array to hold the grid
    var rows = new Array(lenConfig);
    rows[0] = config;
    for (let j = 1; j < lenConfig; j++) {
        rows[j] = new Array(lenConfig).fill(0);
        for (let i = 0; i < lenConfig; i++) {
            
        }
    }

    // Draw the grid
    drawBoxes(rows[0]);
    drawBoxes(rows[1]);

}