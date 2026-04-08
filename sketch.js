
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255,0,220);
  
fill(123, 63, 0);
  
  ellipse(195, 200, 40, 40);
  stroke(255, 255, 255);  
  strokeWeight(19);
 
  ellipse(195, 135, 45, 50);
  
  
  //2 petalo
 fill(135, 206, 235);
  rotate(4/6);
  ellipse(292,-65, 81, 155);
  fill(255, 255, 255);
  ellipse(292, -65, 20, 20);
  
  
  //3 petalo
  fill(123, 63, 0);
  rotate(-4/6);
  ellipse(195,245, 50, 165);
  
  //3 petalo
  fill(135, 206, 235);
  rotate(-5/6);
  ellipse(-23,176, 81, 155);
  
  //3 petalo
fill(173, 216, 230);
  rotate(2/6);
  ellipse(111,346, 75, 120);
  
   //2 petalo
fill(173, 216, 230);
  rotate(6/6);
  ellipse(230,164, 75, 120)
}