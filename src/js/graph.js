var DEBUG = false;

function debug(s) {
  if (DEBUG === true) {
    console.log(s);
  }
}

function info(s) {
  console.log(s);
}

export class Vertex {
  constructor(id, weight) {
    this.id = id;
    this.weight = weight;
  }
}

export class Edge {
  constructor(id, weight, src, dest) {
    this.id = id;
    this.weight = weight;
    this.src = src;
    this.dest = dest;
  }

}

export class Graph {
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
    var verticeIdToVerticeMap = new Map();
    for (var v of this.vertices) {
      verticeIdToVerticeMap.set(v.id, v);
    }
    return verticeIdToVerticeMap;
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
      debug("first dest V" + destVId);
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
          if (longestPath.get(e.dest) < longestPath.get(curV) + e.weight + idToVerticeMap.get(e.dest).weight) {
            longestPath.set(e.dest, longestPath.get(curV) + e.weight + idToVerticeMap.get(e.dest).weight);
          }
        }
      }
    }

    return longestPath;
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

function example1() {
  /* GRAPH 1 OK! */
  info("G1");
  var g1 = graph1();
  g1.printGraph();
  var topologicalSortedArray1 = g1.topologicalSort();
  info("topologicalSortedArray (stack mode) = " + topologicalSortedArray1);
  var srcV1G1Id = g1.vertices[0].id;
  var longestPath1 = g1.longestPath(srcV1G1Id);
  info("longest path for v" + srcV1G1Id + " from g1");
  printMap(longestPath1);

  /* GRAPH 2 OK! */
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
  info("G3");
  var g3 = graph3();
  g3.printGraph();
  var topologicalSortedArray3 = g3.topologicalSort();
  info("topologicalSortedArray (stack mode) = " + topologicalSortedArray3);
  var srcV1G3Id = g3.vertices[0].id;
  var longestPath3 = g3.longestPath(srcV1G3Id);
  info("longest path for v" + srcV1G3Id + " from g3");
  printMap(longestPath3);

  // var 3. desc [vanilla critical path (from specified v to end of the graph)]
  info("=========");
  var queueCriticalPathDesc = new Map();
  for (var v of g1.vertices) {
    var crit = g1.longestPath(v.id);
    queueCriticalPathDesc.set(v.id, getKeyValuePairByMaxValue(crit)[1]);
  }
  info("queueCriticalPathDesc");
  printMap(queueCriticalPathDesc);
  info("after sort");
  printMap(sortMapByValuesDesc(queueCriticalPathDesc));
  info("after sort ASC");
  printMap(sortMapByValuesAsc(queueCriticalPathDesc));

  // var 16. asc [critical path from graph begin to specified v]. we should iterate all start edges and choose max for each edge
  // 1. get start vertices
  var nonStartVerticeIds = [];
  var srcToAllVerticesIds = g1.getSrcToAllVerticesIds();
  for (var [k, v] of srcToAllVerticesIds) {
    for (var vv of v) {
      nonStartVerticeIds.push(vv);
    }
  }
  nonStartVerticeIds = new Set(nonStartVerticeIds);
  debug("nonStartVerticeIds = " + nonStartVerticeIds.toString());

  var startVerticeIds = [];
  for (var v of g1.vertices) {
    if (!nonStartVerticeIds.has(v.id)) {
      startVerticeIds.push(v.id);
    }
  }
  debug("StartVerticeIds = " + startVerticeIds.toString());

  // 2. Find max paths for each vertex.
  var queueCriticalPathAsc = new Map();
  for (var v of g1.vertices) {
    queueCriticalPathAsc.set(v.id, Number.NEGATIVE_INFINITY);
  }

  for (var v of startVerticeIds) {
    var crit = g1.longestPath(v);
    for (var [k, vv] of crit) {
      if (queueCriticalPathAsc.get(k) < vv) {
        queueCriticalPathAsc.set(k, vv);
      }
    }
  }
  info("queueCriticalPathAsc");
  printMap(queueCriticalPathAsc);
  info("after sort");
  printMap(sortMapByValuesDesc(queueCriticalPathAsc));
  info("after sort ASC");
  printMap(sortMapByValuesAsc(queueCriticalPathAsc));

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
