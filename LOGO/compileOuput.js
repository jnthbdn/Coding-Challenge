class CompileOutput{
    constructor(outputObject){
        this.output = outputObject;
        this.isLogError = false;
    }

    clear(){
        this.output.html("");
        this.isLogError = false;
    }

    error(msg){
        this.output.html( this.output.html() + `<br/><span style="color: #AA0000;">${msg}</span>`);
        this.isLogError = true;
    }

    warning(msg){
        this.output.html( this.output.html() + `<br/><span style="color: #DD8800;">${msg}</span>`);
    }

    info(msg){
        this.output.html( this.output.html() + `<br/><span style="color: #000000;">${msg}</span>`);
    }

    good(msg){
        this.output.html( this.output.html() + `<br/><span style="color: #00AA00;">${msg}</span>`);
    }

    isErrorLogged(){
        return this.isLogError;
    }
}