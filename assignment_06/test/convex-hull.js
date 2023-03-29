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
    // lexicographical ordering. That is, (x, y) < (x', y'm) if (1) x <
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
    }

    // return a string representation of this Point
    this.toString = function () {
        return "(" + x + ", " + y + ")";
    }
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
    }

    // add an existing point to this PointSet
    this.addPoint = function (pt) {
        this.points.push(pt);
    }

    // sort the points in this.points 
    this.sort = function () {
        this.points.sort((a, b) => { return a.compareTo(b) });
    }

    // reverse the order of the points in this.points
    this.reverse = function () {
        this.points.reverse();
    }

    // return an array of the x-coordinates of points in this.points
    this.getXCoords = function () {
        let coords = [];
        for (let pt of this.points) {
            coords.push(pt.x);
        }

        return coords;
    }

    // return an array of the y-coordinates of points in this.points
    this.getYCoords = function () {
        let coords = [];
        for (pt of this.points) {
            coords.push(pt.y);
        }

        return coords;
    }

    // get the number of points 
    this.size = function () {
        return this.points.length;
    }

    // return a string representation of this PointSet
    this.toString = function () {
        let str = '[';
        for (let pt of this.points) {
            str += pt + ', ';
        };
        str = str.slice(0, -2); 	// remove the trailing ', '
        str += ']';

        return str;
    }
}


//////////
function ConvexHullViewer(svg, ps) {
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
        id = this.ps.points[this.ps.size() - 1].id
        this.pointElts[pt.id] = pt;
        console.log("Added a point with x=" + x + " and y=" + y + " and id: " + id);
    }

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
    }

    // Function to remove edge
    this.removeEdge = function (edge) {
        if (this.svg.contains(edge)){
            this.svg.removeChild(edge);
        }
    }

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

    this.addOverlayPoint = function (pt) {
        const elt = document.createElementNS(SVG_NS, "circle");
        elt.classList.add("overlay-vertex");
        elt.setAttributeNS(null, "cx", pt.x);
        elt.setAttributeNS(null, "cy", pt.y);
        elt.setAttributeNS(null, "r", 15);
        elt.setAttributeNS(null, "id", pt.id);
        this.overlayGroup.appendChild(elt);
        this.overlayPointsId[pt.id] = elt;
        this.overlayPoints.push(pt);
    }

    this.removeOverlayPoint = function (pt) {
        const elt = this.overlayPointsId[pt.id];
        console.log("Removing overlay point " + pt.id);
        this.overlayPointsId[pt.id] = null;
        this.overlayGroup.removeChild(elt);
    }

    this.drawFinalEdges = function (neighbors) {
        for (let i = 0; i < neighbors.length - 1; i++) {
            let pt1 = neighbors[i];
            let pt2 = neighbors[i + 1];
            this.addEdge(pt1, pt2);
        }
    }

    this.checkIfEdgeShouldBeRemoved = function (pt) {
        for (let i = this.edgeElts.length - 1; i >= 0; i--) {
            let edge = this.edgeElts[i];
            if (edge.id.includes(pt.id)) {
                this.removeEdge(edge);
            }
        }
    }

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
        currElt.setAttributeNS(null, "fill", "white");
        currElt.setAttributeNS(null, "id", "current");
        this.currGroup.appendChild(currElt);
        // this.svg.appendChild(currElt);
    }

    // Function to mark the current point
    this.markCurrent = function (pt) {
        // Remove old current point
        old = document.getElementById("current");
        this.currGroup.removeChild(old);
        // Add new current point
        this.current = pt;
        const currElt = document.createElementNS(SVG_NS, "circle");
        currElt.classList.add("highlight");
        currElt.setAttributeNS(null, "cx", pt.x);
        currElt.setAttributeNS(null, "cy", pt.y);
        currElt.setAttributeNS(null, "fill", "white");
        currElt.setAttributeNS(null, "id", "current");
        // this.svg.appendChild(elt);
        this.currGroup.appendChild(currElt);
    }

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
    }

    // Step for removing a point
    this.removePointStep = function (pt) {
        if (this.isStarted) {
            console.log("Removing point " + pt.id);
            this.removeOverlayPoint(pt);
            this.checkIfEdgeShouldBeRemoved(pt);
        }
    }

    // Step for the initial lower steps of the algo
    this.lowerFirstSteps = function (pt) {
        if (this.isStarted && !this.overlayPoints.includes(pt)) {
            this.addOverlayPoint(pt);
        }
    }

    // Function to reset everything
    this.reset = function () {
        let notNecessary = svg.querySelectorAll(':not(circle):not(rect)');
        for (let i = 0; i < notNecessary.length; i++) {
            notNecessary[i].parentNode.removeChild(notNecessary[i]);
        }
    }

}


/////////
/*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the 
 */
