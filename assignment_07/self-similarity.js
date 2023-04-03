const SVG_NS = "http://www.w3.org/2000/svg";

const BASE_SIZE = 100;
const HALF = 50;
const QUARTER = 25;

const svg = document.querySelector("#recursive-triangles");
const triangleGroup = document.querySelector("#triangle-group");
const defs = document.querySelector("#triangle-defs");

// Base number of triangles
let numTriangles = 5;

let drawIteration = function (depth, parentGroup, maxNumTri) {    
	updateDepth();
	if (depth == 0){
		let branch = document.createElementNS(SVG_NS, "use");
		branch.setAttributeNS(null, "href", "#base-triangle");
		branch.setAttributeNS(null, "fill", "black");

		parentGroup.appendChild(branch);

		let thisGroup = document.createElementNS(SVG_NS, "g");
		parentGroup.appendChild(thisGroup);
		drawIteration(depth+1, thisGroup, maxNumTri);
	} else {
        
		let branch = document.createElementNS(SVG_NS, "use");
		branch.setAttributeNS(null, "href", "#triangle-basic");
		branch.setAttributeNS(null, "fill", "white");

		parentGroup.appendChild(branch);

		// Top
		if (depth < maxNumTri) {
			let thisGroup = document.createElementNS(SVG_NS, "g");
			thisGroup.setAttributeNS(null, "transform", "translate(25, 50) scale(0.5, 0.5)");
			parentGroup.appendChild(thisGroup);
			drawIteration(depth+1, thisGroup, maxNumTri);
		}

		// Left
		if (depth < maxNumTri) {
			let thisGroup = document.createElementNS(SVG_NS, "g");
			thisGroup.setAttributeNS(null, "transform", "translate(0, 0) scale(0.5, 0.5)");
			parentGroup.appendChild(thisGroup);
			drawIteration(depth+1, thisGroup, maxNumTri);
		}

		// Right
		if (depth < maxNumTri) {
			let thisGroup = document.createElementNS(SVG_NS, "g");
			thisGroup.setAttributeNS(null, "transform", "translate(50, 0) scale(0.5, 0.5)");
			parentGroup.appendChild(thisGroup);
			drawIteration(depth+1, thisGroup, maxNumTri);
		}
	}
};

// Function to increase the number of triangles
let increaseNumTriangles = function () {
	reset();
	numTriangles += 1;
	drawIteration(0, triangleGroup, numTriangles);
};

// Function to decrease the number of triangles
let decreaseNumTriangles = function () {
	if (numTriangles > 1) {
		reset();
		numTriangles -= 1;
		drawIteration(0, triangleGroup, numTriangles);
	}
};

// Function to reset the number of triangles
let reset = function () {
	while (triangleGroup.firstChild) {
		triangleGroup.removeChild(triangleGroup.firstChild);
	}
};

// Function to get the current depth
let updateDepth = function () {
	let text = document.getElementById("currentDepth");
	text.textContent = "Current Depth: " + numTriangles;
};

let getColor = function (depth) {
	let color = "rgb()";
};

// Draw the initial
drawIteration(0, triangleGroup, numTriangles);