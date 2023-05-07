
let numWordsSlider;
let numClonesSlider;
let radiusSlider;
let rotationSlider;
let textStringInput;
let textSizeSlider;
let angleSlider;

let centerX;
let centerY;

let exportButton;

let wideMedium;
let wideBold;
let spatialBold;
let fontSelector;


function preload() {
    PPRightGrotesk_WideMediumItalic = loadFont('fonts/PPRightGrotesk-WideMediumItalic.ttf');
    PPRightGroteskText_WideBoldItalic = loadFont('fonts/PPRightGroteskText-WideBoldItalic.ttf');
    PPRightGroteskText_SpatialBoldItalic = loadFont('fonts/PPRightGroteskText-SpatialBoldItalic.ttf');
}

function setup() {
  createCanvas(800, 800, SVG);

  // Set up sliders with initial values and positions
  let labelY = 20;
  let spacingY = 40;

  // Font selector
  let fontSelectorLabel = createDiv("Font selector");
  fontSelectorLabel.style('font-family', 'Arial');
  fontSelectorLabel.position(20, labelY - 10);
  fontSelector = createSelect();
  fontSelector.option('PPRightGrotesk-WideMediumItalic');
  fontSelector.option('PPRightGroteskText-WideBoldItalic');
  fontSelector.option('PPRightGroteskText-SpatialBoldItalic');
  fontSelector.changed(changeFont);
  fontSelector.position(20, labelY +5);

  // Create text input panel in the first row
  let textStringLabel = createDiv("Text String");
  textStringLabel.style('font-family', 'Arial');
  textStringLabel.position(20, labelY + 10 * 3);
  textStringInput = createInput('Hello');
  textStringInput.position(20, labelY + 10 + spacingY);

  let numWordsLabel = createDiv("Number of Words");
  numWordsLabel.style('font-family', 'Arial');
  numWordsLabel.position(20, labelY + spacingY *2);
  numWordsSlider = createSlider(1, 20, 10);
  numWordsSlider.position(20, labelY + 10 + spacingY*2);

  let numClonesLabel = createDiv("Number of Clones");
  numClonesLabel.style('font-family', 'Arial');
  numClonesLabel.position(20, labelY + spacingY * 3);
  numClonesSlider = createSlider(1, 24, 12);
  numClonesSlider.position(20, labelY + 10 + spacingY * 3);

  let radiusLabel = createDiv("Radius:");
  radiusLabel.style('font-family', 'Arial');
  radiusLabel.position(20, labelY + spacingY * 4);
  radiusSlider = createSlider(10, 200, 50);
  radiusSlider.position(20, labelY + 10 + spacingY * 4);

  let rotationLabel = createDiv("Rotation");
  rotationLabel.style('font-family', 'Arial');
  rotationLabel.position(20, labelY + spacingY * 5);
  rotationSlider = createSlider(0.01, 0.5, 0.1, 0.01);
  rotationSlider.position(20, labelY + 10 + spacingY * 5);

  let textSizeLabel = createDiv("Text Size:");
  textSizeLabel.style('font-family', 'Arial');
  textSizeLabel.position(20, labelY + spacingY * 6);
  textSizeSlider = createSlider(10, 50, 16);
  textSizeSlider.position(20, labelY + 10 + spacingY * 6);

  let angleLabel = createDiv("Angle:");
  angleLabel.position(20, labelY + spacingY * 7);
  angleSlider = createSlider(0, 1, 0.1, 0.01);
  angleSlider.position(20, labelY + 10 + spacingY * 7);

  centerX = width / 2;
  centerY = height / 2;

  // Create export button
  exportButton = createButton('Export as .svg');
  exportButton.position(20, 350);
  exportButton.mousePressed(exportSVG);
}

function draw() {
  clear();
  background(255, 255, 255, 0);


  // Get values from sliders and input field
  let numWords = numWordsSlider.value();
  let numClones = numClonesSlider.value();
  let radius = radiusSlider.value();
  let rotation = rotationSlider.value();
  let textString = textStringInput.value();
  let textSizeValue = textSizeSlider.value();
  let angle = angleSlider.value();

  // Update center position based on canvas center
  centerX = width / 2;
  centerY = height / 2;

// Draw radial spiral of text
for (let i = 0; i < numWords; i++) {
for (let j = 0; j < numClones; j++) {
let x = centerX + radius * cos(angle + j * TWO_PI / numClones);
let y = centerY + radius * sin(angle + j * TWO_PI / numClones);
push();
translate(x, y);
rotate(rotation);
textAlign(CENTER, CENTER);
textSize(textSizeValue);
textFont(fontSelector.value());
  
  // Calculate angle to align text towards center
  let angleToCenter = atan2(centerY - y, centerX - x);
  rotate(angleToCenter - HALF_PI);
  
  text(textString, 0, 0);
  pop();
}
angle += rotation;
  
  }
}

function changeFont() {
    let selectedFont = fontSelector.value();
    let font = loadFont(`fonts/${selectedFont}.ttf`, () => {
      textFont(font);
    });
  }


function exportSVG() {
    save("mySVG.svg"); 
}