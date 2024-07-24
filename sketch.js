const COLUMNS = 30;
const VERTICAL_GAP = 20; // Consistent vertical gap between shapes
const FORCE_FIELD_RADIUS = 300; // Radius of the invisible force field
const FRICTION = 0.95; // Friction coefficient to gradually stop the shapes
const COLLISION_BUFFER = 0; // Additional buffer to prevent overlap
let shapes = [];
let cellWidth, cellHeight;
let shapeSize;
const SIDE_BUFFER = 50; // Adjust this value to increase or decrease the space

let leftRect, rightRect;
const RECT_WIDTH = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#FA0041");

  gridCols = COLUMNS;
  let availableWidth = width - 2 * SIDE_BUFFER; // Available width for shapes
  cellWidth = availableWidth / gridCols;
  cellHeight = height / Math.floor(height / (cellWidth * 1.8));
  shapeSize = cellWidth * 0.8;

  for (let col = 0; col < gridCols; col++) {
    if (col % 3 === 2) continue;

    let y = 0;

    while (y + shapeSize <= height) {
      let x = SIDE_BUFFER + col * cellWidth + cellWidth / 2; // Add SIDE_BUFFER to x position

      if (random(1) > 0.2) {
        if (random(1) > 0.5) {
          shapes.push(new CircleShape(x, y + shapeSize / 2, shapeSize / 2));
          y += shapeSize + VERTICAL_GAP;
        } else {
          let pillHeight = 2.1 * shapeSize;
          if (y + pillHeight <= height) {
            shapes.push(
              new PillShape(x, y + pillHeight / 2, shapeSize, pillHeight)
            );
            y += pillHeight + VERTICAL_GAP;
          } else {
            break;
          }
        }
      } else {
        y += shapeSize + VERTICAL_GAP;
      }
    }
  }

  leftRect = new DraggableRect(0, 0, RECT_WIDTH, height);
  rightRect = new DraggableRect(width - RECT_WIDTH, 0, RECT_WIDTH, height);
}

function draw() {
  background("#FA0041");

  for (let shape of shapes) {
    shape.update();
  }
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      shapes[i].checkCollision(shapes[j]);
    }
  }
  for (let shape of shapes) {
    shape.display();
  }

  for (let shape of shapes) {
    leftRect.checkCollision(shape);
    rightRect.checkCollision(shape);
  }

  // Change cursor if over a draggable rect
  if (leftRect.isMouseOver() || rightRect.isMouseOver()) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

class Shape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
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

    if (abs(this.vx) < 0.01) this.vx = 0;
    if (abs(this.vy) < 0.01) this.vy = 0;

    this.checkEdges();
  }

  checkEdges() {
    // Override in subclasses to handle edge collisions if needed
  }
}

class CircleShape extends Shape {
  constructor(x, y, r) {
    super(x, y);
    this.r = r;
  }

  display() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }

  checkCollision(other) {
    let d, minDist, angle, overlap;
    if (other instanceof CircleShape) {
      d = dist(this.x, this.y, other.x, other.y);
      minDist = this.r + other.r + COLLISION_BUFFER;
      if (d < minDist) {
        angle = atan2(other.y - this.y, other.x - this.x);
        overlap = 0.5 * (minDist - d);
        this.x -= overlap * cos(angle);
        this.y -= overlap * sin(angle);
        other.x += overlap * cos(angle);
        other.y += overlap * sin(angle);
      }
    }
    if (other instanceof PillShape) {
      d = dist(this.x, this.y, other.x, other.y);
      minDist = this.r + other.size + COLLISION_BUFFER;
      if (d < minDist) {
        angle = atan2(other.y - this.y, other.x - this.x);
        overlap = 0.5 * (minDist - d);
        this.x -= overlap * cos(angle);
        this.y -= overlap * sin(angle);
        other.x += overlap * cos(angle);
        other.y += overlap * sin(angle);
      }
    }
  }

  checkEdges() {
    if (this.x - this.r < 0) {
      this.x = this.r;
      this.vx *= -1;
    } else if (this.x + this.r > width) {
      this.x = width - this.r;
      this.vx *= -1;
    }

    if (this.y - this.r < 0) {
      this.y = this.r;
      this.vy *= -1;
    } else if (this.y + this.r > height) {
      this.y = height - this.r;
      this.vy *= -1;
    }
  }
}

