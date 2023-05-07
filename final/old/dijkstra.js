/* eslint-disable no-undef */
const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

// An object that represents a 2-d point, consisting of an
// x-coordinate and a y-coordinate. The `compareTo` function
// implements a comparison for sorting with respect to x-coordinates,
// breaking ties by y-coordinate.
function Point(x, y, id) {
	this.x = x;
	this.y = y;
	this.id = id;

	// Compare this Point to another Point p for the purposes of
	// sorting a collection of points. The comparison is according to
	// lexicographical ordering. That is, (x, y) < (x', y') if (1) x <
	// x' or (2) x == x' and y < y'.
	this.compareTo = function (p) {
		if (this.x > p.x) {
			return 1;
		}

		if (this.x < p.x) {
			return -1;
		}

		if (this.y > p.y) {
			return 1;
		}

		if (this.y < p.y) {
			return -1;
		}

		return 0;
	};

	// return a string representation of this Point
	this.toString = function () {
		return "(" + x + ", " + y + ")";
	};
}

// An object that represents a set of Points in the plane. The `sort`
// function sorts the points according to the `Point.compareTo`
// function. The `reverse` function reverses the order of the
// points. The functions getXCoords and getYCoords return arrays
// containing x-coordinates and y-coordinates (respectively) of the
// points in the PointSet.
function PointSet() {
	this.points = [];
	this.curPointID = 0;

	// create a new Point with coordintes (x, y) and add it to this
	// PointSet
	this.addNewPoint = function (x, y) {
		this.points.push(new Point(x, y, this.curPointID));
		this.curPointID++;
	};

	// add an existing point to this PointSet
	this.addPoint = function (pt) {
		this.points.push(pt);
	};

	// sort the points in this.points 
	this.sort = function () {
		this.points.sort((a, b) => { return a.compareTo(b); });
	};

	// reverse the order of the points in this.points
	this.reverse = function () {
		this.points.reverse();
	};

	// return an array of the x-coordinates of points in this.points
	this.getXCoords = function () {
		let coords = [];
		for (let pt of this.points) {
			coords.push(pt.x);
		}

		return coords;
	};

	// return an array of the y-coordinates of points in this.points
	this.getYCoords = function () {
		let coords = [];
		for (pt of this.points) {
			coords.push(pt.y);
		}

		return coords;
	};

	// get the number of points 
	this.size = function () {
		return this.points.length;
	};

	// return a string representation of this PointSet
	this.toString = function () {
		let str = "[";
		for (let pt of this.points) {
			str += pt + ", ";
		}
		str = str.slice(0, -2); 	// remove the trailing ', '
		str += "]";

		return str;
	};
}


