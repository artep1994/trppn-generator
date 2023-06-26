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
 
const letters = {
    " ": { default: -1 },
    A: { V: -0.5, Y: -0.5, T: -0.2, W: -0.5 },
    T: { A: -0.3, a: -0.3, O: -0.5, o: -0.2, e: -0.2, w: -0.2 },
    L: { T: -0.1, V: -0.2, Y: -0.2, W: -0.2 },
    I: { S: 1 },
    V: { A: -0.1, "/": -0.1 },
    l: { e: -0.3, o: -1 },
    o: { l: -0.3 },
    V: { L: -0.2, W: -0.3, v: -0.2, w: -0.3 },
    Y: { A: -0.4, y: -0.4 },
    T: { L: -0.2, V: -0.3, t: -0.2 },
    W: { A: -0.5, w: -0.5 },
    A: { T: -0.2, V: -0.3, a: -0.3 },
    S: { I: -0.1 },
    e: { T: -0.2, l: -0.3 },
    w: { T: -0.2, v: -0.2 },
    o: { T: -0.2, l: -0.3 },
    a: { T: -0.3 },
    O: { T: -0.5 },
    Y: { L: -0.2, V: -0.3, y: -0.4 },
    l: { V: -0.2, t: -0.2 },
    "/": { V: -0.1 },
    v: { A: -0.1, L: -0.2, W: -0.3, y: -0.2, w: -0.3 },
    t: { A: -0.1, L: -0.2, V: -0.3 },
    y: { A: -0.4, L: -0.2, V: -0.3 },
};
 
let useMode = [
    { id: "rectDrawMode", buttonLabel: "Rectangle Mode" },
    { id: "textMode", buttonLabel: "Text Mode" },
    { id: "textBendMode", buttonLabel: "Distorted Text Mode" },
];
 
let currentModeIndex = "rectDrawMode";
 
let w = window.innerWidth;
let h = window.innerHeight;
 
let exportButton;
 
let wideMedium;
let wideBold;
let spatialBold;
let fontSelector;
 
const history = [];
 
function preload() {
    WideMediumItalic = loadFont("fonts/WideMediumItalic.ttf");
    SpatialBoldItalic = loadFont("fonts/SpatialBoldItalic.ttf");
    WideBoldItalic = loadFont("fonts/WideBoldItalic.ttf");
}
 
function pushHistory() {
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
    let rectSize = rectSizeSlider.value();
 
    history.push({
        numClones,
        radius,
        rotation,
        textString,
        textSizeValue,
        angle,
        numSpirals,
        clonePosition,
        xScaleValue,
        charBendValue,
        rectSize
    });
}
 
function resetState() {
    const state = history[0];
 
    numClonesSlider.value(state.numClones);
    radiusSlider.value(state.radius);
    rotationSlider.value(state.rotation);
    textStringInput.value(state.textString);
    textSizeSlider.value(state.textSizeValue);
    angleSlider.value(state.angle);
    numSpiralSlider.value(state.numSpirals);
    clonePosSlider.value(state.clonePosition);
    xScaleSlider.value(state.xScaleValue);
    charSpacingAngleSlider.value(state.charBendValue);
    rectSizeSlider.value(state.rectSize);
    pushHistory();
    manualDraw();
}
 
function goBackInHistory() {
 
    let state;
 
    if (history.length === 1) {
        state = history[0];
    }
    else {
        state = history.pop();
    }
 
    numClonesSlider.value(state.numClones);
    radiusSlider.value(state.radius);
    rotationSlider.value(state.rotation);
    textStringInput.value(state.textString);
    textSizeSlider.value(state.textSizeValue);
    angleSlider.value(state.angle);
    numSpiralSlider.value(state.numSpirals);
    clonePosSlider.value(state.clonePosition);
    xScaleSlider.value(state.xScaleValue);
    charSpacingAngleSlider.value(state.charBendValue);
    rectSizeSlider.value(state.rectSize);
 
    manualDraw();
}
 
