import cytoscape from 'cytoscape';
import {Vertex, Edge, Graph} from './graph';

export default class CyGraph {

  constructor() {
    this.initIds();
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

  initCyDummy(container) {
    this.cy = cytoscape({
      container: container,

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

  redrawCy(cyJsonStr) {
    var container = this.cy.data().container;
    this.cy.destroy();
    this.cy = cytoscape({container: container});
    var cy_json = JSON.parse(cyJsonStr);
    this.cy.json(cy_json);
    // this.addListeners();
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

