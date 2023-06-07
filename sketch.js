let numClonesSlider;
let radiusSlider;
let rotationSlider;
let textStringInput;
let textSizeSlider;
let angleSlider;
let rectSizeSlider;
let numSpiralSlider;
let clonePositionSlider;
let xScaleSlider;
let charSpacingAngleSlider;
 
let useMode = [
    { id: "rectDrawMode", buttonLabel: "Rect Draw Mode" },
    { id: "textMode", buttonLabel: "Text Mode" },
    { id: "textBendMode", buttonLabel: "Text Bend Mode" },
];
 
let currentModeIndex = 'rectDrawMode';
 
let centerX;
let centerY;
 
let exportButton;
 
let wideMedium;
let wideBold;
let spatialBold;
let fontSelector;
 
function preload() {
    WideMediumItalic = loadFont("fonts/WideMediumItalic.ttf");
    SpatialBoldItalic = loadFont("fonts/SpatialBoldItalic.ttf");
    WideBoldItalic = loadFont("fonts/WideBoldItalic.ttf");
}
 
function setup() {
    createCanvas(windowWidth, windowHeight, SVG);
 
    let container = createDiv();
    container.class("gui-container");
 
    let numClonesLabel = createDiv("Number of clones");
    numClonesLabel.parent(container);
    numClonesLabel.addClass("default-mode");
    numClonesSlider = createSlider(1, 20, 10);
    numClonesSlider.parent(container);
    numClonesSlider.addClass("default-mode");
 
    let numSpiralLabel = createDiv("Number of spirals");
    numSpiralLabel.parent(container);
    numSpiralLabel.addClass("default-mode");
    numSpiralSlider = createSlider(1, 20, 1);
    numSpiralSlider.parent(container);
    numSpiralSlider.addClass("default-mode");
 
    let clonePosLabel = createDiv("Spiral position");
    clonePosLabel.parent(container);
    clonePosLabel.addClass("default-mode");
    clonePosSlider = createSlider(10, 200, 100, 10);
    clonePosSlider.parent(container);
    clonePosSlider.addClass("default-mode");
 
    let radiusLabel = createDiv("Radius");
    radiusLabel.parent(container);
    radiusLabel.addClass("default-mode");
    radiusSlider = createSlider(10, 300, 150);
    radiusSlider.parent(container);
    radiusSlider.addClass("default-mode");
 
    let rotationLabel = createDiv("Rotation");
    rotationLabel.parent(container);
    rotationLabel.addClass("default-mode");
    rotationSlider = createSlider(0.01, 10, 3, 0.01);
    rotationSlider.parent(container);
    rotationSlider.addClass("default-mode");
 
    let angleLabel = createDiv("Angle");
    angleLabel.parent(container);
    angleLabel.addClass("default-mode");
    angleSlider = createSlider(0, 1, 0.1, 0.01);
    angleSlider.parent(container);
    angleSlider.addClass("default-mode");
 
    let rectSizeLabel = createDiv("Rectangle size");
    rectSizeLabel.parent(container);
    rectSizeLabel.addClass("rect-mode");
    rectSizeSlider = createSlider(10, 150, 50);
    rectSizeSlider.parent(container);
    rectSizeSlider.addClass("rect-mode");

        // Font selector
        let fontSelectorLabel = createDiv("Font selector");
        fontSelectorLabel.parent(container);
        fontSelectorLabel.class("text-mode");
        let fontSelectorContainer = createDiv();
        fontSelectorContainer.parent(container);
        fontSelectorContainer.class("select");
        fontSelectorContainer.addClass("text-mode");
        let fontSelectorArrow = createDiv();
        fontSelectorArrow.parent(fontSelectorContainer);
        fontSelectorArrow.class("select_arrow");
     
        fontSelector = createSelect();
        fontSelector.parent(fontSelectorContainer);
        fontSelector.option("WideMediumItalic");
        fontSelector.option("WideBoldItalic");
        fontSelector.option("SpatialBoldItalic");
        fontSelector.changed(changeFont);
        selectedFont = fontSelector.value();
     
        // Create text input panel in the first row
        let textStringLabel = createDiv("Text input");
        textStringLabel.parent(container);
        textStringLabel.addClass("text-mode");
        textStringInput = createInput("Hello");
        textStringInput.parent(container);
        textStringInput.addClass("css-input text-mode");
     
        let textSizeLabel = createDiv("Type size");
        textSizeLabel.parent(container);
        textSizeLabel.addClass("text-mode");
        textSizeSlider = createSlider(0, 100, 50);
        textSizeSlider.parent(container);
        textSizeSlider.addClass("text-mode");
     
        let xScaleLabel = createDiv("X-Scale");
        xScaleLabel.parent(container);
        xScaleLabel.addClass("text-mode");
        xScaleSlider = createSlider(1, 5, 1, 0.01);
        xScaleSlider.parent(container);
        xScaleSlider.addClass("text-mode");
 
    let charSpacingLabel = createDiv("Character bend");
    charSpacingLabel.parent(container);
    charSpacingLabel.addClass("textdistort-mode");
    charSpacingAngleSlider = createSlider(20, 100, 20, 0.01);
    charSpacingAngleSlider.parent(container);
    charSpacingAngleSlider.addClass("textdistort-mode");
 
    centerX = width / 2;
    centerY = height / 2;
 
    let buttonContainer = createDiv();
    buttonContainer.class("buttonContainer");
    buttonContainer.parent(container);
 
    for (let i = 0; i < useMode.length; i++) {
        let modeButton = createButton(useMode[i].buttonLabel)
            .parent(buttonContainer)
            .mousePressed(() => {
                currentModeIndex = useMode[i].id;
                // Draw only when the button was pressed.
                buttonContainer.elt.className = "buttonContainer " + currentModeIndex;
                manualDraw();
            });
    }
 
    // Create export button
    exportButton = createButton("Export");
    exportButton.parent(buttonContainer);
    exportButton.mousePressed(exportSVG);
 
    // Draw only when there is a change in any of the sliders.
    [
        numClonesSlider,
        radiusSlider,
        rotationSlider,
        textStringInput,
        textSizeSlider,
        angleSlider,
        rectSizeSlider,
        numSpiralSlider,
        xScaleSlider,
        charSpacingAngleSlider,
        clonePosSlider
    ].forEach((slider) => {
        if (slider && slider.elt) {
            slider.elt.addEventListener("input", () => {
                manualDraw();
            });
        }
    });
 
    // First initial draw.
    manualDraw();
}
 
