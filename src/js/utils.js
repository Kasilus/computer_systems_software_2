function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function readSingleFile(e, bindCallback) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    bindCallback(contents);
  };
  reader.readAsText(file);
}

function removeFromArray(arr, values) {
  return arr.filter(function(value, index) {
    return values.indexOf(value) == -1;
  })
}

function printMap(map) {
  for ([k,v] of map) {
    console.log("k=" + k + ", v=" + v);
  }
}

function sortMapByValuesDesc(map) {
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
}

function sortMapByValuesAsc(map) {
  return new Map([...map.entries()].sort((a, b) => a[1] - b[1]));
}

function getKeyValuePairByMaxValue(map) {
  var maxKey = map.keys().next().value;
  var maxValue = map.get(maxKey);
  var maxPair = [maxKey, maxValue];
  for ([k, v] of map) {
    if (maxPair[1] < v) {
      maxPair = [k, v];
    }
  }
  return maxPair;
}
