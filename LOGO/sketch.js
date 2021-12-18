let codeInput;
let compileOutput;

function setup() {
    createCanvas(600, 600);
    angleMode(DEGREES);

    codeInput = select("#code");
    compileOutput = new CompileOutput(select("#error"));

    codeInput.input(GoTurtleGo);
    GoTurtleGo();
}

function draw() { }

function GoTurtleGo() {
    background(40);
    push();

    let turtle = new Turtle(width / 2, height / 2, -90);
    let code = codeInput.value()
    let variables = new VariableManager();

    compileOutput.clear();
    parseExpression(code, turtle, variables);
    turtle.show();

    if (compileOutput.isErrorLogged()) {
        compileOutput.error(`Compilation failed !`);
    }
    else {
        compileOutput.good(`Compilation succeed !`);
    }

    pop();
}

function validateToken(value, varName, cmdName) {
    if (value instanceof TokenReaderError && value.error == TokenReaderError.SEPARATOR_NOT_FOUND) {
        compileOutput.error(`Missing '${varName}' argument for ${cmdName}`);
        return null;
    }

    return value;
}

function validateTokenAndParseFloat(value, varName, cmdName) {
    if (validateToken(value, varName, cmdName) === null) {
        return null;
    }

    let result = parseFloat(value);
    if (isNaN(result)) {
        compileOutput.error(`Bad '${varName}' argument type for ${cmdName}`);
        return null;
    }

    return result;
}

function validateTokenAndParseInt(value, varName, cmdName) {

    let result = validateTokenAndParseFloat(value, varName, cmdName);

    if( result == null ){
        return null;
    }
    else{
        return Math.floor(result);
    }
}

function validateBetweenToken(value, cmdName, openTxt, closeTxt = openTxt) {

    if (value instanceof TokenReaderError) {
        switch (value.error) {
            case TokenReaderError.CONTAINER_NOT_NEXT:
                compileOutput.error(`Bad argument type for ${cmdName}. I am waiting for '${openTxt}' and get '${value.value}'`);
                break;

            case TokenReaderError.CONTAINER_NOT_FOUND:
                compileOutput.error(`Missing argument for ${cmdName}.`)
                break;

            case TokenReaderError.CONTAINER_CLOSE_NOT_FOUND:
                compileOutput.error(`Missing argument close token ('${closeTxt}') for ${cmdName}.`)
                break;

            default:
                compileOutput.error(`Unkown error for ${cmdName}.`)
                break;
        }

        return null;
    }

    return value;
}

function isCharNumber(c){
    return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(c);
}

function degToRad(d){
    return d * (Math.PI / 180);
}

function radToDeg(r){
    return r / (Math.PI / 180);
}

