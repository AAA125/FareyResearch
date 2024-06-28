let r;
let zoom = 1.0;
let translateX = 0;
let translateY = 0;
let centerX, centerY;
let pg;
let slider;

function setup() {
    createCanvas(windowWidth, windowHeight);
    centerX = width / 2;
    centerY = height / 2;
    r = min(width, height) * 0.4;
    frameRate(60);
    fill(0);
    circle(centerX,centerY,2*r);
    // Create the p5.Graphics object
    pg = createGraphics(width, height);

    // Create the slider
    slider = createSlider(0, 20, 10);
    slider.position(10, 10);
    slider.input(redrawFareyDiagram);

    // Draw the Farey diagrams on the p5.Graphics object
    redrawFareyDiagram();
}

function redrawFareyDiagram() {
    let iterations = slider.value();

    // Clear the p5.Graphics object
    pg.clear();
    pg.stroke(0);
    pg.noFill();
    pg.ellipse(centerX, centerY, r * 2, r * 2);
    // Draw the Farey diagram with the new number of iterations
    
    for(let k = 0; k < iterations; k++){
        
        FareyPoints(k, pg);
    }
}

function draw() {
  background(255);
  push();
  translate(translateX + width / 2, translateY + height / 2);
  scale(zoom);
  translate(-width / 2, -height / 2);

  // Display the p5.Graphics object
  image(pg, 0, 0);

  pop();
}

function mouseWheel(event) {
  let e = event.delta;
  let newZoom = zoom * (1 - e * 0.005);
  if (newZoom > 0.1 && newZoom < 10) {
    let mouseXScaled = (mouseX - translateX) / zoom;
    let mouseYScaled = (mouseY - translateY) / zoom;
    zoom = newZoom;
    translateX -= mouseXScaled * (zoom - newZoom);
    translateY -= mouseYScaled * (zoom - newZoom);
  }
}

function mouseDragged() {
  translateX += mouseX - pmouseX;
  translateY += mouseY - pmouseY;
}

function FareyPoints(n, pg) {
  let P = Farey(n);

  // Draw the points on the circle
  for (let i = 0; i < P.length; i++) {
    let x = centerX + r * cos(P[i]);
    let y = centerY - r * sin(P[i]);
    pg.fill(255,0,0);
    pg.noStroke();
    pg.ellipse(x, y, 5, 5);
  }

  // Calculate and draw intersections and new circles
  for (let i = 0; i < P.length; i++) {
    let nextIndex = (i + 1) % P.length;
    let angle1 = P[i];
    let angle2 = P[nextIndex];

    let intersection = calculateIntersection(angle1, angle2);

    if (!isNaN(intersection[0]) && !isNaN(intersection[1])) {
      // Draw intersection point
      //pg.fill(255, 0, 0);
      //pg.noStroke();
      //pg.ellipse(intersection[0], intersection[1], 10, 10);

      // Calculate distance to one of the original Farey circle points
      let x1 = centerX + r * cos(angle1);
      let y1 = centerY - r * sin(angle1);
      let distance = dist(intersection[0], intersection[1], x1, y1);

      // Draw new circle
      pg.noFill();
      pg.stroke(0, 0, 0);
      pg.strokeWeight(2);
      pg.ellipse(intersection[0], intersection[1], distance * 2, distance * 2);
    }
  }
}

function calculateIntersection(angle1, angle2) {
  // Calculate points on the circle
  let x1 = centerX + r * cos(angle1);
  let y1 = centerY - r * sin(angle1);
  let x2 = centerX + r * cos(angle2);
  let y2 = centerY - r * sin(angle2);

  // Calculate tangent slopes
  let m1 = cos(angle1) / sin(angle1);
  let m2 = cos(angle2) / sin(angle2);

  // Handle vertical tangents
  if (abs(sin(angle1)) < 1e-6 || abs(sin(angle2)) < 1e-6) {
    let x, y;
    if (abs(sin(angle1)) < 1e-6) {
      x = x1;
      y = m2 * (x - x2) + y2;
    } else {
      x = x2;
      y = m1 * (x - x1) + y1;
    }
    return [x, y];
  }

  // Calculate intersection
  let x = (y2 - y1 + m1 * x1 - m2 * x2) / (m1 - m2);
  let y = m1 * (x - x1) + y1;

  return [x, y];
}

function Farey(n) {
  let equi = [];
  if (n == 0) {
    for (let i = 0; i < 4; i++) {
      equi.push((i * PI) / 2);
    }
  } else {
    let prevFarey = Farey(n - 1);
    for (let j = 0; j < prevFarey.length - 1; j++) {
      equi.push(prevFarey[j]);
      equi.push((prevFarey[j] + prevFarey[j + 1]) / 2);
    }
    equi.push(prevFarey[prevFarey.length - 1]);
    equi.push((prevFarey[prevFarey.length - 1] + 2 * PI) / 2);
  }
  return equi;
}
