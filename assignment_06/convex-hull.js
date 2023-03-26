const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

// An object that represents a 2-d point, consisting of an
// x-coordinate and a y-coordinate. The `compareTo` function
// implements a comparison for sorting with respect to x-coordinates,
// breaking ties by y-coordinate.
function Point (x, y, id) {
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
function PointSet () {
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
        this.points.sort((a,b) => {return a.compareTo(b)});
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
        str = str.slice(0,-2); 	// remove the trailing ', '
        str += ']';

        return str;
    }
}


function ConvexHullViewer (svg, ps) {
    this.svg = svg;  // a n svg object where the visualization is drawn
    this.ps = ps;    // a point set of the points to be visualized

    // COMPLETE THIS OBJECT
}

/*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the 
 */
function ConvexHull (ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization

    // start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {
	
	// COMPLETE THIS METHOD
	
    }

    // perform a single step of the Graham scan algorithm performed on ps
    this.step = function () {
	
	// COMPLETE THIS METHOD
	
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

        // Add the first two points to the upper list
        upperList.push(this.ps.points[0]);
        upperList.push(this.ps.points[1]);

        // Get the upper hull
        for (let i = 2; i < n; i++) {
            // Get the current point and add it to the upperList
            let pt = this.ps.points[i];
            upperList.push(pt);

            // While upperList contains more than two points AND the last three points in upperList do not make a right turn
            while ((upperList.length > 2) && !isRightTurn(upperList[upperList.length - 3], upperList[upperList.length - 2], upperList[upperList.length - 1])) {
                // Delete the middle of the last three points from upperList
                let end = upperList.pop();
                upperList.pop();
                upperList.push(end);
            }
        }

        // Add the last two points to the lowerList
        lowerList.push(this.ps.points[n - 1]);
        lowerList.push(this.ps.points[n - 2]);

        // Get the lower hull
        for (let i = n - 3; i >= 0; i--) {
            // Get the current point and add it to the lowerList
            let pt = this.ps.points[i];
            lowerList.push(pt);

            // While lowerList contains more than two points AND the last three points in lowerList do not make a right turn
            while ((lowerList.length > 2) && !isRightTurn(lowerList[lowerList.length - 3], lowerList[lowerList.length - 2], lowerList[lowerList.length - 1])) {
                // Delete the middle of the last three points from lowerList
                let end = lowerList.pop();
                lowerList.pop();
                lowerList.push(end);
            }
        }

        // Remove the first and last points from lowerList
        lowerList.shift();
        lowerList.pop();

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

        // Return the hull
        return hull;
	
    }
}

// Function made to determine if a right turn is made
function isRightTurn (p1, p2, p3) {
    if (((p2.x - p1.x) * (p3.y - p1.y)) - ((p2.y - p1.y) * (p3.x - p1.x)) < 0){
        return true;
    } else {
        return false;
    }
}

try {
    exports.PointSet = PointSet;
    exports.ConvexHull = ConvexHull;
} catch (e) {
    console.log("not running in Node");
}