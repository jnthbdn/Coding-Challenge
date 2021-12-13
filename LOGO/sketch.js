let codeInput;
let compileOutput;

function setup(){
    createCanvas(600, 600);
    angleMode(DEGREES);

    codeInput = select("#code");
    compileOutput = new CompileOutput( select("#error") );

    codeInput.input(GoTurtleGo);
    GoTurtleGo();
}

function draw(){}

function GoTurtleGo(){
    background(40);
    push();

    let turtle = new Turtle(width/2, height/2, -90);
    let code = codeInput.value()
    let variables = new VariableManager();

    compileOutput.clear();
    parseExpression(code, turtle, variables);
    turtle.show();

    if(compileOutput.isErrorLogged()){
        compileOutput.error(`Compilation failed !`);
    }
    else{
        compileOutput.good(`Compilation succeed !`);
    }

    pop();
}

function validateToken(value, varName, cmdName){
    if( value instanceof TokenReaderError && value.error == TokenReaderError.SEPARATOR_NOT_FOUND ){
        compileOutput.error(`Missing '${varName}' argument for ${cmdName}`);
        return null;
    }

    return value;
}

function validateTokenAndParseFloat(value, varName, cmdName){
    if( validateToken(value, varName, cmdName) === null ){
        return null;
    }

    let result = parseFloat(value);
    if( isNaN(result)  ){
        compileOutput.error(`Bad '${varName}' argument type for ${cmdName}`);
        return null;
    }

    return result;
}

function validateBetweenToken(value, cmdName, openTxt, closeTxt = openTxt){

    if( value instanceof TokenReaderError ){
        switch(value.error){
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

function parseExpression(code, turtle, globalVariables){

    let localVariables = new VariableManager();
    let token = new TokenReader(code.trim());

    while(!token.isParseFinish() && !compileOutput.isErrorLogged()){
        let cmd = token.nextToken()?.trim().toLowerCase();

        switch( cmd ){
            case "fd": {   
                let arg = validateTokenAndParseFloat(token.nextToken(), "distance", "fd");  
                
                if(arg !== null )
                    turtle.moveForward(arg);

                break;
            }

            case "bk": {     
                let arg = validateTokenAndParseFloat(token.nextToken(), "distance", "bk"); 
                
                
                if(arg !== null )
                    turtle.moveBackward(arg);

                break;
            }
            
            case "rt": {
                let arg = validateTokenAndParseFloat(token.nextToken(), "angle", "rt");  

                if(arg !== null )
                    turtle.turnRight(arg);

                break;
            }

            case "lt":{
                let arg = validateTokenAndParseFloat(token.nextToken(), "angle", "lt");  

                if(arg !== null )
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
                
                if( arg === null )
                    break;

                arg = parseValue(token, globalVariables.concatAndClone(localVariables));

                if(arg !== null )
                    turtle.write(arg);

                break;
            }

            case "setxy":{
                let argX = validateTokenAndParseFloat(token.nextToken(), "posX", "setxy");
                let argY = validateTokenAndParseFloat(token.nextToken(), "posY", "setxy");
                
                if( argX !== null && argY !== null)
                    turtle.goTo(argX, argY);

                break;
            }

            case "repeat":{
                let argNb = validateTokenAndParseFloat(token.nextToken(), "nb", "repeat");

                let expr = validateBetweenToken(token.nextTokenBetween('[', ']'), "repeat", '[', ']')

                if( argNb === null || expr === null ){
                    break;
                }

                if( expr.trim() === "" ){
                    compileOutput.warning("Expression is empty for repeat. I will ignore this.");
                    break;
                }

                for(let i = 0; i < argNb; ++i ){
                    parseExpression( expr, turtle, globalVariables.concatAndClone(localVariables) );
                }

                break;
            }

            case "make":{
                let argName = validateBetweenToken(token.nextTokenBetween('"', ' '), "make", '"', ' ');
                let argValue = validateToken(token.seekNextToken(), "value", "make");

                if( argName === null || argValue === null){
                    break;
                }


                if(argName.length == 0){
                    compileOutput.error("Name cannot be empty for make.");
                    break;
                }

                if(!isNaN( parseInt(argName[0]))){
                    compileOutput.error("Name cannot start with number (only letter) for make.");
                    break;
                }

                if( localVariables.isExists(argName) ){
                    compileOutput.error("Variable name already exists for make.");
                    break;
                }

                argValue = parseValue(token, globalVariables.concatAndClone(localVariables));

                if( argValue !== null){
                    localVariables.add(argName, argValue);
                }

                break;
            }

            default:
                compileOutput.warning(`Unknown command '${cmd}'. I will ignore it...`);
        }
    }
}

/**
 * This function parse a "value" data (word, string, number, arithmetics operations...).
 * It is assumed that a valid token is available.
 */
function parseValue(token, localVariables){

    let seek = token.seekNextToken();

    switch(seek[0]){

        // is a word ?
        case '"':
            return token.nextTokenBetween('"', ' ');

        // is a string ?
        case '[':
            return token.nextTokenBetween('[', ']');

        default:
            break;
    }

    //Arithmetic and variables


    return null;
}