import {State, IStateHandler} from "../../services/state/types"

import {Note} from '../../api/types';

import NoteModule from './note-module';

export class NoteStateHandler implements IStateHandler {
    private noteModule : NoteModule;

    constructor( noteModule : NoteModule ){
        this.noteModule = noteModule;
    }

    public load( state : State ) : boolean{
        
        let note:Note = {
            id : 0,
            sectionId : 0,
            name: "",
            note : {"ops":[{"insert":"‘But the new rebel is a skeptic, and will not entirely trust anything. He has no loyalty; therefore he can never be really a revolutionist. And the fact that he doubts everything really gets in his way when he wants to denounce anything. For all denunciation implies a moral doctrine of some kind; and the modern revolutionist doubts not only the institution he denounces, but the doctrine by which he denounces it. Thus he writes one book complaining that imperial oppression insults the purity of women, and then he writes another book in which he insults it himself. He curses the Sultan because Christian girls lose their virginity, and then curses Mrs. Grundy because they keep it. As a politician, he will cry out that war is a waste of life, and then, as a philosopher, that all life is waste of time. A Russian pessimist will denounce a policeman for killing a peasant, and then prove by the highest philosophical principles that the peasant ought to have killed himself. A man denounces marriage as a lie, and then denounces aristocratic profligates for treating it as a lie. He calls a flag a bauble, and then blames the oppressors of Poland or Ireland because they take away that bauble. The man of this school goes first to a political meeting, where he complains that savages are treated as if they were beasts; then he takes his hat and umbrella and goes on to a scientific meeting, where he proves that they practically are beasts. In short, the modern revolutionist, being an infinite skeptic, is always engaged in undermining his own mines. In his book on politics he attacks men for trampling on morality; in his book on ethics he attacks morality for trampling on men. Therefore the modern man in revolt has become practically useless for all purposes of revolt. By rebelling against everything he has lost his right to rebel against anything.' (G.K. Chesterton, "},{"attributes":{"background":"white","color":"#404040"},"insert":"Orthodoxy"},{"insert":", 1909)\n"}]},
            creationDate: new Date(),
            modifyDate: new Date(),
            hash: undefined
        };
        this.noteModule.setNote(note);
        return true;
    }
}