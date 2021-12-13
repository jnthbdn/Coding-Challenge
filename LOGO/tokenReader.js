class TokenReader {

    constructor(text){
        this.index = 0;
        this.text = (text + " ").replaceAll("[", "[ ")          // Be sure to "tokenize" [
                                .replaceAll("]", " ]")          // Be sure to "tokenize" ]
                                .replaceAll(/;.*$/gm, " ")       // Remove comments
                                .replaceAll(/\s{2,}/g, " ")     // Remove multiple whitespace
                                .replaceAll(/\s/g, " ");        // Replace all whitespace with a space
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

    nextTokenBetween(open, close = open){

        let a = this.nextToken(open);

        if( a instanceof TokenReaderError ){ return new TokenReaderError(TokenReaderError.CONTAINER_NOT_FOUND); }

        if( !a.trim().startsWith(open) ){
            return new TokenReaderError(TokenReaderError.CONTAINER_NOT_NEXT, a.substring(0, a.indexOf(open)));
        }

        let b = this.nextToken(close);

        if( b instanceof TokenReaderError ){ return new TokenReaderError(TokenReaderError.CONTAINER_CLOSE_NOT_FOUND); }
        
        return b.substring(0, b.length - close.length).trim();
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