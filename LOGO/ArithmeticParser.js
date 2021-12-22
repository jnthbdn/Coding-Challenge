class ArithmeticParser {
 
    constructor(compileOuput){
        this.inputs = [];
        this.rpn = [];
        this.compileOuput = compileOuput;
    }

    number(num){
        this.inputs.push( new ArithmeticNumber(num) );
    }

    openParenthesis(){
        this.inputs.push( new ArithmeticParenthesis(false) );
    }

    closeParenthesis(){
        this.inputs.push( new ArithmeticParenthesis(true) );
    }

    addOp(){
        this.inputs.push( new ArithmeticOperator("+", 2, (a, b) => {return a+b;}));
    }

    substactOp(){
        this.inputs.push( new ArithmeticOperator("-", 2, (a, b) => {return a-b;}));
    }

    multOp(){
        this.inputs.push( new ArithmeticOperator("*", 3, (a, b) => {return a*b;}));
    }

    divideOp(){
        this.inputs.push( new ArithmeticOperator("/", 3, (a, b) => {return a/b;}));
    }

    showInput(){
        let str = "";

        this.inputs.forEach( (elem) => {

            str += elem.symbol + " ";

        });

        if( str.length > 0 )
            return str.substring(0, str.length-1);
        else
            return str;
    }


    showOutput(){
        let str = "";

        this.rpn.forEach( (elem) => {

            str += elem.symbol + " ";

        });

        if( str.length > 0 )
            return str.substring(0, str.length-1);
        else
            return str;
    }

    evaluate(){
        this._computeRPN();

        let stack = [];

        this.rpn.forEach( (elem) => {
            if( elem instanceof ArithmeticOperator ){

                if( stack.length < 2 ){
                    this.compileOuput.error("Arithmetic Parser Error : Not enough stack elements!");
                    return null;
                }

                let b = stack.pop();
                let a = stack.pop();
                stack.push( elem.eval_fct(a, b) );
            }
            else if( elem instanceof ArithmeticNumber ){
                stack.push(elem.value);
            }
        } );

        return stack[0];
    }

    _computeRPN(){
        this.rpn = [];
        let operatorStack = [];


        this.inputs.forEach( (elem) => {

            if( elem instanceof ArithmeticOperator ){
                if( operatorStack.length > 0 && operatorStack[operatorStack.length-1].priority > elem.priority ){
                    while( operatorStack.length > 0){
                        this.rpn.push( operatorStack.pop() )
                    }
                }
                
                operatorStack.push(elem);
            }
            else if( elem instanceof ArithmeticParenthesis ){
                if( elem.isClosing ){
                    while( operatorStack[operatorStack.length - 1].symbol != ArithmeticParenthesis.SYMBOL_OPEN ){
                        this.rpn.push( operatorStack.pop() );
                    }

                    operatorStack.pop();    // Remove open parenthesis from operator stack
                }
                else{
                    operatorStack.push(elem);
                }
            }
            else {
                this.rpn.push(elem);
            }

        } );

        while( operatorStack.length > 0){
            this.rpn.push( operatorStack.pop() )
        }
    }

}

class ArithmeticElement {
    constructor(symbol, priority){
        this.symbol = symbol;
    }
}

class ArithmeticNumber extends ArithmeticElement {
    constructor(value){
        super(value);
        this.value = parseFloat(value);
    }
}

class ArithmeticOperator extends ArithmeticElement {
    constructor(symbol, priority, eval_fct){
        super(symbol, priority);
        this.eval_fct = eval_fct;
        this.priority = priority;
    }
}

class ArithmeticParenthesis extends ArithmeticElement {

    static SYMBOL_OPEN = "(";
    static SYMBOL_CLOSE = ")";

    constructor(isClosing){
        if( isClosing ){
            super(ArithmeticParenthesis.SYMBOL_CLOSE);
        }
        else{
            super(ArithmeticParenthesis.SYMBOL_OPEN);
        }

        this.isClosing = isClosing;
    }
}