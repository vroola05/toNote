/*************************************************************************
 * Copyright vrooland.net
 *
 *************************************************************************
 * @description
 * @author Mark Vrooland
 *************************************************************************/
class Section {
    id:number|undefined;
    notebookId:number|undefined;
    name:string|undefined;
    color:string|undefined;
    creationDate:string|undefined;
    modifyDate:string|undefined;
    hash:string|undefined;

    constructor() {
        this.id = undefined;
        this.notebookId = undefined;
        this.name = undefined;
        this.color = undefined;
        this.creationDate = undefined;
        this.modifyDate = undefined;
    }

    setId(id:number) {
        this.id = id;
    }
    getId() {
        return this.id;
    }

    setNotebookId(notebookId:number) {
        this.notebookId = notebookId;
    }
    getNotebookId() {
        return this.notebookId;
    }

    setName(name:string) {
        this.name = name;
    }
    getName() {
        return this.name;
    }

    setColor(color:string) {
        this.color = color;
    }
    getColor() {
        return this.color;
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
