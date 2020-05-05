class CyGraph {

  constructor() {
    this.initIds();
    this.cy = this.initCyDummy();
    this.addListeners();
    this.addOnDeleteListener();
  }

  initIds() {
    this.ids_w = [];
    this.ids_e = [];
    for (var i = 1; i <= 1000; i++) {
      this.ids_w.push(i);
      this.ids_e.push(-i);
    }
  }

  initIdsConsideringExistCy() {
    this.initIds();

    var occupied_w = [];
    var occupied_e = [];

    for (var eles of this.cy.elements()) {
      const id = parseInt(eles.id());
      if (id > 0) {
        occupied_w.push(id);
      } else {
        occupied_e.push(id);
      }
    }

    this.ids_w = removeFromArray(this.ids_w, occupied_w);
    this.ids_e = removeFromArray(this.ids_e, occupied_e);
  }

  initCyDummy() {
    return cytoscape({
      container: document.getElementById('cy'),

      minZoom: 0.5,
      maxZoom: 0.6,

      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(name)',
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(name)'
          }
        },

        {
          selector: ':selected',
          style: {
            'background-color': 'SteelBlue',
            'line-color': 'SteelBlue',
            'target-arrow-color': 'SteelBlue',
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: 1
      }
    });
  }

  addListeners() {
    // tap on background (create new node)
    this.cy.on('tap', function(evt) {
      var evtTarget = evt.target;
      if( evtTarget === this.cy )
      {
        let weight = prompt('Enter weight for new node');
        if (!isNumeric(weight)) {
          return;
        }
        var x = evt.position['x'];
        var y = evt.position['y'];
        var newId = this.ids_w.shift();
        var node = {
          data: {
            id: newId,
            weight: parseInt(weight),
            name: 'n' + newId + ', w=' + weight
          },
          position: {
            x: x,
            y: y
          }
        };
        this.cy.add(node);
      }
    });
    this.cy.on('cxttapstart', function(evt) {
      var evtTarget = evt.target;
      if( evtTarget !== cy && evtTarget.isNode() ) {
        var cyJson = this.cy.json();
        var selected = this.cy.$(':selected');
        for (var el of selected) {
          if (el.isEdge()) {
            continue;
          }
          var weight = prompt('Enter weight for new edge v' + el.id() + ' -> v' + evtTarget.id());
          if (!isNumeric(weight)) {
            return;
          }
          var id = this.ids_e.shift();
          var edge = {
            data : {
              id: id,
              weight: parseInt(weight),
              name: 'e' + (-id) + ', w=' + weight,
              source: el.id(),
              target: evtTarget.id()
            }
          };
          this.cy.add(edge);
        }

        var g = this.transformCyGraph();
        var isCyclic = g.isCyclic();
        if (isCyclic) {
          alert('Graph has a cycle now. Back to the previous state...');
          this.cy.json(cyJson);
          this.initIdsConsideringExistCy();
        }
      }
    });
  }

  addOnDeleteListener() {
    document.addEventListener('keydown', (event) => {
      const keyName = event.key;
      var removedIds_w = [];
      var removedIds_e = [];
      if (keyName === 'Delete') {
        var selected = this.cy.$(':selected');
        for (var el of selected) {
          const id = parseInt(el.id());
          if (el.isNode()) {
            removedIds_w.push(id);
            var conEdges = el.connectedEdges();
            for (var conEdge of conEdges) {
              removedIds_e.push(parseInt(conEdge.id()));
            }

          } else {
            removedIds_e.push(id);
          }
          el.remove();
        }

        Array.prototype.unshift.apply(this.ids_w, removedIds_w);
        this.ids_w = this.ids_w.sort(function(a, b){return a-b});
        Array.prototype.unshift.apply(this.ids_e, removedIds_e);
        this.ids_e = this.ids_e.sort(function(a, b){return b-a});
      }
    });
  }

  redrawCy(cyJsonStr) {
    this.cy.destroy();
    this.cy = cytoscape({container: document.getElementById('cy')});
    var cy_json = JSON.parse(cyJsonStr);
    this.cy.json(cy_json);
    this.addListeners();
    this.initIdsConsideringExistCy();
  }

  redrawEles(elesJsonStr) {
    this.cy.elements().remove();
    var cy_eles_json = JSON.parse(elesJsonStr);
    this.cy.json({elements: cy_eles_json});
  }

  clearCyEles() {
    this.cy.elements().remove();
    this.initIds();
  }

  transformCyGraph() {
    var g = new Graph();
    // set vertices
    var nodes = this.cy.nodes();
    for (var node of nodes) {
      g.addVertex(new Vertex(node.data("id"), node.data("weight")));
    }
    // set edges
    var edges = this.cy.edges();
    for (var edge of edges) {
      g.addEdge(new Edge(-edge.data("id"), edge.data("weight"), edge.data("source"), edge.data("target")));
    }
    return g;
  }

}

