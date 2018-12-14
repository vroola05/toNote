import './chapters-module.scss';

import Lang from '../../components/language/lang';

import {TabMenu} from '../../components/tabMenu/tab-menu';

export default class ChaptersModule extends TabMenu {
    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("chapters_name")], 
            ["add", Lang.get("chapters_add")]
        ]);
        super(labels, "chapter");
    }
}