function parseExpression(code, turtle, globalVariables) {

    let localVariables = new VariableManager();
    let token = new TokenReader(code.trim());

    while (!token.isParseFinish() && !compileOutput.isErrorLogged()) {
        let cmd = token.nextToken()?.trim().toLowerCase();

        switch (cmd) {
            case "fd": {
                let arg = validateTokenAndParseFloat(token.nextToken(), "distance", "fd");

                if (arg !== null)
                    turtle.moveForward(arg);

                break;
            }

            case "bk": {
                let arg = validateTokenAndParseFloat(token.nextToken(), "distance", "bk");


                if (arg !== null)
                    turtle.moveBackward(arg);

                break;
            }

            case "rt": {
                let arg = validateTokenAndParseFloat(token.nextToken(), "angle", "rt");

                if (arg !== null)
                    turtle.turnRight(arg);

                break;
            }

            case "lt": {
                let arg = validateTokenAndParseFloat(token.nextToken(), "angle", "lt");

                if (arg !== null)
                    turtle.turnLeft(arg);

                break;
            }

            case "cs":
                background(50);
                break;

            case "pu":
                turtle.penUp();
                break;

            case "pd":
                turtle.penDown();
                break;

            case "ht":
                turtle.hideTurtle();
                break;

            case "st":
                turtle.showTurtle();
                break;

            case "home":
                turtle.goHome();
                break;

            case "label": {
                //let arg = validateBetweenToken(token.nextTokenBetween('"'), "label", '"');
                let arg = validateToken(token.seekNextToken(), "word or string", 'label');

                if (arg === null)
                    break;

                arg = parseValue(token, globalVariables.concatAndClone(localVariables));

                if (arg !== null)
                    turtle.write(arg);

                break;
            }

            case "setxy": {
                let argX = validateTokenAndParseFloat(token.nextToken(), "posX", "setxy");
                let argY = validateTokenAndParseFloat(token.nextToken(), "posY", "setxy");

                if (argX !== null && argY !== null)
                    turtle.goTo(argX, argY);

                break;
            }

            case "repeat": {
                let argNb = validateTokenAndParseFloat(token.nextToken(), "nb", "repeat");

                let expr = validateBetweenToken(token.nextTokenBetween('[', ']'), "repeat", '[', ']')

                if (argNb === null || expr === null) {
                    break;
                }

                if (expr.trim() === "") {
                    compileOutput.warning("Expression is empty for repeat. I will ignore this.");
                    break;
                }

                for (let i = 0; i < argNb; ++i) {
                    parseExpression(expr, turtle, globalVariables.concatAndClone(localVariables));
                }

                break;
            }

            case "make": {
                let argName = validateBetweenToken(token.nextTokenBetween('"', ' '), "make", '"', ' ');
                //let argValue = validateToken(token.seekNextToken(), "value", "make");

                if (argName === null) {
                    break;
                }


                if (argName.length == 0) {
                    compileOutput.error("Name cannot be empty for make.");
                    break;
                }

                if (localVariables.isExists(argName)) {
                    compileOutput.error(`Variable name '${argName}' already exists for make.`);
                    break;
                }

                let argValue = parseValue(token, globalVariables.concatAndClone(localVariables));

                if (argValue !== null) {
                    localVariables.add(argName, argValue);
                }
                else{
                    compileOutput.error(`Missing 'value' argument type for make`);
                }

                console.table(localVariables.dict);

                break;
            }

            case "print": {
                let argValue = parseValue(token, globalVariables.concatAndClone(localVariables));

                if (argValue !== null) {
                    compileOutput.info(argValue);
                }
                else{
                    compileOutput.error(`Missing 'value' argument type for print`);
                }
                break;
            }

            default:
                compileOutput.warning(`Unknown command '${cmd}'. I will ignore it...`);
        }
    }
}

function parseValue(token, localVariables) {

    let seek = token.seekNextToken();

    // text things
    switch (seek[0]) {

        // word
        case '"':
            return token.nextTokenBetween('"', ' ');

        // string
        case '[':
            return token.nextTokenBetween('[', ']');

        //is a variable containing text ?
        case ":": {
            let varName = seek.substring(1);

            if (!localVariables.isExists(varName)) {
                compileOutput.error(`Variable name '${varName}' does not exists.`);
                return null;
            }

            let varValue = localVariables.get(varName);
            if (isNaN(varValue)) {
                token.nextToken();
                return varValue
            }
            break;
        }

        default:
            break;
    }

    //Arithmetic and variables
    return parseNumericValue(token, localVariables);
}

