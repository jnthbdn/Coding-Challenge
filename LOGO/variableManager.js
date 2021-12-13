class VariableManager {
    constructor(){
        this.dict = {};
    }

    add(name, value){
        this.dict[name] = value;
    }

    isExists(name){
        return this.dict.hasOwnProperty(name);
    }

    get(name){
        if( !this.isExists(name) ){
            return null;
        }

        return this.dict[name];
    }

    delete(name){
        delete this.dict[name];
    }

    concatAndClone(concatVars){
        let newVar = new VariableManager();
        newVar.dict = {...this.dict};

        for( let k of Object.keys(concatVars.dict) ){ newVar.dict[k] = concatVars.dict[k] }

        return newVar;
    }
}