function setup() {
    canvas = createCanvas(w, h, SVG);
    canvas.position(0, 0, 'fixed');
 
    let container = createDiv();
    container.class("gui-container");

    let buttonContainer = createDiv();
    buttonContainer.class("buttonContainer " + currentModeIndex);
    buttonContainer.parent(container);
 
    for (let i = 0; i < useMode.length; i++) {
        let modeButton = createButton(useMode[i].buttonLabel)
            .parent(buttonContainer)
            .mousePressed(() => {
                currentModeIndex = useMode[i].id;
                // Draw only when the button was pressed.
                buttonContainer.elt.className =
                    "buttonContainer " + currentModeIndex;
                manualDraw();
            });
 
 
    }
 
    // Create export button
    exportButton = createButton("Export");
    exportButton.parent(buttonContainer);
    exportButton.mousePressed(exportSVG);
 
 
    // Create reset, undo button
    let timeTravelButton = createDiv();
    timeTravelButton.class("timeTravelButtons");
    timeTravelButton.parent(container);

    let resetToDef;
    resetToDef = createButton("Reset");
    // resetToDef.class("timetravelButtons");
    resetToDef.parent(timeTravelButton);
    resetToDef.mousePressed(resetState);
 
    let goBackOneStep;
    goBackOneStep = createButton("");
    goBackOneStep.parent(timeTravelButton);
    goBackOneStep.id("backarrow");
    // goBackOneStep.class("timetravelButtons");
    goBackOneStep.mousePressed(goBackInHistory);
 
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
    rotationSlider = createSlider(0.01, 10, 2, 0.01);
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
    textStringInput = createInput("trppn");
    textStringInput.parent(container);
    textStringInput.addClass("css-input text-mode");
 
    let textSizeLabel = createDiv("Type size");
    textSizeLabel.parent(container);
    textSizeLabel.addClass("text-mode");
    textSizeSlider = createSlider(0, 100, 20);
    textSizeSlider.parent(container);
    textSizeSlider.addClass("text-mode");
 
    let xScaleLabel = createDiv("X-Scale");
    xScaleLabel.parent(container);
    xScaleLabel.addClass("text-mode");
    xScaleSlider = createSlider(1, 5, 1.1, 0.01);
    xScaleSlider.parent(container);
    xScaleSlider.addClass("text-mode");
 
    let charSpacingLabel = createDiv("Character bend");
    charSpacingLabel.parent(container);
    charSpacingLabel.addClass("textdistort-mode");
    charSpacingAngleSlider = createSlider(0, 50, 15, 0.01);
    charSpacingAngleSlider.parent(container);
    charSpacingAngleSlider.addClass("textdistort-mode");
 
    centerX = w /2;
    centerY = h /2;

 
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
        clonePosSlider,
    ].forEach((slider) => {
        if (slider && slider.elt) {
            slider.elt.addEventListener("input", () => {
                manualDraw();
            });
            slider.elt.addEventListener("change", (event) => {
                pushHistory();
            });
        }
    });
 
    // First initial draw.
    manualDraw();
 
    pushHistory();
}

window.onresize = function() {
    // assigns new values for width and height variables
    w = window.innerWidth;
    h = window.innerHeight;  
    canvas.size(w,h);
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
    // centerX = width / 2;
    // centerY = height / 2;
 
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
 
            drawBendTextAtPosition({
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
 
function drawBendTextAtPosition({
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
    textAlign(LEFT, BASELINE);
    textSize(textSizeValue);
    textFont(fontSelector.value());
 
    let chars = textString.split("");
 
    push();
 
    translate(x, y);
    rotate(rotation);
 
    let angleToCenter = atan2(centerY - y, centerX - x);
    rotate(angleToCenter + HALF_PI);
 
    let xcoord = 0;
    chars.forEach((char, index) => {
        scale(xScaleValue, 1);
        translate(xcoord, 0);
 
        // UPDATE xcoord WITH CURRENT CHAR WIDTH (MULTIPLIED BY xScaleValue)
        xcoord = textWidth(char);
 
        // IF IT IS NOT THE LAST CHARACTER ..
        if (index < chars.length - 1) {
            // .. LOOK UP THE NEXT
            const next = chars[index + 1];
 
            // THIS LETTER HAS AN ARRAY OF EXCEPTONAL SPACINGS
            if (letters[char]) {
                const spacings = letters[char];
                let spacing = spacings.default || 0;
 
                // .. AND ONE EXISTS FOR THE NEXT CHARACTER
                if (spacings[next]) {
                    // OVERWRITE THE DEFAULT SPACING FOR THE ONE MATCHING THIS CHARACTER PAIR
                    spacing = spacings[next];
                }
 
                // ONLY ADD A MARGIN RIGHT WHENEVER THE SPACING != 0;
                if (spacing != 0) {
                    xcoord += spacing * textSizeValue;
                }
            }
        }
 
        text(char);
        rotate(radians(charBendValue));
    });
    pop();
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