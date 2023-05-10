const SVG_NS = "http://www.w3.org/2000/svg";

// A lot of code is borrowed and built on from Prof. Rosenbaum's DFS example

function Graph(id) {
	this.id = id;            // (unique) ID of this graph
	this.vertices = [];      // set of vertices in this graph
	this.edges = [];         // set of edges in this graph
	this.nextVertexID = 0;   // ID to be assigned to next vtx
	this.nextEdgeID = 0;     // ID to be assigned to next edge

	// create a and return a new vertex at a given location
	this.createVertex = function (x, y) {
		const vtx = new Vertex(this.nextVertexID, this, x, y);
		this.nextVertexID++;
		return vtx;
	};

	// add vtx to the set of vertices of this graph, if the vtx is not
	// already stored as a vertex
	this.addVertex = function (vtx) {
		if (!this.vertices.includes(vtx)) {
			this.vertices.push(vtx);
			console.log("added vertex with id " + vtx.id);
		} else {
			console.log("vertex with id " + vtx.id + " not added because it is already a vertex in the graph.");
		}
	};

	// create and return an edge between vertices vtx1 and vtx2;
	// returns existing edge if there is already an edge between the
	// two vertices
	this.addEdge = function (vtx1, vtx2) {
		if (!this.isEdge(vtx1, vtx2)) {
			const edge = new Edge(vtx1, vtx2, this.nextEdgeID, inputtedEdgeWeight);
			this.nextEdgeID++;
			vtx1.addNeighbor(vtx2);
			vtx2.addNeighbor(vtx1);
			this.edges.push(edge);
			console.log("added edge (" + vtx1.id + ", " + vtx2.id + ") with weight: " + edge.weight);
			return edge;
		} else {
			console.log("edge (" + vtx1.id + ", " + vtx2.id + ") not added because it is already in the graph");
			return null;
		}
	};

	// determine if vtx1 and vtx2 are already an edge in this graph
	this.isEdge = function (vtx1, vtx2) {
		return (this.getEdge(vtx1, vtx2) != null);
	};

	// return the edge object corresponding to a pair (vtx1, vtx2), or
	// null if no such edge is in the graph
	this.getEdge = function (vtx1, vtx2) {
		for (const edge of this.edges) {
			if (edge.equals(vtx1, vtx2)) {
				return edge;
			}
		}

		return null;
	};

	// return a string representation of the adjacency lists of the
	// vertices in this graph
	this.adjacencyLists = function () {
		let str = "";
		for (const vtx of this.vertices) {
			str += vtx.id + ":";
			for (const nbr of vtx.neighbors) {
				str += (" " + nbr.id + " (" + this.getEdge(vtx, nbr).weight + ")");
			}
			str += "<br>";
		}
		return str;
	};

	// return a map with keys equal to a vertex's neighbors and values equal to the edge weight
	this.getAdjacencyMaps = function () {
		adjMaps = [];
		for (const vtx of this.vertices) {
			adjacencyMap = new Map();
			for (const nbr of vtx.neighbors) {
				adjacencyMap.set(nbr.id, this.getEdge(vtx, nbr).weight);
			}
			adjMaps.push(adjacencyMap);
		}
		return adjMaps;
	};
}

// an object representing a vertex in a graph
// each vertex has an associated unique identifier (id), the graph
// containing the vertex, as well as x,y coordinates of the vertex's
// physical location
function Vertex(id, graph, x, y) {
	this.id = id;        // the unique id of this vertex
	this.graph = graph;  // the graph containing this vertex
	this.x = x;          // x coordinate of location
	this.y = y;          // y coordinate of location
	this.dist = Infinity;
	this.prevVertex = null;

	this.neighbors = []; // the adjacency list of this vertex

	// add vtx as a neighbor of this vertex, if it is not already a
	// neighbor
	this.addNeighbor = function (vtx) {
		if (!this.neighbors.includes(vtx)) {
			this.neighbors.push(vtx);
		}
	};

	// remove vtx as a neighbor of this vertex
	this.removeNeighbor = function (vtx) {
		const index = this.neighbors.indexOf(vtx);
		if (index != -1) {
			this.neighbors.splice(index, 1);
		}
	};

	// determine if vtx is a neighbor of this vertex
	this.hasNeighbor = function (vtx) {
		return this.neighbors.includes(vtx);
	};

	this.setDist = function (vtx, d) {
		if ( d < this.dist) {
			this.dist = d + vtx.dist;
			this.prevVertex = vtx;
		}
	};
}