class PillShape extends Shape {
  constructor(x, y, size, height) {
    super(x, y);
    this.size = size;
    this.height = height;
  }

  display() {
    fill(255);
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.height, this.size);
  }

  checkCollision(other) {
    let d, minDist, angle, overlap;
    if (other instanceof CircleShape) {
      d = dist(this.x, this.y, other.x, other.y);
      minDist = this.size + other.r + COLLISION_BUFFER;
      if (d < minDist) {
        angle = atan2(other.y - this.y, other.x - this.x);
        overlap = 0.5 * (minDist - d);
        this.x -= overlap * cos(angle);
        this.y -= overlap * sin(angle);
        other.x += overlap * cos(angle);
        other.y += overlap * sin(angle);
      }
    }
    if (other instanceof PillShape) {
      d = dist(this.x, this.y, other.x, other.y);
      minDist = this.size + other.size + COLLISION_BUFFER;
      if (d < minDist) {
        angle = atan2(other.y - this.y, other.x - this.x);
        overlap = 0.5 * (minDist - d);
        this.x -= overlap * cos(angle);
        this.y -= overlap * sin(angle);
        other.x += overlap * cos(angle);
        other.y += overlap * sin(angle);
      }
    }
  }

  checkEdges() {
    if (this.x - this.size / 2 < 0) {
      this.x = this.size / 2;
      this.vx *= -1;
    } else if (this.x + this.size / 2 > width) {
      this.x = width - this.size / 2;
      this.vx *= -1;
    }

    if (this.y - this.height / 2 < 0) {
      this.y = this.height / 2;
      this.vy *= -1;
    } else if (this.y + this.height / 2 > height) {
      this.y = height - this.height / 2;
      this.vy *= -1;
    }
  }
}

class DraggableRect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isDragging = false;
    this.dragOffsetX = 0;
  }

  display() {
    // fill(255, 255, 255, 100);
    // noStroke();
    // rectMode(CENTER);
    // rect(this.x, this.y, this.w, this.h);
  }

  checkDrag(mx, my) {
    if (
      mx > this.x &&
      mx < this.x + this.w &&
      my > this.y &&
      my < this.y + this.h
    ) {
      this.isDragging = true;
      this.dragOffsetX = mx - this.x;
    }
  }

  stopDrag() {
    this.isDragging = false;
  }

  drag(mx) {
    if (this.isDragging) {
      this.x = mx - this.dragOffsetX;
      this.x = constrain(this.x, 0, width - this.w);
    }
  }

  isMouseOver() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    );
  }

  checkCollision(shape) {
    if (shape instanceof CircleShape) {
      if (
        this.x < shape.x + shape.r &&
        this.x + this.w > shape.x - shape.r &&
        this.y < shape.y + shape.r &&
        this.y + this.h > shape.y - shape.r
      ) {
        if (this.x > width / 2) {
          // Right rectangle
          shape.x = this.x - this.w - shape.r - COLLISION_BUFFER;
        } else {
          // Left rectangle
          shape.x = this.x + this.w + shape.r;
        }
      }
    } else if (shape instanceof PillShape) {
      if (
        this.x < shape.x + shape.size / 2 &&
        this.x + this.w > shape.x - shape.size / 2 &&
        this.y < shape.y + shape.height / 2 &&
        this.y + this.h > shape.y - shape.height / 2
      ) {
        if (this.x > width / 2) {
          // Right rectangle
          shape.x = this.x - shape.size / 2 - COLLISION_BUFFER;
        } else {
          // Left rectangle
          shape.x = this.x + this.w + shape.size / 2;
        }
      }
    }
  }
}

function mousePressed() {
  leftRect.checkDrag(mouseX, mouseY);
  rightRect.checkDrag(mouseX, mouseY);

  if (!leftRect.isDragging && !rightRect.isDragging) {
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
}

function mouseDragged() {
  leftRect.drag(mouseX);
  rightRect.drag(mouseX);
}

function mouseReleased() {
  leftRect.stopDrag();
  rightRect.stopDrag();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  shapes = [];
  setup();
  leftRect.y = 0;
  leftRect.h = height;
  rightRect.x = width - RECT_WIDTH;
  rightRect.y = 0;
  rightRect.h = height;
}
