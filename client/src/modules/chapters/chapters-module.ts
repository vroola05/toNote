import Lang from '../../components/language/lang';

import {TabMenu} from '../../components/tabMenu/tab-menu';

export default class ChaptersModule extends TabMenu {
    constructor(){
        super(Lang.get("chapters_name"), "chapter");
    }
}
