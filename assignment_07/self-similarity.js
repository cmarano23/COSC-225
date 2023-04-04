const SVG_NS = "http://www.w3.org/2000/svg";

const HALF = 50;
const QUARTER = 25;
const SCALE_HALF = 0.5;

const svg = document.querySelector("#recursive-triangles");
const triangleGroup = document.querySelector("#triangle-group");
const defs = document.querySelector("#triangle-defs");

// Base number of triangles
let numTriangles = 5;

// Color Scheme Tracker
let bwColor = true;

let drawIteration = function (depth, parentGroup, maxNumTri) {    
	updateDepth();
	if (depth == 0){
		let branch = document.createElementNS(SVG_NS, "use");
		branch.setAttributeNS(null, "href", "#base-triangle");
		if (bwColor){
			branch.setAttributeNS(null, "fill", "black");
		} else {
			branch.setAttributeNS(null, "fill", "white");
		}

		parentGroup.appendChild(branch);

		let thisGroup = document.createElementNS(SVG_NS, "g");
		parentGroup.appendChild(thisGroup);
		drawIteration(depth+1, thisGroup, maxNumTri);
	} else {
        
		let branch = document.createElementNS(SVG_NS, "use");
		branch.setAttributeNS(null, "href", "#triangle-basic");
		branch.setAttributeNS(null, "fill", getColor(depth));

		parentGroup.appendChild(branch);

		// Top
		if (depth < maxNumTri) {
			let thisGroup = document.createElementNS(SVG_NS, "g");
			thisGroup.setAttributeNS(null, "transform", `translate(${QUARTER}, ${HALF}) scale(${SCALE_HALF}, ${SCALE_HALF})`);
			parentGroup.appendChild(thisGroup);
			drawIteration(depth+1, thisGroup, maxNumTri);
		}

		// Left
		if (depth < maxNumTri) {
			let thisGroup = document.createElementNS(SVG_NS, "g");
			thisGroup.setAttributeNS(null, "transform", `translate(0, 0) scale(${SCALE_HALF}, ${SCALE_HALF})`);
			parentGroup.appendChild(thisGroup);
			drawIteration(depth+1, thisGroup, maxNumTri);
		}

		// Right
		if (depth < maxNumTri) {
			let thisGroup = document.createElementNS(SVG_NS, "g");
			thisGroup.setAttributeNS(null, "transform", `translate(${HALF}, 0) scale(${SCALE_HALF}, ${SCALE_HALF})`);
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
	// If the color scheme is black and white, set the color to white. Otherwise, follow rainbow color scheme.
	if (bwColor) {
		return "white";
	} else {
		// Figure out color based on depth
		if (depth % 8 == 0) {
			return "red";
		} else if (depth % 7 == 0) {
			return "violet";
		} else if (depth % 6 == 0) {
			return "indigo";
		} else if (depth % 5 == 0) {
			return "blue";
		} else if (depth % 4 == 0) {
			return "green";
		} else if (depth % 3 == 0) {
			return "yellow";
		} else if (depth % 2 == 0) {
			return "orange";
		} else {
			return "red";
		}
	}
};

// Function to switch the color scheme
let switchColorScheme = function () {
	if (bwColor){
		bwColor = false;
	} else {
		bwColor = true;
	}
	reset();
	drawIteration(0, triangleGroup, numTriangles);
};

// Draw the initial
drawIteration(0, triangleGroup, numTriangles);