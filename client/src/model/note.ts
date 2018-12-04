/*************************************************************************
 * Copyright vrooland.net
 *
 *************************************************************************
 * @description
 * @author Mark Vrooland
 *************************************************************************/
class Note {
    id:number|undefined;
    sectionId:number|undefined;
    name:string|undefined;
    note:string|undefined;
    creationDate:string|undefined;
    modifyDate:string|undefined;
    hash:string|undefined;

    constructor() {
    }

    setId(id:number) {
        this.id = id;
    };
    getId() {
        return this.id;
    }

    setSectionId(sectionId:number) {
        this.sectionId = sectionId;
    };
    getSectionId() {
        return this.sectionId;
    }

    setName(name:string) {
        this.name = name;
    }
    getName() {
        return this.name;
    }

    setNote(note:string) {
        this.note = note;
    }
    getNote() {
        return this.note;
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