export interface Entity{

}

export interface Note extends Entity {
    id: number;
    sectionId :number;
    name:string;
    note:string;
    creationDate: Date;
    modifyDate: Date | undefined;
    hash:string | undefined;
}

export interface User extends Entity{
    userId: number;
    username: String;
    password: String;
    active: boolean;
}

export interface Notebook extends Entity {
    id: number;
    name: string;
    creationDate: string;
    modifyDate: string | null;
    sections: Array<Section> | null;
}

export interface Section extends Entity {
    id: number;
    notebookId: number;
    name: string;
    color: string | null;
    creationDate: string;
    modifyDate: string | undefined;
}

export type Method = "POST" | "PUT" | "DELETE" | "GET";