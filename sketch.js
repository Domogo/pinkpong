const COLUMNS = 30;
const VERTICAL_GAP = 20; // Consistent vertical gap between shapes
const LEFT_MARGIN = 50; // Space on the left side of the first column
const FORCE_FIELD_RADIUS = 300; // Radius of the invisible force field
const FRICTION = 0.95; // Friction coefficient to gradually stop the shapes
let shapes = [];
let cellWidth, cellHeight;
let shapeSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#FA0041");

  gridCols = COLUMNS;
  cellWidth = (width - LEFT_MARGIN) / gridCols; // Adjust cellWidth to account for the left margin
  cellHeight = cellWidth * 1.8; // To maintain the aspect ratio similar to the original design
  shapeSize = cellWidth * 0.8; // Adjust size to fit within the cells

  for (let col = 0; col < gridCols; col++) {
    if (col % 3 === 2) {
      // Skip every third column (0-based index)
      continue;
    }

    let y = VERTICAL_GAP / 2; // Start y position with the first gap

    while (y + shapeSize / 2 <= height) {
      let x = col * cellWidth + cellWidth / 2 + LEFT_MARGIN; // Add LEFT_MARGIN to x position

      // Randomly decide to skip this row
      if (random(1) > 0.2) {
        // 80% chance to place a shape, 20% to skip
        if (random(1) > 0.5) {
          if (y + shapeSize <= height) {
            shapes.push(new CircleShape(x, y + shapeSize / 2, shapeSize / 2));
            y += shapeSize + VERTICAL_GAP; // Move to the next position including the gap
          } else {
            break;
          }
        } else {
          let pillHeight = 2.1 * shapeSize + VERTICAL_GAP;
          if (y + pillHeight <= height) {
            shapes.push(
              new PillShape(x, y + pillHeight / 2, shapeSize, pillHeight)
            );
            y += pillHeight + VERTICAL_GAP; // Move to the next position including the gap
          } else {
            break;
          }
        }
      } else {
        y += shapeSize + VERTICAL_GAP; // Move to the next position including the gap if skipping
      }
    }
  }
}

function draw() {
  background("#FA0041");
  for (let shape of shapes) {
    shape.update();
    shape.display();
  }
}

class CircleShape {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = 0;
    this.vy = 0;
  }

  display() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }

  move(dx, dy) {
    this.vx += dx;
    this.vy += dy;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= FRICTION;
    this.vy *= FRICTION;
  }
}

class PillShape {
  constructor(x, y, size, height) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.height = height;
    this.vx = 0;
    this.vy = 0;
  }

  display() {
    fill(255);
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.height, this.size);
  }

  move(dx, dy) {
    this.vx += dx;
    this.vy += dy;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= FRICTION;
    this.vy *= FRICTION;
  }
}

function mousePressed() {
  for (let shape of shapes) {
    let d = dist(mouseX, mouseY, shape.x, shape.y);
    if (d < FORCE_FIELD_RADIUS) {
      let angle = atan2(shape.y - mouseY, shape.x - mouseX);
      let force = map(d, 0, FORCE_FIELD_RADIUS, 15, 0);
      let dx = cos(angle) * force;
      let dy = sin(angle) * force;
      shape.move(dx, dy);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  shapes = [];
  setup();
}
