var DEBUG = false;

function debug(s) {
	if (DEBUG === true) {
		console.log(s);
	}
}

function info(s) {
	console.log(s);
}

class Vertex {
  constructor(id, weight) {
    this.id = id;
    this.weight = weight;
  }
}

class Edge {
  constructor(id, weight, src, dest) {
    this.id = id;
    this.weight = weight;
    this.src = src;
    this.dest = dest;
  }

}

class Graph {
	constructor() {
		this.vertices = [];
		this.edges = [];
	}

	addVertex(v) {
		this.vertices.push(v);
	}

	addEdge(e) {
		this.edges.push(e);
	}
  
	getSrcToAllVerticesIds() {
		var verticesSrcForEdges = new Map();
		var srcToAllVerticesIds = new Map();

		for (var v of this.vertices) {
		  verticesSrcForEdges.set(v.id, []);
		  srcToAllVerticesIds.set(v.id, []);
		}

		for (var e of this.edges) {
		  verticesSrcForEdges.get(e.src).push(e);
		}

		for (var v of verticesSrcForEdges.keys()) {
			for (var e of verticesSrcForEdges.get(v)) {
				srcToAllVerticesIds.get(v).push(e.dest);
			}
		}
		return srcToAllVerticesIds;
	}
  
	printGraph() {
		var srcToAllVerticesIds = this.getSrcToAllVerticesIds();
		for (var srcVId of srcToAllVerticesIds.keys()) {
			var conc = '';
			conc += 'v' + srcVId + ' -> ';
			for (var destVId of srcToAllVerticesIds.get(srcVId)) {
				conc += 'v' + destVId + ' '; 
			}
		info(conc);
		}
	}
}

function topologicalSort(graph) {
	var stack = [];
	var srcToAllVerticesIds = graph.getSrcToAllVerticesIds();

	var visited = new Map();
	
	for (var srcVId of srcToAllVerticesIds.keys()) {
		visited.set(srcVId, false);
	}
	
	var sortedVertices = [];
	for (var srcVId of srcToAllVerticesIds.keys()) {
		if (visited.get(srcVId) === false) {
			_topologicalSortIn(srcVId, srcToAllVerticesIds, visited, stack);
		}
	}
	
	var sortedVertices = [];
	while ((v = stack.pop()) != null) {
		sortedVertices.push(v);
	}
	
	return sortedVertices;
}

function _topologicalSortIn(srcVId, srcToAllVerticesIds, visited, stack) {
	debug("visited is true now for src V" + srcVId);
	visited.set(srcVId, true);
	
	debug("iterate through dest Vs")
	for (var destVId of srcToAllVerticesIds.get(srcVId)) {
		debug("first dest V" + destVId);
		if (visited.get(destVId) === false) {
			debug("Wow, it is dest and it hasn't been visited yet! Let's iterate its dests (into recursion)!");
			_topologicalSortIn(destVId, srcToAllVerticesIds, visited, stack);
		}
	}
	debug("list is empty for v" + srcVId);
	
	stack.push(srcVId);
	debug("stack = " + stack);
}


function example1() {
	/* GRAPH 1 OK! */
	var g1 = graph1();
	g1.printGraph();
	var topologicalSortedArray1 = topologicalSort(g1);
	info("topologicalSortedArray = " + topologicalSortedArray1);

	/* GRAPH 2 OK! */
	var g2 = graph2();
	g2.printGraph();
	var topologicalSortedArray2 = topologicalSort(g2);
	info("topologicalSortedArray = " + topologicalSortedArray2);

	/* GRAPH 3 OK!*/
	var g3 = graph3();
	g3.printGraph();
	var topologicalSortedArray3 = topologicalSort(g3);
	info("topologicalSortedArray = " + topologicalSortedArray3);
  
}

function graph1() {
	var g = new Graph();
	
	var vertices = [7, 5, 3, 11, 8, 2, 9, 10];

	// adding vertices
	for (var i = 0; i < vertices.length; i++) {
		g.addVertex(new Vertex((i+1), vertices[i]));
	}

	// adding edges
	g.addEdge(new Edge(1, 5, 1, 5));
	g.addEdge(new Edge(2, 1, 1, 4));
	g.addEdge(new Edge(3, 12, 3, 5));
	g.addEdge(new Edge(4, 7, 3, 8));
	g.addEdge(new Edge(5, 3, 2, 4));
	g.addEdge(new Edge(6, 2, 4, 6));
	g.addEdge(new Edge(7, 3, 4, 7));
	g.addEdge(new Edge(8, 6, 5, 7));
	
	return g;
}

function graph2() {
	g = new Graph();
  
	vertices = [1, 2, 3, 4, 5, 6, 7, 8];

	// adding vertices
	for (var i = 0; i < vertices.length; i++) {
		g.addVertex(new Vertex((i+1), vertices[i]));
	}

	// adding edges
	g.addEdge(new Edge(1, 1, 2, 3));
	g.addEdge(new Edge(2, 1, 2, 1));
	g.addEdge(new Edge(3, 3, 2, 6));
	g.addEdge(new Edge(4, 4, 2, 5));
	g.addEdge(new Edge(5, 1, 3, 6));
	g.addEdge(new Edge(6, 2, 1, 5));
	g.addEdge(new Edge(7, 2, 6, 7));
	g.addEdge(new Edge(8, 5, 6, 4));
	g.addEdge(new Edge(9, 3, 5, 4));
	g.addEdge(new Edge(10, 1, 5, 8));
	g.addEdge(new Edge(11, 2, 7, 4));
	g.addEdge(new Edge(12, 1, 8, 4));
	
	return g;
}

function graph3() {
	g = new Graph();

	vertices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

	// adding vertices
	for (var i = 0; i < vertices.length; i++) {
		g.addVertex(new Vertex((i+1), vertices[i]));
	}

	// adding edges
	g.addEdge(new Edge(1, 2, 1, 7));
	g.addEdge(new Edge(2, 4, 1, 3));
	g.addEdge(new Edge(3, 15, 1, 2));
	g.addEdge(new Edge(4, 3, 1, 4));
	g.addEdge(new Edge(5, 9, 1, 6));
	g.addEdge(new Edge(6, 6, 9, 8));
	g.addEdge(new Edge(7, 1, 8, 7));
	g.addEdge(new Edge(8, 7, 3, 4));
	g.addEdge(new Edge(9, 5, 4, 6));
	g.addEdge(new Edge(10, 1, 4, 5));
	g.addEdge(new Edge(11, 8, 7, 5));
	g.addEdge(new Edge(12, 4, 7, 10));
	g.addEdge(new Edge(13, 7, 5, 10));
	g.addEdge(new Edge(14, 13, 10, 11));
	g.addEdge(new Edge(15, 3, 10, 12));
	g.addEdge(new Edge(16, 2, 12, 13));
	g.addEdge(new Edge(17, 9, 10, 13));
	
	return g;
}