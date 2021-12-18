class ArithmeticParser {
 
    constructor(compileOuput){
        this.inputs = [];
        this.rpn = [];
        this.compileOuput = compileOuput;
    }

    number(num){
        this.inputs.push( new ArithmeticNumber(num) );
    }

    addOp(){
        this.inputs.push( new ArithmeticOperator("+", (a, b) => {return a+b;}, 1))
    }

    substactOp(){
        this.inputs.push( new ArithmeticOperator("-", (a, b) => {return a-b;}, 1))
    }

    multOp(){
        this.inputs.push( new ArithmeticOperator("*", (a, b) => {return a*b;}, 2))
    }

    divideOp(){
        this.inputs.push( new ArithmeticOperator("/", (a, b) => {return a/b;}, 2))
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
            if( elem.isOperator ){

                if( stack.length < 2 ){
                    this.compileOuput.error("Arithmetic Parser Error : Not enough stack elements!");
                    return null;
                }

                let b = stack.pop();
                let a = stack.pop();
                stack.push( elem.eval_fct(a, b) );
            }
            else{
                stack.push(elem.eval_fct());
            }
        } );

        return stack[0];
    }

    _computeRPN(){
        this.rpn = [];
        let operatorStack = [];


        this.inputs.forEach( (elem) => {

            if( elem.isOperator ){

                console.log(elem);
                console.log(operatorStack);

                if( operatorStack.length > 0 && operatorStack[operatorStack.length-1].priority > elem.priority ){
                    while( operatorStack.length > 0){
                        this.rpn.push( operatorStack.pop() )
                    }
                }
                
                operatorStack.push(elem);
            }
            else{
                this.rpn.push(elem);
            }

        } );

        while( operatorStack.length > 0){
            this.rpn.push( operatorStack.pop() )
        }
    }

}

class ArithmeticElement {
    constructor(symbol, isOperator, eval_fct, priority){
        this.symbol = symbol;
        this.isOperator = isOperator;
        this.eval_fct = eval_fct
        this.priority = priority;
    }
}

class ArithmeticNumber extends ArithmeticElement {
    constructor(value){
        super(value, false, () => { return value }, -1);
    }
}

class ArithmeticOperator extends ArithmeticElement {
    constructor(symbol, eval_fct, priority){
        super(symbol, true, eval_fct, priority);
    }
}