//////////
function DijkstraViewer(svg, ps) {
	this.svg = svg;  // an svg object where the visualization is drawn
	this.ps = ps;    // a point set of the points to be visualized

	this.isStarted = false; // whether the algorithm has started

	this.pointElts = [];   // svg elements for vertices
	this.edgeElts = [];     // svg elements for edges
	this.edgeEltsId = [];   // svg elements for edges stored by id

	// Function to draw a dot
	this.drawPoint = function (x, y) {
		let pt = document.createElementNS(SVG_NS, "circle");
		pt.setAttributeNS(null, "cx", x);
		pt.setAttributeNS(null, "cy", y);
		pt.setAttributeNS(null, "r", 15);
		pt.classList.add("dot");
		svg.appendChild(pt);
		this.ps.addNewPoint(x, y);
		id = this.ps.points[this.ps.size() - 1].id;
		this.pointElts[pt.id] = pt;
		console.log("Added a point with x=" + x + " and y=" + y + " and id: " + id);
	};

	// Function to draw edge
	this.addEdge = function (pt1, pt2) {
		const edgeElt = document.createElementNS(SVG_NS, "line");
		edgeElt.setAttributeNS(null, "x1", pt1.x);
		edgeElt.setAttributeNS(null, "y1", pt1.y);
		edgeElt.setAttributeNS(null, "x2", pt2.x);
		edgeElt.setAttributeNS(null, "y2", pt2.y);
		edgeElt.classList.add("edge");
		edgeElt.id = "edge-" + pt1.id + "-" + pt2.id;
		this.edgeEltsId[edgeElt.id] = edgeElt;
		this.edgeElts.push(edgeElt);
		this.edgeGroup.appendChild(edgeElt);
		this.svg.appendChild(edgeElt);
	};

	// Function to remove edge
	this.removeEdge = function (edge) {
		if (this.svg.contains(edge)) {
			this.svg.removeChild(edge);
		}
	};

	// define the behavior for clicking on the svg element
	this.svg.addEventListener("click", (e) => {
		// get the x and y coordinates of the click
		const rect = this.svg.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		// draw a point at the click location
		this.drawPoint(x, y);
	});

	// create svg group for displaying edges
	this.edgeGroup = document.createElementNS(SVG_NS, "eg");
	this.edgeGroup.id = "edges";
	this.svg.appendChild(this.edgeGroup);

	// create svg group for displaying points
	this.pointGroup = document.createElementNS(SVG_NS, "pg");
	this.pointGroup.id = "points";
	this.svg.appendChild(this.pointGroup);

	// overlay points
	this.overlayPointsId = [];
	this.overlayPoints = [];

	// create svg group for displaying overlays
	this.overlayGroup = document.createElementNS(SVG_NS, "g");
	this.svg.appendChild(this.overlayGroup);

	// Function to add an overlay point
	this.addOverlayPoint = function (pt) {
		const elt = document.createElementNS(SVG_NS, "circle");
		elt.classList.add("overlay-vertex");
		elt.setAttributeNS(null, "cx", pt.x);
		elt.setAttributeNS(null, "cy", pt.y);
		elt.setAttributeNS(null, "r", 15);
		this.overlayGroup.appendChild(elt);
		this.overlayPointsId[pt.id] = elt;
		this.overlayPoints.push(pt);
	};

	// Function to remove overlay point
	this.removeOverlayPoint = function (pt) {
		const elt = this.overlayPointsId[pt.id];
		console.log("Removing overlay point " + pt.id);
		this.overlayPointsId[pt.id] = null;
		this.overlayGroup.removeChild(elt);
	};

	// Function to draw the final edges
	this.drawFinalEdges = function (neighbors) {
		for (let i = 0; i < neighbors.length - 1; i++) {
			let pt1 = neighbors[i];
			let pt2 = neighbors[i + 1];
			this.addEdge(pt1, pt2);
		}
	};

	// Function to check if an edge should be removed
	this.checkIfEdgeShouldBeRemoved = function (pt) {
		for (let i = this.edgeElts.length - 1; i >= 0; i--) {
			let edge = this.edgeElts[i];
			if (edge.id.includes(pt.id)) {
				this.removeEdge(edge);
			}
		}
	};

	// create svg group for displaying currents
	this.currGroup = document.createElementNS(SVG_NS, "g");
	this.currGroup.id = "currents";
	this.svg.appendChild(this.currGroup);

	// Current point
	this.current = null;

	this.markFirstCurrent = function (pt) {
		// Add new current point
		this.current = pt;
		const currElt = document.createElementNS(SVG_NS, "circle");
		currElt.classList.add("highlight");
		currElt.setAttributeNS(null, "cx", pt.x);
		currElt.setAttributeNS(null, "cy", pt.y);
		currElt.id = "current";
		this.currGroup.appendChild(currElt);
		// this.svg.appendChild(currElt);
	};

	// Function to mark the current point
	this.markCurrent = function (pt) {
		// Remove old current point
		old = document.getElementById("current");
		// this.svg.removeChild(old);
		this.currGroup.removeChild(old);
		// Add new current point
		this.current = pt;
		const elt = document.createElementNS(SVG_NS, "circle");
		elt.classList.add("highlight");
		elt.setAttributeNS(null, "cx", pt.x);
		elt.setAttributeNS(null, "cy", pt.y);
		elt.setAttributeNS(null, "fill", "white");
		elt.id = "current";
		// this.svg.appendChild(elt);
		this.currGroup.appendChild(elt);
	};

	// Step for visiting a new point
	this.visitPointStep = function (pt) {
		if (this.isStarted) {
			let last = this.overlayPoints.pop();
			console.log("Adding edge to " + last.id + " and " + pt.id);
			this.addEdge(pt, last);
			this.addOverlayPoint(pt);
			this.markCurrent(pt);
			console.log("Current is " + pt.id);
		}
	};

	// Step for removing a point
	this.removePointStep = function (pt) {
		if (this.isStarted) {
			console.log("Removing point " + pt.id);
			this.removeOverlayPoint(pt);
			this.checkIfEdgeShouldBeRemoved(pt);
		}
	};

	// Step for the initial lower steps of the algo
	this.lowerFirstSteps = function (pt) {
		if (this.isStarted && !this.overlayPoints.includes(pt)) {
			this.addOverlayPoint(pt);
		}
	};

	// Function to reset everything
	this.reset = function () {
		let notNecessary = svg.querySelectorAll(":not(circle):not(rect)");
		for (let i = 0; i < notNecessary.length; i++) {
			notNecessary[i].parentNode.removeChild(notNecessary[i]);
		}

		// recreate svg group for displaying overlays
		this.overlayGroup = document.createElementNS(SVG_NS, "g");
		this.svg.appendChild(this.overlayGroup);

		// recreate svg group for displaying currents
		this.currGroup = document.createElementNS(SVG_NS, "g");
		this.currGroup.id = "currents";
		this.svg.appendChild(this.currGroup);
	};

}


