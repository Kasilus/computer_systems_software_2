class Vertex {
  constructor(id, weight) {
    this.id = id;
    this.weight = weight;
  }

  // name for vertex = 'v' + <id>.
  // Examples: v1, v2, v245, v11111231 etc.
}

class Edge {
  constructor(id, weight, src, dest) {
    this.id = id;
    this.weight = weight;
    this.src = src;
    this.dest = dest;
  }


  // name for edges = 'e' + <id>.
  // Examples: e1, e2, e245, e11111231 etc.
}

class Graph {
  constructor() {
    this.vertices = [];
    this.edges = [];
  }

  addVertex(v) {
    this.vertices.push(v);
  }

  addEdge (e) {
    this.edges.push(e);
  }

  printGraph() {
    var verticesSrcForEdges = new Map();
    for (var v of this.vertices) {
      verticesSrcForEdges.set(v.id, []);
    }

    for (var e of this.edges) {
      verticesSrcForEdges.get(e.src).push(e);
    }

    for (var v of verticesSrcForEdges.keys()) {
      var conc = '';
      conc += 'v' + v + ' -> ';
      for (var e of verticesSrcForEdges.get(v)) {
        conc += 'v' + e.dest + ' ';
      }
      console.log(conc);
    }

  }
}


function example1() {
  var g = new Graph();
  var vertices = [1, 2, 3, 4, 5, 6];

  // adding vertices
  for (var i = 0; i < vertices.length; i++) {
    g.addVertex(new Vertex(vertices[i], 1));
  }

  // adding edges
  g.addEdge(new Edge(1, 1, 1, 2));
  g.addEdge(new Edge(2, 1, 1, 4));
  g.addEdge(new Edge(3, 1, 1, 5));
  g.addEdge(new Edge(4, 1, 2, 3));
  g.addEdge(new Edge(5, 1, 4, 5));
  g.addEdge(new Edge(6, 1, 5, 6));
  g.addEdge(new Edge(7, 1, 5, 3));
  g.addEdge(new Edge(8, 1, 3, 6));

  g.printGraph();
}

