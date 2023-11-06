let spacingMargin = 2 * 2; // Set the margin for the spacing.
let unitWidth, unitHeight; // Declare the unit width and height for rectangles.
let backgroundColor = [255, 252, 242]; // Define the background color.
let colorPalette = [ // Define the color palette.
  [5, 5, 5],       // Dark color
  [43, 103, 175],  // Blue color
  [239, 86, 47],   // Red color
  [242, 234, 193], // Light color
];
let mainColor = [249, 213, 49]; // Define the main color used in the composition.

let rectanglesList = []; // Array to store the rectangle objects.

// Function to generate a random integer between 'a' and 'b'.
let randomInteger = (a, b) => floor(random(a, b));

class RectangularBlock {
  constructor(x, y, width, height, insideColor) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.insideColor = insideColor;
    this.targetX = random(0, width - unitWidth); // Target X position
    this.targetY = random(0, height - unitWidth); // Target Y position
    this.easing = 0.001; // Easing coefficient
  }

  // Method to check if this rectangle intersects with another one.
  intersects(otherRect) {
    return (
      (this.x <= otherRect.x + otherRect.width && this.x + this.width >= otherRect.x) &&
      (this.y <= otherRect.y + otherRect.height && this.y + this.height >= otherRect.y)
    );
  }

  // Method to update the position of the rectangle with easing.
  updatePosition() {
    // Computational easing
    this.x += (this.targetX - this.x) * this.easing;
    this.y += (this.targetY - this.y) * this.easing;
  }

  // Method to display the rectangle.
  display() {
    if (this.insideColor) {
      fill(this.insideColor);
      rect(this.x + 2 * unitHeight, this.y + 2 * unitHeight, this.width - 3 * unitHeight, this.height - 3 * unitHeight);
      if ((this.width - this.height) < 2 * unitWidth) {
        fill(colorPalette[floor(random(colorPalette.length))]);
        if (this.width < this.height) {
          rect(this.x + 3 * unitHeight, this.y + (this.height - (this.width - 6 * unitHeight)) / 2, this.width - 5 * unitHeight, this.width - 5 * unitHeight);
        } else if (this.height < this.width) {
          rect(this.x + (this.width - (this.height - 6 * unitHeight)) / 2, this.y + 3 * unitHeight, this.height - 5 * unitHeight, this.height - 5 * unitHeight);
        }
      }
    }

    let prevCol1, prevCol2, newCol;
    let x = this.x;
    while (x < this.x + this.width + unitHeight / 2) {
      newCol = getRandomColor(prevCol1);
      if (random() < 2 / 3) newCol = mainColor;
      fill(newCol);
      prevCol1 = newCol;
      square(x, this.y, unitHeight);
      x += unitHeight;
    }

    x = this.x;
    while (x < this.x + this.width + unitHeight / 2) {
      newCol = getRandomColor(prevCol2);
      if (random() < 2 / 3) newCol = mainColor;
      fill(newCol);
      prevCol2 = newCol;
      square(x, this.y + this.height, unitHeight);
      x += unitHeight;
    }

    let y = this.y + unitHeight;
    while (y < this.y + this.height - unitHeight / 2) {
      newCol = getRandomColor(prevCol1);
      if (random() < 2 / 3) newCol = mainColor;
      fill(newCol);
      prevCol1 = newCol;
      square(this.x, y, unitHeight);
      y += unitHeight;
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Set up the canvas size.
  unitWidth = width / 16;  // Calculate the unit width based on canvas width.
  unitHeight = unitWidth / 4; // Calculate the unit height as a quarter of the unit width.
  noStroke(); // Disable drawing strokes.
  createComposition(); // Call the function to create the composition.
  animateRectangles();
}

function draw() {
  background(backgroundColor); // Set the background color.
  translate(-width / 2 - unitHeight / 2, -height / 2 - unitHeight / 2); // Center the composition.
  for (let recta of rectanglesList) {
    recta.display(); // Display each rectangle.
  }
}

// This function creates the overall composition of rectangles.
function createComposition() {
  // Attempt to create up to 2000 rectangles.
  for (let i = 0; i < 2000; i++) {
    let newRectangle = generateRectangle(); // Generate a new rectangle.
    let canAdd = true; // Check if the rectangle can be added.
    
    // Check for intersections with existing rectangles.
    for (let rectangle of rectanglesList) {
      if (rectangle.intersects(newRectangle)) {
        canAdd = false; // Set flag to false if there is an intersection.
        break;
      }
    }
    if (canAdd) {
      rectanglesList.push(newRectangle); // Add the new rectangle if there is no intersection.
    }
  }

  // fill the gaps with 1x1 rectangles
  for (let i = spacingMargin; i < 32 - spacingMargin; i++) {
    for (let j = spacingMargin; j < 32 - spacingMargin; j++) {
      let newRectangle = new RectangularBlock(i * unitWidth, j * unitWidth, unitWidth, unitWidth, null);
      let canAdd = true;
      // Check for intersections with existing rectangles.
      for (let rectangle of rectanglesList) {
        if (rectangle.intersects(newRectangle)) {
          canAdd = false;
          break;
        }
      }
      if (canAdd) {
        rectanglesList.push(newRectangle); // Add the new rectangle if there is no intersection.
      }
    }
  }

  // choose the rectangles with color rectangles inside
  let colorsCopy = colorPalette.slice(); // Copy the palette
  let index = 0;
  let remainingColors = colorsCopy.slice(); // Array to track remaining colors.
  // Loop until there are no colors left to assign.
  while (remainingColors.length > 0) {
    if (rectanglesList[index].width > unitWidth && rectanglesList[index].height > unitWidth && (rectanglesList[index].width + rectanglesList[index].height) < 7 * unitWidth) {
      rectanglesList[index].insideColor = remainingColors.pop(); // Assign a color.
    }
    index++;
    if (index >= rectanglesList.length) break; // Stop if all rectangles are processed.
  }
}

// Function to generate a new rectangle with certain constraints.
function generateRectangle() {
  let widthInUnits, heightInUnits;
  let attempts = 0;
  while (attempts < 100) {
    widthInUnits = randomInteger(3, 10) / 2;
    heightInUnits = randomInteger(3, 10) / 2;
    // Make sure the rectangle does not meet certain conditions that are not allowed.
    if (!((widthInUnits == 1 && heightInUnits == 1) || (widthInUnits >= 4 && heightInUnits >= 4))) {
      let x0 = randomInteger(spacingMargin, 32 - spacingMargin - widthInUnits + 1) * unitWidth;
      let y0 = randomInteger(spacingMargin, 32 - spacingMargin - heightInUnits + 1) * unitWidth;
      let insideColor = null;
      // Draw the rectangle directly here
      if (insideColor) {
        fill(insideColor);
        rect(x0 + 2 * unitHeight, y0 + 2 * unitHeight, widthInUnits * unitWidth - 3 * unitHeight, heightInUnits * unitWidth - 3 * unitHeight);
        if ((widthInUnits * unitWidth - heightInUnits * unitWidth) < 2 * unitWidth) {
          fill(colorPalette[floor(random(colorPalette.length))]);
          if (widthInUnits * unitWidth < heightInUnits * unitWidth) {
            rect(x0 + 3 * unitHeight, y0 + (heightInUnits * unitWidth - (widthInUnits * unitWidth - 6 * unitHeight)) / 2, widthInUnits * unitWidth - 5 * unitHeight, widthInUnits * unitWidth - 5 * unitHeight);
          } else if (heightInUnits * unitWidth < widthInUnits * unitWidth) {
            rect(x0 + (widthInUnits * unitWidth - (heightInUnits * unitWidth - 6 * unitHeight)) / 2, y0 + 3 * unitHeight, heightInUnits * unitWidth - 5 * unitHeight, heightInUnits * unitWidth - 5 * unitHeight);
          }
        }
      }
      return new RectangularBlock(x0, y0, widthInUnits * unitWidth, heightInUnits * unitWidth, insideColor);
    }
    attempts++;
  }
  return null;
}

function animateRectangles() {
  for (let recta of rectanglesList) {
    recta.updatePosition(); // Update the position of each small rectangle
  }

  background(backgroundColor);
  translate(-width / 2 - unitHeight / 2, -height / 2 - unitHeight / 2);
  
  for (let recta of rectanglesList) {
    recta.display(); // Displays each small rectangle
  }

  requestAnimationFrame(animateRectangles); // Recursive call to implement animation
}

function getRandomColor(previousColor) {
  let newColor;
  while (true) {
    newColor = colorPalette[floor(random(colorPalette.length))];
    if (newColor !== previousColor) {
      return newColor;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup(); // Re-setup the sketch with the new window size.
  draw(); // Redraw the composition.
}
