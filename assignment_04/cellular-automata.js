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

//Function to draw the boxes given a row
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
        // box.style.border = "0.5px solid black";
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
    //Get the binary of the rule
    var binary = ruleToBinary(rule);

    //Get the results of the cases from the rule
    var case7 = binary[0];
    var case6 = binary[1];
    var case5 = binary[2];
    var case4 = binary[3];
    var case3 = binary[4];
    var case2 = binary[5];
    var case1 = binary[6];
    var case0 = binary[7];

    //Create a new array to hold the new configuration
    var newConfig = new Array(config.length);

    //Iterate through each cell and apply the rule
    for (let i = 0; i < config.length; i++) {
        // Store the left value (and check for edge case)
        if (i == 0) {
            var left = config[config.length - 1];
        } else {
            var left = config[i - 1];
        }

        // Store the middle value 
        var middle = config[i];

        // Store the right value (and check for edge case)
        if (i == config.length - 1) {
            var right = config[0];
        } else {
            var right = config[i + 1];
        } 

        // Check the cases
        if (left == 1 && middle == 1 && right == 1) {
            newConfig[i] = case7;
        } else if (left == 1 && middle == 1 && right == 0) {
            newConfig[i] = case6;
        } else if (left == 1 && middle == 0 && right == 1) {
            newConfig[i] = case5;
        } else if (left == 1 && middle == 0 && right == 0) {
            newConfig[i] = case4;
        } else if (left == 0 && middle == 1 && right == 1) {
            newConfig[i] = case3;
        } else if (left == 0 && middle == 1 && right == 0) {
            newConfig[i] = case2;
        } else if (left == 0 && middle == 0 && right == 1) {
            newConfig[i] = case1;
        } else if (left == 0 && middle == 0 && right == 0) {
            newConfig[i] = case0;
        }
    }

    // Return the new configuration
    return newConfig;
}

// Function to draw the automata
function drawAutomata(config, rule) {
    // Make the header
    createHeader(rule);
    
    // Create the grid
    for (let i = 0; i < 50; i++) {
        drawBoxes(config);
        config = applyRule(config, rule);
    }
}