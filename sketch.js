const COLUMNS = 29;
let shapes = [];
let shapeSize = 30;
let gridCols = 15;
let gridRows = 10;
let cellWidth, cellHeight;

function setup() {
  createCanvas(900, 600);
  background("#FA0041");
  cellWidth = width / gridCols;
  cellHeight = height / gridRows;

  for (let col = 0; col < gridCols; col++) {
    for (let row = 0; row < gridRows; row++) {
      let x = col * cellWidth + cellWidth / 2;
      let y = row * cellHeight + cellHeight / 2;

      if (random(1) > 0.5) {
        shapes.push(new CircleShape(x, y, shapeSize / 2));
      } else {
        shapes.push(new PillShape(x, y, shapeSize));
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
