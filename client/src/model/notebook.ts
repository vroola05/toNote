/*************************************************************************
 * Copyright vrooland.net
 *
 *************************************************************************
 * @description
 * @author Mark Vrooland
 *************************************************************************/
class Notebook {
    id:number|undefined;
    name:string|undefined;
    creationDate:string|undefined;
    modifyDate:string|undefined;
    hash:string|undefined;
    sections:Array<Section>;

    constructor() {
    }

    setId(id:number) {
        this.id = id;
    };
    getId() {
        return this.id;
    }

    setName(name:string) {
        this.name = name;
    }
    getName() {
        return this.name;
    }

    setCreationDate(creationDate:string) {
        this.creationDate = creationDate;
    }
    getCreationDate() {
        return this.creationDate;
    }

    setModifyDate(modifyDate:string) {
        this.modifyDate = modifyDate;
    }
    getModifyDate() {
        return this.modifyDate;
    }

    setHash(hash:string) {
        this.hash = hash;
    }
    getHash() {
        return this.hash;
    }
}