import './notes-module.scss';

import Lang from '../../components/language/lang';

import { StateService } from '../../services/state/state-service';

import {TabMenu} from '../../components/tabMenu/tab-menu';

export default class ChaptersModule extends TabMenu {
    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("notes_name")], 
            ["add", Lang.get("notes_add")]
        ]);
        super(labels, "notes");
    }

    public click(e:Event, identifier:number){
        StateService.set({ "key" : "note", "value" : identifier }, Lang.get("state_title_note"), "note" );
    }
}
