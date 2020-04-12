<template>
  <div>
    <h1>Manual Graph</h1>
    <div id="edit_graph_btn_group" class="btn_group">
      <button id="add_vertex" class="btn" v-bind:class="{active: activeButton === 'add_vertex'}" v-on:click="changeActiveButton('add_vertex')">Add Vertex</button>
      <button id="add_edge" class="btn"  v-bind:class="{active: activeButton === 'add_edge'}" v-on:click="changeActiveButton('add_edge')">Add Edge</button>
    </div>
    <button id="draw_circle_by_click" v-on:click="draw">Draw something in canvas</button>
    <canvas id="canvas" width="500" height="500">
    </canvas>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeButton: 'add_vertex',
      }
    },
    methods: {
      changeActiveButton(activeButtonName) {
        this.activeButton = activeButtonName
      },
      draw(event) {
        var canvas = document.getElementById('canvas');
        if (canvas.getContext) {
          var ctx = canvas.getContext('2d');
          var pos = getMousePosition(canvas, event);
          var pos_x = pos.x;
          var pos_y = pos.y;
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(pos_x, pos_y, 50, 0, 2 * Math.PI);
          ctx.fill();
        }
      },

      getMousePosition(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        }
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
</style>
