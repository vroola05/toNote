export interface Entity{

}


export interface Info extends Entity {
    id: string;
    value : any;
}


export interface Message extends Entity {
    status: number;
    message : string;
    info: Array<Info> | undefined;
    faults: { [key:string]:string } | undefined;
}

export class Note {
    id: number;
    sectionId :number;
    name:string;
    note:any;
    creationDate: Date;
    modifyDate: Date | undefined;
    hash:string | undefined;
}

export class User {
    userId: number | undefined;
    username: string;
    password: string;
    active: boolean | undefined;
}

export class Notebook {
    id: number;
    name: string;
    creationDate: string;
    modifyDate: string | null;
    chapter: Array<Chapter> | null;
}

export class Chapter {
    id: number;
    notebookId: number;
    name: string;
    color: string | null;
    creationDate: string;
    modifyDate: string | undefined;
}

export class MainState {
    notebook: Notebook | null;
    chapter: Chapter | null;
    note: Note | null;
}

export enum TabEnum {
    Notebooks = 0,
    Chapters = 1,
    Notes = 2,
    Note = 3
}

export type Method = "POST" | "PUT" | "DELETE" | "GET";