// an object representing an edge in a graph
function Edge(vtx1, vtx2, id, weight) {
	this.vtx1 = vtx1;   // first endpoint of the edge
	this.vtx2 = vtx2;   // second endpoint of the edge
	this.id = id;       // the unique identifier of this edge
	this.weight = weight; // the weight of this edge

	// determine if this edge has vtx1 and vtx2 as endpoints
	this.equals = function (vtx1, vtx2) {
		return (this.vtx1 == vtx1 && this.vtx2 == vtx2) || (this.vtx1 == vtx2 && this.vtx2 == vtx1);
	};
}

// an object to visualize and interact with a graph
function GraphVisualizer(graph, svg, text) {
	this.graph = graph;      // the graph we are visualizing
	this.svg = svg;          // the svg element we are drawing on
	this.text = text;        // a text box

	// define the behavior for clicking on the svg element
	this.svg.addEventListener("click", (e) => {
		// create a new vertex
		this.createVertex(e);
	});

	// sets of highlighted/muted vertices and edges
	this.highVertices = [];
	this.lowVertices = [];
	this.highEdges = [];
	this.lowEdges = [];

	// create svg group for displaying edges
	this.edgeGroup = document.createElementNS(SVG_NS, "g");
	this.edgeGroup.id = "graph-" + graph.id + "-edges";
	this.svg.appendChild(this.edgeGroup);

	// create svg group for displaying vertices
	this.vertexGroup = document.createElementNS(SVG_NS, "g");
	this.vertexGroup.id = "graph-" + graph.id + "-vertices";
	this.svg.appendChild(this.vertexGroup);

	// overlay vertices
	this.overlayVertices = [];

	// create svg group for displaying overlays
	this.overlayGroup = document.createElementNS(SVG_NS, "g");
	this.overlayGroup.id = "graph-" + graph.id + "-overlay";
	this.svg.appendChild(this.overlayGroup);

	this.addOverlayVertex = function (vtx) {
		const elt = document.createElementNS(SVG_NS, "circle");
		elt.classList.add("overlay-vertex");
		elt.setAttributeNS(null, "r", "15px");
		elt.setAttributeNS(null, "cx", vtx.x);
		elt.setAttributeNS(null, "cy", vtx.y);
		this.overlayGroup.appendChild(elt);
		this.overlayVertices[vtx.id] = elt;
	};

	this.moveOverlayVertex = function (vtx1, vtx2) {
		const elt = this.overlayVertices[vtx1.id];
		this.overlayVertices[vtx1.id] = null;
		this.overlayVertices[vtx2.id] = elt;
		elt.setAttributeNS(null, "cx", vtx2.x);
		elt.setAttributeNS(null, "cy", vtx2.y);
	};

	this.removeOverlayVertex = function (vtx) {
		const elt = this.overlayVertices[vtx.id];
		this.overlayGroup.removeChild(elt);
	};

	this.vertexElts = [];   // svg elements for vertices
	this.edgeElts = [];     // svg elements for edges

	// create a new vertex 
	this.createVertex = function (e) {
		const rect = this.svg.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const vtx = graph.createVertex(x, y);
		this.addVertex(vtx);
		this.graph.addVertex(vtx);
		this.updateTextBox(graph.adjacencyLists());
	};

	// add a vertex to the visualization by creating an svg element
	this.addVertex = function (vtx) {
		// create a group for the vertex and its text
		this.vertexTextGroup = document.createElementNS(SVG_NS, "g");
		
		// add text to the center of each vertex
		const text = document.createElementNS(SVG_NS, "text");
		text.setAttribute("x", vtx.x);
		text.setAttribute("y", vtx.y);
		text.textContent = vtx.id;
		text.classList.add("vertex-text");
		
		// Draw the vertex
		const elt = document.createElementNS(SVG_NS, "circle");
		elt.classList.add("vertex");
		elt.setAttributeNS(null, "r", "15px");
		elt.setAttributeNS(null, "cx", vtx.x);
		elt.setAttributeNS(null, "cy", vtx.y);

		// add event listeners for clicking on the vertex
		elt.addEventListener("click", (e) => {
			e.stopPropagation(); // don't create another vertex (i.e., call event listener for the svg element in addition to the vertex
			this.clickVertex(vtx);
		});

		// add event listeners for text
		text.addEventListener("click", (e) => {
			e.stopPropagation(); // don't create another vertex (i.e., call event listener for the svg element in addition to the vertex
			this.clickVertex(vtx);
		});

		this.vertexTextGroup.appendChild(elt);
		this.vertexTextGroup.appendChild(text);
		this.vertexGroup.appendChild(this.vertexTextGroup);
		// this.vertexGroup.appendChild(text);
		this.vertexElts[vtx.id] = elt;
	};

	// method to be called when a vertex is clicked
	this.clickVertex = function (vtx) {
		console.log("You clicked vertex " + vtx.id);

		// check if any other highlighted vertices
		if (this.highVertices.length == 0) {
			this.highVertices.push(vtx);
			this.highlightVertex(vtx);
		} else if (this.highVertices.includes(vtx)) {
			this.unhighlightVertex(vtx);
			this.highVertices.splice(this.highVertices.indexOf(vtx), 1);
		} else {
			const other = this.highVertices.pop();
			let e = this.graph.addEdge(other, vtx);
			if (e != null) {
				this.addEdge(e);
			}
			this.unhighlightVertex(other);
		}
	};

	// function to calculate rotation angle
	this.getAngle = function (vtx1, vtx2) {
		if (vtx1.x < vtx2.x) {
			return Math.atan2(vtx2.y - vtx1.y, vtx2.x - vtx1.x) * 180 / Math.PI;
		} else {
			return Math.atan2(vtx1.y - vtx2.y, vtx1.x - vtx2.x) * 180 / Math.PI;
		}
	};

	// add an edge to the visualization
	this.addEdge = function (edge) {
		const vtx1 = edge.vtx1;
		const vtx2 = edge.vtx2;
		const edgeElt = document.createElementNS(SVG_NS, "line");
		edgeElt.setAttributeNS(null, "x1", vtx1.x);
		edgeElt.setAttributeNS(null, "y1", vtx1.y);
		edgeElt.setAttributeNS(null, "x2", vtx2.x);
		edgeElt.setAttributeNS(null, "y2", vtx2.y);
		edgeElt.classList.add("edge");

		// add text to the center of each edge
		const text = document.createElementNS(SVG_NS, "text");
		text.setAttributeNS(null, "x", (vtx1.x + vtx2.x) / 2);
		text.setAttributeNS(null, "y", (vtx1.y + vtx2.y) / 2);
		text.textContent = edge.weight;
		
		text.setAttribute("transform", "rotate(" + this.getAngle(vtx1, vtx2) + "," + ((vtx1.x + vtx2.x) / 2) + "," + ((vtx1.y + vtx2.y) / 2) + ")");
		text.classList.add("edge-text");

		this.edgeElts[edge.id] = edgeElt;
		this.edgeGroup.appendChild(edgeElt);
		this.edgeGroup.appendChild(text);
		this.updateTextBox(this.graph.adjacencyLists());
		console.log("Added edge " + edge.id + " with length of " + edgeElt.getTotalLength());
	};

	this.updateTextBox = function (str) {
		this.text.innerHTML = str;
	};

	this.highlightVertex = function (vtx) {
		const elt = this.vertexElts[vtx.id];
		elt.classList.add("highlight");
	};

	this.unhighlightVertex = function (vtx) {
		const elt = this.vertexElts[vtx.id];
		elt.classList.remove("highlight");
	};

	this.muteVertex = function (vtx) {
		const elt = this.vertexElts[vtx.id];
		elt.classList.add("muted");
	};

	this.unmuteVertex = function (vtx) {
		const elt = this.vertexElts[vtx.id];
		elt.classList.remove("muted");
	};

	this.highlightEdge = function (e) {
		const elt = this.edgeElts[e.id];
		elt.classList.add("highlight-edge");
	};

	this.unhighlightEdge = function (e) {
		const elt = this.edgeElts[e.id];
		elt.classList.remove("highlight-edge");
	};

	this.unhighlightAll = function () {
		for (vtx of this.graph.vertices) {
			this.unhighlightVertex(vtx);
		}
		for (e of this.graph.edges) {
			this.unhighlightEdge(e);
		}
	};

	this.muteEdge = function (e) {
		const elt = this.edgeElts[e.id];
		elt.classList.add("muted");
	};

	this.unmuteEdge = function (e) {
		const elt = this.edgeElts[e.id];
		elt.classList.remove("muted");
	};

	this.muteAllVertices = function () {
		for (vtx of this.graph.vertices) {
			this.muteVertex(vtx);
		}
	};

	this.muteAllEdges = function () {
		for (e of this.graph.edges) {
			this.muteEdge(e);
		}
	};

	this.muteAll = function () {
		this.muteAllVertices();
		this.muteAllEdges();
	};

	this.unmuteAllVertices = function () {
		for (vtx of this.graph.vertices) {
			this.unmuteVertex(vtx);
		}
	};

	this.unmuteAllEdges = function () {
		for (e of this.graph.edges) {
			this.unmuteEdge(e);
		}
	};

	this.unmuteAll = function () {
		this.unmuteAllVertices();
		this.unmuteAllEdges();
	};

}

