var canvas = document.getElementById('algo');
canvas.width = 600;
canvas.height = 300;
canvas.style.background = "#ffffff";
canvas.style.border = "4px solid #aaaaaa";
canvas.style.borderRadius = "10px";

var ctx = canvas.getContext('2d');
var grid = 6;

var generations = 500;
var maxMut = 2;
var target = false; // false for global minimum, true for global optimum
var popNum = 20;
var timestep = 5;
var band = 100;

function stats(){
  var bestCell =  "Best Cell: (" + (pop[0].x).toFixed(2) + ", " + (pop[0].y).toFixed(2) + ")";
  document.getElementById('stats').innerHTML = bestCell;
}

class Cell {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
  mutate() {
    this.x += 2 * maxMut * Math.random() - maxMut;
    this.y += 2 * maxMut * Math.random() - maxMut;
  }
  setXY(x,y) {
    this.x = x;
    this.y = y;
  }
  static combine(a,b){
    var temp = new Cell();
    var r = Math.round(3*Math.random());
    if(r==0) {
      temp.setXY(a.x,a.y);
    }
    else if(r==1) {
      temp.setXY(a.x,b.y);
    }
    else if(r==2) {
      temp.setXY(b.x,a.y);
    }
    else {
      temp.setXY(b.x,b.y);
    }
    return temp;
  }
}
//initialize population
var pop = [];
for (var i=0; i<popNum; i++) {
  var cell = new Cell();
  pop.push(cell);
}

function evolution() {
  setTimeout(function() {
    // refresh canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // combine make children and mutate them
    var child;
    for (var i=0; i<Math.floor(popNum/2); i++){
      child = Cell.combine(pop[2*i],pop[2*i+1]);
      child.mutate();
      pop.push(child);
    }
    // sort by form
    if(target == false) {
      // minimum finder
      pop.sort(function(a, b){return fun(a.x,a.y)-fun(b.x,b.y)});
    }
    else{
      pop.sort(function(a, b){return fun(b.x,b.y)-fun(a.x,a.y)});
    }

    // delete and show weaker ones
    while(pop.length != popNum){
      var thrown = pop.pop();
      depict(thrown.x,thrown.y,"#b00000");
    }
    // depict cells
    for (var i=0; i<pop.length; i++){
      depict(pop[i].x,pop[i].y,"#3030b0");
    }
    // show best cell
    stats();
    // show generation number
    document.getElementById('score').innerHTML = "Generation No. : " + (genNum+1);
    genNum++;
    if(genNum < generations) {
      evolution();
    }
    else {
      // clear canvas
      ctx.clearRect(0,0,canvas.width,canvas.height);
      // depict cells
      for (var i=0; i<pop.length; i++){
        depict(pop[i].x,pop[i].y,"#3030b0");
      }
    }
  }, timestep);
}

function depict(x,y,col){
  // change range to (0,1)
  renderedX = (x + band) / (2*band);
  renderedY = (y + band) / (2*band);
  // adjust variables to canvas
  renderedX = (renderedX)*(canvas.width - grid) + grid/2;
  renderedY = (1-renderedY)*(canvas.height - grid) + grid/2;
  // draw
  ctx.beginPath();
  ctx.fillStyle = col;
  ctx.arc(renderedX, renderedY, grid/2-1 , 0 , 2*Math.PI);
  ctx.fill();
}

function run() {
  // pass HTML text parameters
  if(document.getElementById('genForm').value != "")  generations = document.getElementById('genForm').value;
  if(document.getElementById('mutForm').value != "")  maxMut = document.getElementById('mutForm').value;
  if(document.getElementById('tarForm').value == "+"){
    target = true;
  }
  else{
    target = false;
  }

  for(var i=0; i<popNum; i++){
      pop[i].setXY( 2*band*Math.random()-band , 2*band*Math.random()-band);
  }
  genNum = 0;
  evolution();
}
function resetCanvas(){
  genNum = generations;
  setTimeout(function() {
    document.getElementById('score').innerHTML = "";
    document.getElementById('stats').innerHTML = "";
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }, timestep+1);
}
function fun(x,y){
  return x*x+y*y;
}
