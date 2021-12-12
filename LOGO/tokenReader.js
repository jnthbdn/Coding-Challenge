class TokenReader {

    constructor(text){
        this.index = 0;
        this.text = text;
    }

    nextToken(separator = " "){
        let nextIndex = this.text.indexOf(separator, this.index);
        
        if( nextIndex == -1){
            return new TokenReaderError(TokenReaderError.SEPARATOR_NOT_FOUND);
        }
    
        let token = this.text.substring( this.index, nextIndex + separator.length);
        
        this.index = nextIndex + separator.length;
        return token;
    }

    nextTokenBetween(container){

        let a = this.nextToken(container);

        if( a instanceof TokenReaderError ){ return new TokenReaderError(TokenReaderError.CONTAINER_NOT_FOUND); }

        console.log(a);

        if( !a.trim().startsWith(container) ){
            return new TokenReaderError(TokenReaderError.CONTAINER_NOT_NEXT, a.substring(0, a.indexOf(container)));
        }

        let b = this.nextToken(container);

        if( b instanceof TokenReaderError ){ return new TokenReaderError(TokenReaderError.CONTAINER_CLOSE_NOT_FOUND); }

        return b.trim().substring(0, b.length - container.length);
    }

    isParseFinish(){
        return this.index >= this.text.trim().length;
    }
}

class TokenReaderError{
    static SEPARATOR_NOT_FOUND = Symbol("SEP_NOT_FOUND");
    static CONTAINER_NOT_FOUND = Symbol("CT_NOT_FOUND");
    static CONTAINER_CLOSE_NOT_FOUND = Symbol("CT_CLOSE_NOT_FOUND");
    static CONTAINER_NOT_NEXT = Symbol("CT_NOT_NEXT");

    constructor( error, value = null ){
        this.error = error;
        this.value = value;
    }
}