/////////
/*
 * An object representing an instance of the convex hull problem. A Dijkstra stores a PointSet ps that stores the input points, and a DijkstraViewer viewer that displays interactions between the Dijkstra computation and the 
 */
function Dijkstra(ps, viewer) {
	this.ps = ps;          // a PointSet storing the input to the algorithm
	this.viewer = viewer;  // a DijkstraViewer for this visualization

	this.steps = [];       // an array of steps taken while running the algorithm
	this.started = false;  // a boolean indicating whether the algorithm has started
	this.currAnimation = null; // the current animation

	// start a visualization of the Graham scan algorithm performed on ps
	this.start = function () {

		// Check for empty point set
		if (this.ps.points.length == 0) {
			console.log("Point set is empty");
			return;
		}

		this.viewer.reset();

		// Check if algorithm has already started
		if (this.started) {
			// Reset
			this.started = false;
			this.stopAnimation(this.currAnimation);
			this.viewer.reset();
			this.steps = [];
		}

		// Get the convex hull of the point set
		this.start_ps = this.getDijkstra();

		// Starting point is the first point in the convex hull point set (the leftmost point)
		this.startVertex = this.start_ps.points[0];

		console.log("Starting from point " + this.startVertex.id);

		// Highlight the starting vertex
		this.viewer.addOverlayPoint(this.startVertex);
		this.viewer.markFirstCurrent(this.startVertex);

		this.started = true;
		viewer.isStarted = true;
	};

	// perform a single step of the Graham scan algorithm performed on ps
	this.step = function () {

		// Check if algorithm has started
		if (!this.started) {
			console.log("Algorithm has not started");
			return;
		}

		// Check if there are any steps left and if so, perform the next step
		if (this.steps.length > 0) {
			this.steps.shift()();
		} else {
			this.stopAnimation();
		}

	};

	// Stop animation
	this.stopAnimation = function (ani) {
		clearInterval(ani);
		if (this.started){
			console.log("done!");
			viewer.drawFinalEdges(this.start_ps.points);
			console.log("Final Hull: " + this.start_ps.points);
			return;
		} else {
			console.log("Resetting");
			return;
		}
	};

	// Animate entire convex hull
	this.animate = function () {

		// Check if algorithm has started
		if (!this.started) {
			console.log("Algorithm has not started");
			return;
		}

		// Get the number of steps
		let numSteps = this.steps.length;
		console.log("Animating entire hull. Length of steps is " + numSteps);

		// Counter for number of steps
		let j = 0;

		// Animate entire convex hull
		this.currAnimation = setInterval(() => {
			if (j < numSteps) {
				this.step();
				j++;
			} else {
				this.stopAnimation(this.currAnimation);
			}
		}, 1000);
	};

	// Runs the Dijkstra algorithm on the point set ps and returns the resulting point set
	this.getDijkstra = function () {

		// COMPLETE THIS METHOD

		// Create a new point set
		let new_ps = new PointSet();

		// Add all points from the original point set to the new point set
		for (let i = 0; i < this.ps.points.length; i++) {
			new_ps.addPoint(this.ps.points[i]);
		}

		

	};
}


// Initialize global variables that cause problems when running in Node.js
var svg = null;
var ps = null;
var dv = null;
var d = null;

// Initialize function
function initialize() {
	svg = document.querySelector("#convex-hull-box");
	ps = new PointSet();
	dv = new DijkstraViewer(svg, ps);
	d = new Dijkstra(ps, chv);
}

try {
	exports.PointSet = PointSet;
	exports.Dijkstra = Dijkstra;
} catch (e) {
	initialize();
	console.log("not running in Node");
}