function manualDraw() {
    clear();
    background(255, 255, 255);
 
    // Set current mode
    const currentMode = currentModeIndex;
 
  console.log(currentModeIndex);
 
    // Get values from sliders and input field
    let numClones = numClonesSlider.value();
    let radius = radiusSlider.value();
    let rotation = rotationSlider.value();
    let textString = textStringInput.value();
    let textSizeValue = textSizeSlider.value();
    let angle = angleSlider.value();
    let numSpirals = numSpiralSlider.value();
    let clonePosition = clonePosSlider.value();
    let xScaleValue = xScaleSlider.value();
    let charBendValue = charSpacingAngleSlider.value();

 
    // Update center position based on canvas center
    centerX = width / 2;
    centerY = height / 2;
 
    // Draw based on the current mode
    if (currentMode === "rectDrawMode") {
        let rectElements = selectAll(".rect-mode");
        let defaultElements = selectAll(".default-mode");
        let textElements = selectAll(".text-mode");
        let textDistortElements = selectAll(".textdistort-mode");
 
        for (let i = 0; i < rectElements.length; i++) {
            rectElements[i].style("display", "block");
        }
 
        for (let i = 0; i < defaultElements.length; i++) {
            defaultElements[i].style("display", "block");
        }
 
        for (let i = 0; i < textElements.length; i++) {
            textElements[i].style("display", "none");
        }
 
        for (let i = 0; i < textDistortElements.length; i++) {
            textDistortElements[i].style("display", "none");
        }
 
        rectDrawMode(
            numClones,
            radius,
            rotation,
            angle,
            numSpirals,
            clonePosition
        );
    } else if (currentMode === "textMode") {
        rectElements = selectAll(".rect-mode");
        defaultElements = selectAll(".default-mode");
        textElements = selectAll(".text-mode");
        textDistortElements = selectAll(".textdistort-mode");
 
        for (let i = 0; i < rectElements.length; i++) {
            rectElements[i].style("display", "none");
        }
 
        for (let i = 0; i < defaultElements.length; i++) {
            defaultElements[i].style("display", "block");
        }
 
        for (let i = 0; i < textElements.length; i++) {
            textElements[i].style("display", "block");
        }
 
        for (let i = 0; i < textDistortElements.length; i++) {
            textDistortElements[i].style("display", "none");
        }
 
        textMode(
            numClones,
            textString,
            textSizeValue,
            xScaleValue,
            radius,
            rotation,
            angle,
            numSpirals,
            clonePosition
        );
    } else if (currentMode === "textBendMode") {
        rectElements = selectAll(".rect-mode");
        defaultElements = selectAll(".default-mode");
        textElements = selectAll(".text-mode");
        textDistortElements = selectAll(".textdistort-mode");
 
        for (let i = 0; i < rectElements.length; i++) {
            rectElements[i].style("display", "none");
        }
 
        for (let i = 0; i < defaultElements.length; i++) {
            defaultElements[i].style("display", "block");
        }
 
        for (let i = 0; i < textElements.length; i++) {
            textElements[i].style("display", "block");
        }
 
        for (let i = 0; i < textDistortElements.length; i++) {
            textDistortElements[i].style("display", "block");
        }
 
        txtBendMode({
            numClones,
            textString,
            textSizeValue,
            xScaleValue,
            radius,
            rotation,
            angle,
            numSpirals,
            clonePosition,
            charBendValue,
        });
    }
}
 
