<template>
  <div id="app">
    <ul class="top-level-menu">
      <li><a class="active" href="#graph">Graph<i class="down menu-arrow"></i></a>
        <ul class="second-level-menu">
          <li><a href="#newgraph">New...<i class="right menu-arrow"></i></a>
            <ul class="third-level-menu">
              <li><a href="#manual">Manual</a></li>
              <li><a href="#generate">Generate</a></li>
            </ul>
          </li>
          <li><router-link :to="{name: 'graph/upload'}">Load from file</router-link></li>
          <li><a href="#save">Save to file</a></li>
        </ul>
      </li>
      <li><a href="#smp">SMP</a></li>
      <li><a href="#modeling">Modeling<i class="down menu-arrow"></i></a>
        <ul class="second-level-menu">
          <li><a href="#cpuparams">CPU Parameters</a></li>
          <li><a href="#gantt">Gantt Chart</a></li>
          <li><a href="#modeling_stats">Statistics</a></li>
        </ul>
      </li>
      <li><a href="#statistics">Statistics<i class="down menu-arrow"></i></a>
        <ul class="second-level-menu">
          <li><a href="#stats_parameters">Parameters</a></li>
          <li><a href="#stats_results">Results</a></li>
        </ul>
      </li>
      <li><a href="#help">Help</a></li>
    </ul>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">
  .top-level-menu {
    padding: 0;
    height: 50px;
    list-style-type: none;
    background-color: #333;
  }

  .top-level-menu > li {
    position: relative;
    float: left;
    width: 150px;
  }

  .top-level-menu > li:hover { background: #111; }

  .top-level-menu > li a:hover:not(.active) {
    background-color: #111;
  }

  .top-level-menu li:hover > ul {
    display: block;
  }

  .top-level-menu a {
    display: block;
    padding-left: 10px;
    font: bold 14px Arial, Helvetica, sans-serif;
    text-decoration: none;
    line-height: 50px;
    color: white;
  }

  .second-level-menu {
    display: none;
    position: absolute;
    top: 50px;
    left: -40px;
    width: 150px;
    list-style-type: none;
  }

  .second-level-menu > li {
    position: relative;
    height: 50px;
    background-color: #219A23;
  }

  .second-level-menu > li:hover { background: #111; }

  .third-level-menu {
    display: none;
    position: absolute;
    top: 0;
    right: -150px;
    width: 150px;
    list-style-type: none;
  }

  .third-level-menu > li {
    height: 50px;
    background: #218923;
  }

  .third-level-menu > li:hover { background: #111; }

  .active {
    background-color: #21AB23;
  }

  i {
    border: solid black;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
  }

  .right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }

  .down {
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }

  .menu-arrow {
    float: right;
    margin-right: 14px;
    margin-top: 18px;
    border-color: white;
  }

  .active .menu-arrow {
    border-color: black;
  }

  .second-level-menu > li .menu-arrow {
    border-color: black;
  }

  .second-level-menu > li:hover .menu-arrow {
    border-color: white;
  }

  .third-level-menu > li .menu-arrow {
    border-color: black;
  }

  .third-level-menu > li:hover .menu-arrow {
    border-color: white;
  }
</style>
