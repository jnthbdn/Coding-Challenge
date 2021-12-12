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

    compileOutput.clear();
    parse(code, turtle);
    turtle.show();

    if(compileOutput.isErrorLogged()){
        compileOutput.error(`Compilation failed !`);
    }
    else{
        compileOutput.good(`Compilation succeed !`);
    }

    pop();
}

function parse(code, turtle){

    let token = new TokenReader(code.trim());

    while(!token.isParseFinish() && !compileOutput.isErrorLogged()){
        let cmd = token.nextToken()?.trim().toLowerCase();

        switch( cmd ){
            case "fd": {     
                let attr = token.nextToken();
                if( attr instanceof TokenReaderError && attr.error == TokenReaderError.CONTAINER_NOT_NEXT ){
                    compileOutput.error("Missing 'distance' argument for fd");
                    break;
                }

                attr = parseFloat(attr);
                if( isNaN(attr)  ){
                    compileOutput.error("Bad 'distance' argument type for fd");
                    break;
                }

                turtle.moveForward(attr);
                break;
            }

            case "bk": {     
                let attr = token.nextToken();
                if( attr instanceof TokenReaderError && attr.error == TokenReaderError.CONTAINER_NOT_NEXT ){
                    compileOutput.error("Missing 'distance' argument for bk");
                    break;
                }

                attr = parseFloat(attr);
                if( isNaN(attr)  ){
                    compileOutput.error("Bad 'distance' argument type for bk");
                    break;
                }

                turtle.moveBackward(attr);
                break;
            }
            
            case "rt": {
                let attr = token.nextToken();
                if( attr instanceof TokenReaderError && attr.error == TokenReaderError.CONTAINER_NOT_NEXT ){
                    compileOutput.error("Missing 'angle' argument for rt");
                    break;
                }

                attr = parseFloat(attr);
                if( isNaN(attr)  ){
                    compileOutput.error("Bad 'angle' argument type for rt");
                    break;
                }

                turtle.turnRight(attr);
                break;
            }

            case "lt":{
                let attr = token.nextToken();
                if( attr instanceof TokenReaderError && attr.error == TokenReaderError.CONTAINER_NOT_NEXT ){
                    compileOutput.error("Missing 'angle' argument for lf");
                    break;
                }

                attr = parseFloat(attr);
                if( isNaN(attr)  ){
                    compileOutput.error("Bad 'angle' argument type for lf");
                    break;
                }

                turtle.turnLeft(attr);
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
                let attr = token.nextTokenBetween('"');
                if( attr instanceof TokenReaderError ){
                    switch(attr.error){
                        case TokenReaderError.CONTAINER_NOT_NEXT:
                            compileOutput.error(`Bad argument type for label. I am waiting for '"' and get '${attr.value}'`);
                            break;

                        case TokenReaderError.CONTAINER_NOT_FOUND:
                            compileOutput.error("Missing argument for label.")
                            break;

                        case TokenReaderError.CONTAINER_CLOSE_NOT_FOUND:
                            compileOutput.error("Mising closing double quote for label.")
                            break;
                    }
                    break;
                }

                turtle.write(attr);
                break;
            }

            case "setxy":{
                
                let attrX = token.nextToken();
                if( attrX instanceof TokenReaderError && attrX.error == TokenReaderError.CONTAINER_NOT_NEXT ){
                    compileOutput.error("Missing 'posX' argument for setxy");
                    break;
                }

                let attrY = token.nextToken();
                if( attrY instanceof TokenReaderError && attrY.error == TokenReaderError.CONTAINER_NOT_NEXT ){
                    compileOutput.error("Missing 'posY' argument for setxy");
                    break;
                }

                attrX = parseFloat(attrX);
                attrY = parseFloat(attrY);

                if( isNaN(attrX) ){
                    compileOutput.error("Bad 'posX' argument type for setxy");
                    break;
                }
                if( isNaN(attrY) ){
                    compileOutput.error("Bad 'posY' argument type for setxy");
                    break;
                }

                turtle.goTo(attrX, attrY);
                break;
            }

            case "repeat":{
            
                let attrNb = token.nextToken();

                if( attrNb instanceof TokenReaderError && attrNb.error == TokenReaderError.CONTAINER_NOT_NEXT ){
                    compileOutput.error("Missing 'nb' argument for repeat");
                    break;
                }

                attrNb = parseInt(attrNb);

                if( isNaN(attrNb) ){
                    compileOutput.error("Bad 'nb' argument type for repeat");
                    break;
                }

                let expr = token.nextTokenBetween('[', ']');
                if( expr instanceof TokenReaderError ){
                    switch(expr.error){
                        case TokenReaderError.CONTAINER_NOT_NEXT:
                            compileOutput.error(`Bad argument type for repeat. I am waiting for bracket ([) and get '${expr.value}'`);
                            break;

                        case TokenReaderError.CONTAINER_NOT_FOUND:
                            compileOutput.error("Missing expression argument for repeat.")
                            break;

                        case TokenReaderError.CONTAINER_CLOSE_NOT_FOUND:
                            compileOutput.error("Mising closing braquet (]) for repeat.")
                            break;
                    }
                    break;
                }

                if( expr.trim() === "" ){
                    compileOutput.warning("Expression is empty for repeat. I will ignore this.");
                    break;
                }

                for(let i = 0; i < attrNb; ++i ){
                    parse( expr, turtle );
                }

                break;
            }

            default:
                compileOutput.warning(`Unknown command '${cmd}'. I will ignore it...`);
        }
    }
}