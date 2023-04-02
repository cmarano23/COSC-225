const SVG_NS = "http://www.w3.org/2000/svg";

const MAX_NUM_TRI = 7;
const BASE_SIZE = 100;
const HALF = 50;
const QUARTER = 25;

const svg = document.querySelector("#recursive-triangles");
const triangleGroup = document.querySelector("#triangle-group");
const defs = document.querySelector("#triangle-defs");

let drawIteration = function (depth, parentGroup) {    
    if (depth == 0){
        let branch = document.createElementNS(SVG_NS, "use");
        branch.setAttributeNS(null, "href", "#base-triangle");
        branch.setAttributeNS(null, "fill", "black");

        parentGroup.appendChild(branch);

        let thisGroup = document.createElementNS(SVG_NS, "g");
        parentGroup.appendChild(thisGroup);
        drawIteration(depth+1, thisGroup);
    } else {
        
        let branch = document.createElementNS(SVG_NS, "use");
        branch.setAttributeNS(null, "href", "#triangle-basic");
        branch.setAttributeNS(null, "fill", "white");

        parentGroup.appendChild(branch);

        // Top
        if (depth < MAX_NUM_TRI) {
            let thisGroup = document.createElementNS(SVG_NS, "g");
            thisGroup.setAttributeNS(null, "transform", 'translate(25, 50) scale(0.5, 0.5)');
            parentGroup.appendChild(thisGroup);
            drawIteration(depth+1, thisGroup);
        }

        // Left
        if (depth < MAX_NUM_TRI) {
            let thisGroup = document.createElementNS(SVG_NS, "g");
            thisGroup.setAttributeNS(null, "transform", 'translate(0, 0) scale(0.5, 0.5)');
            parentGroup.appendChild(thisGroup);
            drawIteration(depth+1, thisGroup);
        }

        // Right
        if (depth < MAX_NUM_TRI) {
            let thisGroup = document.createElementNS(SVG_NS, "g");
            thisGroup.setAttributeNS(null, "transform", 'translate(50, 0) scale(0.5, 0.5)');
            parentGroup.appendChild(thisGroup);
            drawIteration(depth+1, thisGroup);
        }
    }
}

drawIteration(0, triangleGroup);