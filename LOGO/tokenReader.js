class TokenReader {

    constructor(text){
        this.index = 0;
        this.text = (text + " ").replaceAll("[", "[ ")          // Be sure to "tokenize" [
                                .replaceAll("]", " ]")          // Be sure to "tokenize" ]
                                .replaceAll(/;.*$/gm, " ")      // Remove comments
                                .replaceAll(/\s{2,}/g, " ")     // Remove multiple whitespace
                                .replaceAll(/\s/g, " ");        // Replace all whitespace with a space
    }

    seekNextToken(separator = " "){
        let nextIndex = this.text.indexOf(separator, this.index);
        
        if( nextIndex == -1){
            return new TokenReaderError(TokenReaderError.SEPARATOR_NOT_FOUND);
        }
    
        let token = this.text.substring( this.index, nextIndex);
        
        return token;
    }

    nextToken(separator = " "){
        let nextIndex = this.text.indexOf(separator, this.index);
        
        if( nextIndex == -1){
            return new TokenReaderError(TokenReaderError.SEPARATOR_NOT_FOUND);
        }
    
        let token = this.text.substring( this.index, nextIndex);
        
        this.index = nextIndex + separator.length;
        return token;
    }

    nextTokenBetween(open, close = open){

        let a = this.nextToken(open);

        if( a instanceof TokenReaderError ){ return new TokenReaderError(TokenReaderError.CONTAINER_NOT_FOUND); }

        if( a.length > 0 ){
            return new TokenReaderError(TokenReaderError.CONTAINER_NOT_NEXT, a);
        }

        let b = this.nextToken(close);

        if( b instanceof TokenReaderError ){ return new TokenReaderError(TokenReaderError.CONTAINER_CLOSE_NOT_FOUND); }
        
        return b.substring(0, b.length).trim();
    }

    seekNextCharacter(){
        if( this.index >= this.text.length - 1 ){
            return null;
        } 

        return this.text[this.index];
    }

    nextCharacter(){
        let c = this.seekNextCharacter();

        if( c == null ){
            return null;
        }

        this.index++;
        return c;
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