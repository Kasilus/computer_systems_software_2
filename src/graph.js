var DEBUG = false;
var DELIMITER = "=========";

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
	
	getIdToVerticeMap() {
		return getIdToObjectMap(this.vertices);
	}
	
	getIdToEdgeMap() {
		return getIdToObjectMap(this.edges);
	}
	
	getSrcVerticeIdToEdges() {
		var srcVerticesToEdges = new Map();

		for (var v of this.vertices) {
		  srcVerticesToEdges.set(v.id, []);
		}

		for (var e of this.edges) {
		  srcVerticesToEdges.get(e.src).push(e);
		}

		return srcVerticesToEdges;
	}
	
	getDestVerticeIdToEdges() {
		var destVerticeIdToEdges = new Map();

		for (var v of this.vertices) {
		  destVerticeIdToEdges.set(v.id, []);
		}

		for (var e of this.edges) {
		  destVerticeIdToEdges.get(e.dest).push(e);
		}

		return destVerticeIdToEdges;
	}
	
	getEdge(src, dest) {
		for (var e of this.edges) {
			if (e.src === src && e.dest === dest) {
				return e;
			}
		}
		return null;
	}
	
	getDestToAllSrcVerticesIds() {
		var destToAllSrcVerticesIdsMap = new Map();
		for (var v of this.vertices) {
			destToAllSrcVerticesIdsMap.set(v.id, []);
		}
		
		for (var e of this.edges) {
			var srcVertices = destToAllSrcVerticesIdsMap.get(e.dest);
			if (!srcVertices.includes(e.src)) {
				srcVertices.push(e.src);
			}
		}
		return destToAllSrcVerticesIdsMap;
	}
	
	topologicalSort() {
		var stack = [];
		var srcToAllVerticesIds = this.getSrcToAllVerticesIds();

		var visited = new Map();
		
		for (var srcVId of srcToAllVerticesIds.keys()) {
			visited.set(srcVId, false);
		}
		
		var sortedVertices = [];
		for (var srcVId of srcToAllVerticesIds.keys()) {
			if (visited.get(srcVId) === false) {
				this._topologicalSortIn(srcVId, srcToAllVerticesIds, visited, stack);
			}
		}
		
		return stack;
	}
	
	_topologicalSortIn(srcVId, srcToAllVerticesIds, visited, stack) {
		debug("visited is true now for src V" + srcVId);
		visited.set(srcVId, true);
		
		debug("iterate through dest Vs")
		for (var destVId of srcToAllVerticesIds.get(srcVId)) {
			debug("dest V" + destVId);
			if (visited.get(destVId) === false) {
				debug("Wow, it is dest and it hasn't been visited yet! Let's iterate its dests (into recursion)!");
				this._topologicalSortIn(destVId, srcToAllVerticesIds, visited, stack);
			}
		}
		debug("list is empty for v" + srcVId);
		
		stack.push(srcVId);
		debug("stack = " + stack);
	}
	
	longestPath(vFromId) {
		var topSortedVertices = this.topologicalSort();
		debug("mark all as -infinity and source as 0");
		var srcVerticeToEdges = this.getSrcVerticeIdToEdges();
		var idToVerticeMap = this.getIdToVerticeMap();
		var longestPath = new Map();
		for (var srcVId of srcVerticeToEdges.keys()) {
			longestPath.set(srcVId, Number.NEGATIVE_INFINITY);
		}
		longestPath.set(vFromId, idToVerticeMap.get(vFromId).weight);
		
		debug("find longest path for all vertices");
		
		while (topSortedVertices.length > 0) {
			var curV = topSortedVertices.pop();
			debug("curV = v" + curV);
			if (longestPath.get(curV) !== Number.NEGATIVE_INFINITY) {
				debug("longestPath.get(curV) !== Number.NEGATIVE_INFINITY");
				for (var e of srcVerticeToEdges.get(curV)) {
					debug("e = " + e.id);
					debug("e.src = " + e.src);
					debug("e.dest = " + e.dest);
					debug("longestPath[e.dest] = " + longestPath.get(e.dest));
					if (longestPath.get(e.dest) < longestPath.get(curV) + idToVerticeMap.get(e.dest).weight) {
						longestPath.set(e.dest, longestPath.get(curV) + idToVerticeMap.get(e.dest).weight);
					}
				}
			}
		}
		
		printMap(longestPath, "k", "v");
		
		return longestPath;
	}
	
	criticalPath() {
		var allCrits = [];
		var srcToAllVerticesIds = this.getSrcToAllVerticesIds();
		var destToAllVerticesIds = this.getDestToAllSrcVerticesIds();
		for (var v of this.vertices) {
			// find only for start vertices
			if (destToAllVerticesIds.get(v.id).length < 1) {
				var critsToVertices = this.longestPath(v.id);
				var critToLeafVertices = new Map();
				for ([k,v] of critsToVertices) {
					if (srcToAllVerticesIds.get(k).length < 1 && v !== Number.NEGATIVE_INFINITY) {
						allCrits.push(v);
					}
				}
			}
		}
		console.log("ALL FUCKING CRITS");
		console.log(allCrits);
		return allCrits.sort(function(a, b){return b-a})[0];
	}
	
	
	isCyclic() {
		var srcToAllVerticesIds = this.getSrcToAllVerticesIds();
		console.log(srcToAllVerticesIds);
		var stack = [];
		var visited = [];
		
		for (var srcVId of srcToAllVerticesIds.keys()) {
			if (this._isCyclic(srcVId, srcToAllVerticesIds, visited, stack)) {
				return true;
			}
		}
		
		return false;
	}
	
	_isCyclic(srcVId, srcToAllVerticesIds, visited, stack) {
		if (stack.indexOf(srcVId) !== -1) {
			return true;
		}
		if (visited.indexOf(srcVId) !== -1) {
			return false;
		}
		
		stack.push(srcVId);
		visited.push(srcVId);
		
		var destVertices = srcToAllVerticesIds.get(srcVId);
		
		for (var destVId of destVertices) {
			if(this._isCyclic(destVId, srcToAllVerticesIds, visited, stack)) {
				return true;
			};
		}
		
		var index = stack.indexOf(srcVId);
		if (index !== -1) stack.splice(index, 1);
		
		return false;
	}
	
	// var 3. desc [vanilla critical path (from specified v to end of the graph)]
	formQueueOfCompWorksVar3() {
		var queueOfCompWorks = new Map();
		for (var v of this.vertices) {
			var crit = this.longestPath(v.id);
			queueOfCompWorks.set(v.id, getKeyValuePairByMaxValue(crit)[1]);
		}
		return sortMapByValuesDesc(queueOfCompWorks);
	}
	
	// var 16. asc [critical path from graph begin to specified v]. we should iterate all start edges and choose max for each edge
	formQueueOfCompWorksVar16() {
		// 16.1. get start vertices
		var nonStartVerticeIds = [];
		var srcToAllVerticesIds = this.getSrcToAllVerticesIds();
		for (var [k, v] of srcToAllVerticesIds) {
			for (var vv of v) {
				nonStartVerticeIds.push(vv);
			}
		}
		nonStartVerticeIds = new Set(nonStartVerticeIds);
		debug("nonStartVerticeIds = " + nonStartVerticeIds.toString());
		
		var startVerticeIds = [];
		for (var v of this.vertices) {
			if (!nonStartVerticeIds.has(v.id)) {
				startVerticeIds.push(v.id);
			}
		}
		debug("startVerticeIds = " + startVerticeIds.toString());
		
		// 16.2. Find max paths for each vertex.
		var queueOfCompWorks = new Map();
		for (var v of this.vertices) {
			queueOfCompWorks.set(v.id, Number.NEGATIVE_INFINITY);
		}
		
		for (var v of startVerticeIds) {
			var crit = this.longestPath(v);
			for (var [k, vv] of crit) {
				if (queueOfCompWorks.get(k) < vv) {
					queueOfCompWorks.set(k, vv);
				}
			}
		}
		return sortMapByValuesAsc(queueOfCompWorks);
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
	
	calcConnectivityKoefficient() {
		var verticesSum = 0;
		for (var v of this.vertices) {
			verticesSum += v.weight;
		}
		var edgesSum = 0;
		for (var e of this.edges) {
			edgesSum += e.weight;
		}
		return verticesSum / (verticesSum + edgesSum);
	}
	
}

