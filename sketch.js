const COLUMNS = 30;
const VERTICAL_GAP = 20; // Consistent vertical gap between shapes
const LEFT_MARGIN = 50; // Space on the left side of the first column
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
          if (y + shapeSize * 1.8 <= height) {
            shapes.push(new PillShape(x, y + shapeSize * 0.9, shapeSize));
            y += shapeSize * 1.8 + VERTICAL_GAP; // Move to the next position including the gap
          } else {
            break;
          }
        }
      } else {
        y += shapeSize + VERTICAL_GAP; // Move to the next position including the gap if skipping
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