function Dijkstra(graph, vis) {
	this.graph = graph;
	this.vis = vis;
	this.startVertex = null;
	this.endVertex = null;
	this.curAnimation = null;
	this.active = false;
	this.adjMap = null;
	this.visited = [];
	this.unvisited = [];
	this.curVisitedNeighbors = [];
	this.cur = null;
	this.done = false;

	this.start = function () {
		// Enable step, animate, and reset buttons
		document.getElementById("stepButton").disabled = false;
		document.getElementById("animateButton").disabled = false;
		document.getElementById("resetButton").disabled = false;

		if (!this.active) {
			
			// The start vertex is the last highlighted one
			this.startVertex = vis.highVertices.pop();

			// If there is no start vertex, return
			if (this.startVertex == null) {
				vis.updateTextBox("Please select start vertex and start again.");
				return;
			}

			// Set the start vertex's distance to 0
			this.startVertex.dist = 0;

			// Create the visited and unvisited lists
			this.visited = [];
			this.unvisited = [];

			// Set cur to the start vertex
			this.cur = this.startVertex;
			// this.curUnvisitedNeighbors = this.cur.neighbors.filter(vtx => !this.visited.includes(vtx));

			// Add an overlay to the current
			this.vis.addOverlayVertex(this.cur);

			// Mute everything but the start vertex
			this.vis.muteAll();
			this.vis.unmuteVertex(this.startVertex);

			// Get the adjacency maps
			this.adjMaps = this.graph.getAdjacencyMaps();

			console.log("Starting Dijkstra's Algorithm from vertex " + this.startVertex.id);

			// Set active to true
			this.active = true;

			// disable the start button
			document.getElementById("startButton").disabled = true;

		} else {
			console.log("Start pressed while Dijkstra's Algorithm is already running");

			// unhighlight everything
			this.vis.unhighlightAll();

			// Reset the distances
			for (vtx of this.graph.vertices) {
				vtx.dist = Infinity;
			}

			// Set active to false
			this.active = false;

			// Reset the animation
			this.curAnimation = null;

			// Recall start
			this.start();

		}

	};

	this.step = function () {
		// check if execution is finished (aka all vertices have been visited)
		if (this.done) {
			console.log("Done running Dijkstra's");

			// Store distances and paths as strings
			let results = "<u>The Shortest Path from Starting Vertex " + this.startVertex.id + " to Every Other Vertex</u>";

			// For each vertex, print the shortest path
			for (vtx of this.graph.vertices) {

				// Skip the start vertex
				if (vtx.id == this.startVertex.id) continue;

				// Add line break
				results += "<br>";

				// Get the total distance and vertex id
				results += vtx.id + " has total distance of " + vtx.dist + " and follows the path: ";

				// Get the path
				path = [];
				current = vtx;
				while (current.prevVertex){
					path.push(current.prevVertex.id);
					current = current.prevVertex;
				}

				// Append path to the results
				for (pathVtx of path.reverse()) {
					results += pathVtx + " -> ";
				}
				
				// Add the last vertex id to the path
				results += vtx.id;
			}

			// Print the shortest path and remove active vertex overlay
			vis.updateTextBox(results);
			
			// Set done to true
			this.active = false;

			// Return
			return;
		}

		// find the next unvisited neighbor
		let next = this.nextUnvisitedNeighbor(this.cur);

		if (next != null && this.unvisited.length > 0) {
			// If next is not null, check the possibility of a shorter path
			console.log("unvisited is " + this.unvisited);
			if (this.nextUnvisitedNeighbor(this.unvisited[0]) != null) {
				// Set possibleNext
				let possibleNext = this.nextUnvisitedNeighbor(this.unvisited[0]);
				
				// Get all edges that contain possibleNext
				let possibleEdges = this.graph.edges.filter(e => e.vtx1.id == possibleNext.id || e.vtx2.id == possibleNext.id);

				// Check to see if any of the possibleEdges have vertices that are visited
				if (possibleEdges.filter(e => this.visited.includes(e.vtx1) || this.visited.includes(e.vtx2) || this.curVisitedNeighbors.includes(e.vtx1) || this.curVisitedNeighbors.includes(e.vtx2)).length > 0) {

					// Check to see if the distance to possibleNext is shorter than the distance to next
					if (this.adjMaps[this.cur.id].get(next.id) > this.adjMaps[this.unvisited[0].id].get(possibleNext.id)) {
						old = next;
						next = possibleNext;
						this.curVisitedNeighbors = [];
						this.curVisitedNeighbors.push(this.cur);
						this.vis.moveOverlayVertex(this.cur, this.unvisited[0]);
						this.cur = this.unvisited[0];
						this.unvisited.splice(0, 1);
						console.log("Found a shorter edge at " + next.id + " so adding " + old.id + " back to front of unvisited");
						this.unvisited.push(old);
					}
				}
			}
		}

		// If next is null, then we have no more neighbors to visit
		if (next == null) {
			// Reset the curVisitedNeighbors
			this.curVisitedNeighbors = [];

			console.log("No more unvisited neighbors of " + this.cur.id);

			// if no next neighbor, cur has now been fully visited
			this.visited.push(this.cur);

			// If there are still unvisited nodes, set the next node to the next unvisited node
			if (this.unvisited.length > 0) {
				// Get the next node
				const nextNode = this.unvisited[0];
				console.log("cur is now " + nextNode.id);
				this.unvisited.splice(0, 1);
				this.vis.moveOverlayVertex(this.cur, nextNode);
				this.cur = nextNode;
			} else {
				// Remove the overlay vertex and set cur to null
				console.log("unvisited is empty, so cur is now null");
				this.vis.removeOverlayVertex(this.cur);
				this.cur = null;
				this.done = true;
			}

			// Return
			return;

		} else {
			// If next is not null, then we have a neighbor to visit
			console.log("Next unvisited neighbor of " + this.cur.id + " is " + next.id);

			// Get the next edge
			const edge = this.graph.getEdge(this.cur, next);

			// Call set distance on the next node with dist set to the edge weight
			next.setDist(this.cur, edge.weight);

			// Visual effects
			vis.unmuteEdge(edge);
			vis.highlightEdge(edge);
			vis.unmuteVertex(next);
			vis.highlightVertex(next);

			// Add the next vertex to the unvisited list
			if (!this.unvisited.includes(next)){
				this.unvisited.unshift(next);
			}

			// Add the next vertex to the curVisitedNeighbors list
			this.curVisitedNeighbors.push(next);
		}
	};

	this.nextUnvisitedNeighbor = function (vertex) {
		// make sure cur is not null
		if (vertex == null) return null;
		
		console.log("Getting next unvisited neighbor of " + vertex.id);
		
		// List of possible neighbors
		let possibleNeighbors = vertex.neighbors.filter(vtx => !this.curVisitedNeighbors.includes(vtx) && !this.visited.includes(vtx) && (vtx.id != this.cur.id));
		
		if (possibleNeighbors.length == 0){
			console.log("No possible neighbors of " + vertex.id);
			return null;
		} else if (possibleNeighbors.length == 1){
			// If there is one, return one
			console.log("Only possible neighbor of " + this.cur.id + " is " + possibleNeighbors[0].id);
			return possibleNeighbors[0];
		} else {
			// If there are multiple, return the one with the lowest distance

			// Set the lowest distance vertex to the first vertex
			let lowestDistVertex = possibleNeighbors[0];

			// Loop through and find the lowest distance vertex
			for (vtx of possibleNeighbors){
				if (this.adjMaps[vertex.id].get(vtx.id) < this.adjMaps[vertex.id].get(lowestDistVertex.id)){
					lowestDistVertex = vtx;
				}
			}

			console.log("Lowest distance neighbor of " + vertex.id + " is " + lowestDistVertex.id);

			// Return the lowest distance vertex
			return lowestDistVertex;
		}
	};

	this.reset = function () {
		// enable the start button and disable every other button
		document.getElementById("startButton").disabled = false;
		document.getElementById("stepButton").disabled = true;
		document.getElementById("resetButton").disabled = true;
		document.getElementById("animateButton").disabled = true;

		// stop animation
		this.stopAnimation();
		
		// unhighlight everything
		this.vis.unhighlightAll();

		// unmute everything
		this.vis.unmuteAll();

		// Reset the distances
		for (vtx of this.graph.vertices) {
			vtx.dist = Infinity;
		}

		// reset all the variables
		this.startVertex = null;
		this.endVertex = null;
		this.curAnimation = null;
		this.active = false;
		this.adjMap = null;
		this.visited = [];
		this.unvisited = [];
		this.cur = null;
		this.done = false;
	};

	this.animate = function () {
		document.getElementById("stepButton").disabled = true;
		if (this.curAnimation == null) {
			this.curAnimation = setInterval(() => {
				this.animateStep();
			}, 1000);
		}
	};

	this.animateStep = function () {
		if (this.active) {
			this.step();
		} else {
			this.stopAnimation();
		}
	};

	this.stopAnimation = function () {
		clearInterval(this.curAnimation);
		this.curAnimation = null;
		console.log("animation completed");
	};
}

// function to set edge weight
function setEdgeWeight() {
	inputtedEdgeWeight = Number(document.getElementById("edgeWeight").value);
}

let inputtedEdgeWeight = 1; // default edge weight
let lengthBasedWeight = false; // default edge weight is not based on length of line

// Default behavior should have step, animate, and reset buttons disabled
document.getElementById("stepButton").disabled = true;
document.getElementById("animateButton").disabled = true;
document.getElementById("resetButton").disabled = true;

const svg = document.querySelector("#graph-box");
const text = document.querySelector("#graph-text-box");
const graph = new Graph(0);
const gv = new GraphVisualizer(graph, svg, text);
const dijk = new Dijkstra(graph, gv);