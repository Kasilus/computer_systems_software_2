<template>
  <div>
    <h1>Manual Graph</h1>
    <div id="cy" ref="myCy">
    </div>
    <button id="someId" v-on:click="showMyCy">PUSHHH</button>
  </div>
</template>

<script>

  import {isNumeric} from "../js/utils.js";
  import CyGraph from '../js/cy_graph.js';

  var a = 5;
  var cyGraph = new CyGraph();

  function addListeners() {
    cyGraph.cy.on('tap', function(evt) {
      var evtTarget = evt.target;
      if( evtTarget === cyGraph.cy )
      {
        let weight = prompt('Enter weight for new node');
        if (!isNumeric(weight)) {
          return;
        }
        var x = evt.position['x'];
        var y = evt.position['y'];
        var newId = cyGraph.ids_w.shift();
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
        cyGraph.cy.add(node);
      }
    });
    cyGraph.cy.on('cxttapstart', function(evt) {
      var evtTarget = evt.target;
      if( evtTarget !== cyGraph.cy && evtTarget.isNode() ) {
        var cyJson = cyGraph.cy.json();
        var selected = cyGraph.cy.$(':selected');
        for (var el of selected) {
          if (el.isEdge()) {
            continue;
          }
          var weight = prompt('Enter weight for new edge v' + el.id() + ' -> v' + evtTarget.id());
          if (!isNumeric(weight)) {
            return;
          }
          var id = cyGraph.ids_e.shift();
          var edge = {
            data : {
              id: id,
              weight: parseInt(weight),
              name: 'e' + (-id) + ', w=' + weight,
              source: el.id(),
              target: evtTarget.id()
            }
          };
          cyGraph.cy.add(edge);
        }

        var g = cyGraph.transformCyGraph();
        var isCyclic = g.isCyclic();
        if (isCyclic) {
          alert('Graph has a cycle now. Back to the previous state...');
          this.cy.json(cyJson);
          this.initIdsConsideringExistCy();
        }
      }
    });
  }

  function addOnDeleteListener() {
    document.addEventListener('keydown', (event) => {
      const keyName = event.key;
      var removedIds_w = [];
      var removedIds_e = [];
      if (keyName === 'Delete') {
        var selected = cyGraph.cy.$(':selected');
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

        Array.prototype.unshift.apply(cyGraph.ids_w, removedIds_w);
        cyGraph.ids_w = cyGraph.ids_w.sort(function(a, b){return a-b});
        Array.prototype.unshift.apply(cyGraph.ids_e, removedIds_e);
        cyGraph.ids_e = cyGraph.ids_e.sort(function(a, b){return b-a});
      }
    });
  }

  export default {
    data() {
      return {
        activeButton: 'add_vertex',
      }
    },
    methods: {
      showMyCy() {
        cyGraph.initCyDummy(this.$refs.myCy);
        addListeners();
        addOnDeleteListener();
      }
    }
  }



</script>

<style>
  #canvas {
    background: blanchedalmond;
  }

  .btn .active {
    background-color: #666;
    color: white;
  }

  #cy {
    width: 100%;
    height: 500px;
    display: block;
    border: 1px solid black;
  }
</style>