function parseNumericValue(token, localVariables) {

    let isLastTokenOperator = false;
    let isParsing = true;
    let arithParser = new ArithmeticParser(compileOutput);

    while (isParsing) {

        let seek = token.seekNextCharacter();

        // Ignore space
        if (seek == ' ') {
            token.nextCharacter();
        }
        // Numeric variable
        else if (seek == ':') {
            let varName = token.nextTokenBetween(':', ' ');

            if (!localVariables.isExists(varName)) {
                compileOutput.error(`Variable name '${varName}' does not exists.`);
                return null;
            }

            let varValue = localVariables.get(varName);
            if (!isNaN(varValue)) {
                arithParser.number(varValue);
            }
            else {
                compileOutput.error(`Variable '${varName}' is not numeric value. I can't make any arithmetic on it.`);
                return null;
            }
        }
        // Aithmetic operator
        else if( ['+', '-', '*', '/'].includes(seek) ){
            let operator = token.nextCharacter();
            
            if( isLastTokenOperator ){
                compileOutput.error(`An operator cannot follow another operator`);
                return null;
            }
            else{
                isLastTokenOperator = true;
            }

            switch(operator){
                case '+':
                    arithParser.addOp();
                    break;
                    
                case '-':
                    arithParser.substactOp();
                    break;
                    
                case '*':
                    arithParser.multOp();
                    break;
                    
                case '/':
                    arithParser.divideOp();
                    break;
            }
        }
        // Number
        else if( isCharNumber(seek) ){
            let isPoint = false;
            let num = token.nextCharacter();

            let c = token.seekNextCharacter();
            while( c != null && ( isCharNumber(c) || c == '.')){
                if( c === '.' ){
                    if( isPoint ){
                        compileOutput.error(`A numeric value can't have more than 1 decimal sign (.).`);
                        return null;
                    }
                    else{
                        isPoint = true;
                    }
                }

                num += token.nextCharacter();
                c = token.seekNextCharacter();
            }

            arithParser.number(parseFloat(num));
            isLastTokenOperator = false;
        }
        // Math function
        else if( ['r', 'c', 's', 't', 'a', 'l', 'p'].includes(seek) ){
            let fct = token.seekNextToken();

            switch( fct ){
                case "random":{
                    token.nextToken();
                    let maxArg = validateTokenAndParseInt(token.nextToken(), "max", "random");

                    if( maxArg != null){
                        arithParser.number( Math.floor( Math.random() * maxArg ) );
                    }

                    isLastTokenOperator = false;
                    break;
                }

                case "cos":{
                    token.nextToken();
                    let angleArg = validateTokenAndParseFloat(token.nextToken(), "angle", "cos");

                    if( angleArg != null){
                        arithParser.number( Math.cos( degToRad(angleArg) ) );
                    }

                    isLastTokenOperator = false;
                    break;
                }

                case "sin":{
                    token.nextToken();
                    let angleArg = validateTokenAndParseFloat(token.nextToken(), "angle", "sin");

                    if( angleArg != null){
                        arithParser.number( Math.sin( degToRad(angleArg) ) );
                    }

                    isLastTokenOperator = false;
                    break;
                }

                case "tan":{
                    token.nextToken();
                    let angleArg = validateTokenAndParseFloat(token.nextToken(), "angle", "tan");

                    if( angleArg != null){
                        arithParser.number( Math.tan( degToRad(angleArg) ) );
                    }

                    isLastTokenOperator = false;
                    break;
                }

                case "arccos":{
                    token.nextToken();
                    let valueArg = validateTokenAndParseFloat(token.nextToken(), "value", "arccos");

                    if( valueArg != null){
                        arithParser.number( radToDeg( Math.acos( valueArg) ) );
                    }

                    isLastTokenOperator = false;
                    break;
                }

                case "arcsin":{
                    token.nextToken();
                    let valueArg = validateTokenAndParseFloat(token.nextToken(), "value", "arcsin");

                    if( valueArg != null){
                        arithParser.number( radToDeg( Math.asin( valueArg) ) );
                    }

                    isLastTokenOperator = false;
                    break;
                }

                case "arctan":{
                    token.nextToken();
                    let valueArg = validateTokenAndParseFloat(token.nextToken(), "value", "arctan");

                    if( valueArg != null){
                        arithParser.number( radToDeg( Math.atan( valueArg) ) );
                    }

                    isLastTokenOperator = false;
                    break;
                }

                case "sqrt":{
                    token.nextToken();
                    let valueArg = validateTokenAndParseFloat(token.nextToken(), "value", "sqrt");

                    if( valueArg != null){
                        arithParser.number( Math.sqrt(valueArg) );
                    }

                    isLastTokenOperator = false;
                    break;
                }

                case "ln":{
                    token.nextToken();
                    let valueArg = validateTokenAndParseFloat(token.nextToken(), "value", "ln");

                    if( valueArg != null){
                        arithParser.number( Math.log(valueArg) );
                    }

                    isLastTokenOperator = false;
                    break;
                }

                case "power":{
                    token.nextToken();
                    let valueArg = validateTokenAndParseFloat(token.nextToken(), "value", "power");
                    let powerArg = validateTokenAndParseFloat(token.nextToken(), "p", "power");

                    if( valueArg != null && powerArg != null){
                        arithParser.number( Math.pow(valueArg, powerArg) );
                    }

                    isLastTokenOperator = false;
                    break;
                }

                default:
                    isParsing = false;
                    break;
            }
        }
        // Stop parsing
        else{
            console.log("Stop parsing value")
            isParsing = false;
        }

    }

    if( isLastTokenOperator ){
        compileOutput.error(`An arithmetic expression cannot finish with an operator.`);
        return null;
    }

    // Execute the arithmetique calcul
    return arithParser.evaluate();
}