function rectDrawMode(
    numClones,
    radius,
    rotation,
    angle,
    numSpirals,
    clonePosition
) {
    // Draw rectangles
    for (let i = 0; i < numSpirals; i++) {
        for (let j = 0; j < numClones; j++) {
            let x =
                centerX +
                (radius + clonePosition * i) *
                    cos(angle + (j * TWO_PI) / numClones);
            let y =
                centerY +
                (radius + clonePosition * i) *
                    sin(angle + (j * TWO_PI) / numClones);
            push();
            translate(x, y);
            drawRectangleWithAngle(x, y, centerX, centerY);
            pop();
        }
        angle += rotation;
    }
}
 
function drawRectangleWithAngle(x, y, centerX, centerY) {
    // Calculate angle between rectangle and center
    let rectAngle = atan2(centerY - y, centerX - x);
    rotate(rectAngle);
 
    // Draw rectangle
    rectMode(CENTER);
    let c = color(0, 0, 0);
    fill(c);
    noStroke();
    rect(0, 0, rectSizeSlider.value(), rectSizeSlider.value() / 2);
}
 
function textMode(
    numClones,
    textString,
    textSizeValue,
    xScaleValue,
    radius,
    rotation,
    angle,
    numSpirals,
    clonePosition
) {
    for (let i = 0; i < numSpirals; i++) {
        for (let j = 0; j < numClones; j++) {
            let x =
                centerX +
                (radius + clonePosition * i) *
                    cos(angle + (j * TWO_PI) / numClones);
            let y =
                centerY +
                (radius + clonePosition * i) *
                    sin(angle + (j * TWO_PI) / numClones);
            drawTextAtPosition(
                x,
                y,
                rotation,
                textSizeValue,
                textString,
                centerX,
                centerY,
                xScaleValue
            );
        }
        angle += rotation;
    }
}
 
function drawTextAtPosition(
    x,
    y,
    rotation,
    textSizeValue,
    textString,
    centerX,
    centerY,
    xScaleValue
) {
    push();
    translate(x, y);
    rotate(rotation);
    textAlign(LEFT, BASELINE);
    textSize(textSizeValue);
    textFont(fontSelector.value());
    // Calculate angle to align text towards center
    let angleToCenter = atan2(centerY - y, centerX - x);
    rotate(angleToCenter - HALF_PI);
    scale(xScaleValue, 1);
    text(textString, 0, 0);
    pop();
}
 
function txtBendMode({
    numClones,
    textString,
    textSizeValue,
    xScaleValue,
    radius,
    rotation,
    angle,
    numSpirals,
    clonePosition,
    charBendValue,
}) {
    for (let i = 0; i < numSpirals; i++) {
        for (let j = 0; j < numClones; j++) {
            let x =
                centerX +
                (radius + clonePosition * i) *
                    cos(angle + (j * TWO_PI) / numClones);
            let y =
                centerY +
                (radius + clonePosition * i) *
                    sin(angle + (j * TWO_PI) / numClones);
            // Call textBendMode and store the transformed text
            transformedText = textBendMode({
                x,
                y,
                rotation,
                textString,
                charBendValue,
                textSizeValue,
                xScaleValue,
                centerX,
                centerY,
            });
        }
        angle += rotation;
    }
}
 
function textBendMode({
    x,
    y,
    radius,
    rotation,
    textString,
    charBendValue,
    textSizeValue,
    xScaleValue,
    centerX,
    centerY,
}) {
    let chars = textString.split("");
 
    push();
    translate(x, y);
    rotate(rotation);
    textAlign(LEFT, BASELINE);
    textSize(textSizeValue);
    textFont(fontSelector.value());
    rotate(radians((chars.length * charBendValue) / 5));
 
    let angleToCenter = atan2(centerY - y, centerX - x);
    rotate(angleToCenter + HALF_PI);
 
    for (let i = 0; i < chars.length; i++) {
        scale(xScaleValue, 1);
        let spacedChar = addLetterSpacing(chars[i], 1); // Modify the spacing amount as desired
        text(spacedChar, 0, -100);
        rotate(radians(charBendValue / 2));
    }
    pop();
 
    // Join the characters back together into a variable
    transformedText = chars.join("");
    return transformedText;
}
 
function addLetterSpacing(input, amount, spacer) {
    // 'spacer' character to use
    // (can be passed in as an optional argument, or it
    // will use the unicode 'hair space' one by default)
    spacerCharacter = "\u200A" || spacer;
 
    // split the string into a list of characters
    let characters = input.split("");
 
    // create a series of spacers using the
    // repeat() function
    spacerCharacter = spacerCharacter.repeat(amount);
 
    // use join() to combine characters with the spacer
    // and send back as a string
    return characters.join(spacerCharacter);
}
 
function changeFont() {
    let selectedFont = fontSelector.value();
    let font = loadFont(`fonts/${selectedFont}.ttf`, () => {
        textFont(font);
        manualDraw();
    });
}
 
function exportSVG() {
    save("mySVG.svg");
}