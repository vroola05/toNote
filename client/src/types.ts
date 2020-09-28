export interface Entity {

}


export interface Info extends Entity {
    id?: string;
    value?: any;
}


export interface Message extends Entity {
    status?: number;
    message?: string;
    info?: Array<Info>;
    faults?: { [key: string]: string };
}

export class Note {
    id?: number;
    sectionId?: number;
    name?: string;
    note?: any;
    creationDate?: Date;
    modifyDate?: Date;
    hash?: string;
}

export enum SortEnum {
    ASC = 'asc',
    DESC = 'desc'
}

export class Sort {
    userId?: number;
    name?: string;
    identifier?: string;
    sort?: SortEnum;

    constructor( identifier: string, sort: SortEnum) {
        this.identifier = identifier;
        this.sort = sort;
    }
}

export class User {
    userId?: number;
    name?: string;
    username?: string;
    password?: string;
    active?: boolean;
    sort?: Sort[];
}

export class Notebook {
    id?: number;
    name?: string;
    creationDate?: string;
    modifyDate?: string;
    chapter?: Array<Chapter>;
}

export class Chapter {
    id?: number;
    notebookId?: number;
    name?: string;
    color?: string;
    creationDate?: string;
    modifyDate?: string;
}

export class LoginState {
    page?: string;
}

export class MainState {
    notebook?: Notebook;
    chapter?: Chapter;
    note?: Note;
}

export enum TabEnum {
    Notebooks = 0,
    Chapters = 1,
    Notes = 2,
    Note = 3
}

export type Method = 'POST' | 'PUT' | 'DELETE' | 'GET';
