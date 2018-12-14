import './notes-module.scss';

import Lang from '../../components/language/lang';

import {TabMenu} from '../../components/tabMenu/tab-menu';

export default class ChaptersModule extends TabMenu {
    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("notes_name")], 
            ["add", Lang.get("notes_add")]
        ]);
        super(labels, "notes");
    }
}