function example1() {
	/* GRAPH 1 OK! */
	// info(DELIMITER);
	// info("G1");
	// var g1 = graph1();
	// g1.printGraph();
	// var topologicalSortedArray1 = g1.topologicalSort();
	// info("topologicalSortedArray (stack mode) = " + topologicalSortedArray1);
	// var srcV1G1Id = g1.vertices[0].id;
	// var longestPath1 = g1.longestPath(srcV1G1Id);
	// info("longest path for v" + srcV1G1Id + " from g1");
	// printMap(longestPath1);

	/* GRAPH 2 OK! */
	info(DELIMITER);
	info("G2");
	var g2 = graph2();
	g2.printGraph();
	var topologicalSortedArray2 = g2.topologicalSort();
	info("topologicalSortedArray (stack mode) = " + topologicalSortedArray2);
	var srcV1G2Id = g2.vertices[0].id;
	var longestPath2 = g2.longestPath(srcV1G2Id);
	info("longest path for v" + srcV1G2Id + " from g2");
	printMap(longestPath2);

	/* GRAPH 3 OK!*/
	// info(DELIMITER);
	// info("G3");
	// var g3 = graph3();
	// g3.printGraph();
	// var topologicalSortedArray3 = g3.topologicalSort();
	// info("topologicalSortedArray (stack mode) = " + topologicalSortedArray3);
	// var srcV1G3Id = g3.vertices[0].id;
	// var longestPath3 = g3.longestPath(srcV1G3Id);
	// info("longest path for v" + srcV1G3Id + " from g3");
	// printMap(longestPath3);
	
	info(DELIMITER);
	var queueOfCompWorksVar3 = g2.formQueueOfCompWorksVar3();
	info("Queue of Computational Works Variant = 3, sort DESC");
	printMap(queueOfCompWorksVar3);
	

	info(DELIMITER);
	var queueOfCompWorksVar16 = g2.formQueueOfCompWorksVar16();
	info("Queue of Computational Works Variant = 16, sort ASC");
	printMap(queueOfCompWorksVar16);
	
	info(DELIMITER);
	var queueOfCompWorks = queueOfCompWorksVar3;
	
  
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