function ConvexHull(ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization

    this.steps = [];       // an array of steps taken while running the algorithm
    this.started = false;  // a boolean indicating whether the algorithm has started

    // start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {

        // Check for empty point set
        if (this.ps.points.length == 0) {
            console.log("Point set is empty");
            return;
        }

        // Check if algorithm has already started
        if (this.started) {
            // Reset the visualization
            this.viewer.reset();
        }

        // Get the convex hull of the point set
        this.start_ps = this.getConvexHull();

        // Starting point is the first point in the convex hull point set (the leftmost point)
        this.startVertex = this.start_ps.points[0];

        console.log("Starting from point " + this.startVertex.id);

        // Highlight the starting vertex
        this.viewer.addOverlayPoint(this.startVertex);
        this.viewer.markFirstCurrent(this.startVertex);

        this.started = true;
        viewer.isStarted = true;
    }

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

    }

    // Stop animation
    this.stopAnimation = function (ani) {
        console.log("done!");
        clearInterval(ani);
        viewer.drawFinalEdges(this.start_ps.points);
        console.log("Final Hull: " + this.start_ps.points);
        return
    }

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
        let animation = setInterval(() => {
            if (j < numSteps) {
                this.step();
                j++;
            } else {
                this.stopAnimation(animation);
            }
        }, 1000);
    }

    // Return a new PointSet consisting of the points along the convex
    // hull of ps. This method should **not** perform any
    // visualization. It should **only** return the convex hull of ps
    // represented as a (new) PointSet. Specifically, the elements in
    // the returned PointSet should be the vertices of the convex hull
    // in clockwise order, starting from the left-most point, breaking
    // ties by minimum y-value.
    this.getConvexHull = function () {

        // COMPLETE THIS METHOD

        // New PointSet to store the convex hull
        let hull = new PointSet();

        // If the point set has only one point, return the point set
        if (this.ps.size() == 1) {
            hull = this.ps;
            return hull;
        }

        // Sort the points in ps based on x-coordinate (and tie-break by y-coordinate)
        this.ps.sort();

        // Create upper list and lower list
        let upperList = [];
        let lowerList = [];

        // Get length of the point set
        let n = this.ps.size();

        // Add the first point to the upper list
        upperList.push(this.ps.points[0]);

        // Add the second point to the upper list
        secondUpper = this.ps.points[1];
        upperList.push(this.ps.points[1]);
        this.steps.push(function () {viewer.visitPointStep(secondUpper)});

        // Get the upper hull
        for (let i = 2; i < n; i++) {
            // Get the current point and add it to the upperList
            let pt = this.ps.points[i];
            upperList.push(pt);
            this.steps.push(function () {viewer.visitPointStep(pt)});

            // While upperList contains more than two points AND the last three points in upperList do not make a right turn
            while ((upperList.length > 2) && !isRightTurn(upperList[upperList.length - 3], upperList[upperList.length - 2], upperList[upperList.length - 1])) {
                // Delete the middle of the last three points from upperList
                
                // Pop off the last point
                let end = upperList.pop();

                // Pop off the middle point
                let middle = upperList.pop();
                this.steps.push(function () {viewer.removePointStep(middle)});

                // Add the end point back
                upperList.push(end);
            }
        }

        // Add the last point to the lowerList
        lastLower = this.ps.points[n - 1];
        lowerList.push(this.ps.points[n - 1]);
        this.steps.push(function () {viewer.lowerFirstSteps(lastLower)});

        // Add the second to last point to the lowerList
        secondLast = this.ps.points[n - 2];
        lowerList.push(this.ps.points[n - 2]);
        this.steps.push(function () {viewer.lowerFirstSteps(secondLast)});

        // Get the lower hull
        for (let i = n - 3; i >= 0; i--) {
            // Get the current point and add it to the lowerList
            let pt = this.ps.points[i];
            lowerList.push(pt);
            this.steps.push(function () {viewer.visitPointStep(pt)});

            // While lowerList contains more than two points AND the last three points in lowerList do not make a right turn
            while ((lowerList.length > 2) && !isRightTurn(lowerList[lowerList.length - 3], lowerList[lowerList.length - 2], lowerList[lowerList.length - 1])) {
                // Delete the middle of the last three points from lowerList
                
                // Pop off the last point
                let end = lowerList.pop();

                // Pop off the middle point
                let middle = lowerList.pop();
                this.steps.push(function () {viewer.removePointStep(middle)})

                // Add the end point back
                lowerList.push(end);
            }
        }

        // Remove the first and last points from lowerList
        firstLower = lowerList.shift();

        lastLower = lowerList.pop();

        // Add the upperList to the hull
        for (let i = 0; i < upperList.length; i++) {
            hull.addPoint(upperList[i]);
        }

        // Add the lowerList to the hull
        for (let i = 0; i < lowerList.length; i++) {
            hull.addPoint(lowerList[i]);
        }

        // Add the first point to the hull at the end to complete the hull
        hull.addPoint(hull.points[0]);
        this.steps.push(function () {viewer.visitPointStep(hull.points[0])});

        // Return the hull
        return hull;

    }
}

// Function made to determine if a right turn is made
function isRightTurn(p1, p2, p3) {
    if (((p2.x - p1.x) * (p3.y - p1.y)) - ((p2.y - p1.y) * (p3.x - p1.x)) < 0) {
        return true;
    } else {
        return false;
    }
}

const svg = document.querySelector("#convex-hull-box");
const ps = new PointSet();
const chv = new ConvexHullViewer(svg, ps);
const ch = new ConvexHull(ps, chv);

try {
    exports.PointSet = PointSet;
    exports.ConvexHull = ConvexHull;
} catch (e) {
    console.log("not running in Node");
}