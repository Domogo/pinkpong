const COLUMNS = 30;
let shapes = [];
let cellWidth, cellHeight;
let shapeSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#FA0041");

  gridCols = COLUMNS;
  cellWidth = width / gridCols;
  cellHeight = cellWidth * 1.8; // To maintain the aspect ratio similar to the original design
  gridRows = ceil(height / cellHeight);
  shapeSize = cellWidth * 0.8; // Adjust size to fit within the cells

  for (let col = 0; col < gridCols; col++) {
    for (let row = 0; row < gridRows; row++) {
      let x = col * cellWidth + cellWidth / 2;
      let y = row * cellHeight + cellHeight / 2;

      if (y + shapeSize / 2 <= height) {
        // Check to ensure shape does not overflow screen height
        if (random(1) > 0.5) {
          shapes.push(new CircleShape(x, y, shapeSize / 2));
        } else {
          shapes.push(new PillShape(x, y, shapeSize));
        }
      }
    }
  }

  for (let shape of shapes) {
    shape.display();
  }
}

class CircleShape {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  display() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
}

class PillShape {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  display() {
    fill(255);
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size * 1.8, this.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  shapes = [];
  setup();
}
