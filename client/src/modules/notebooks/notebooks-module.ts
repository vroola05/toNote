import Lang from '../../components/language/lang';

import {TabMenu} from '../../components/tabMenu/tab-menu';

export default class NotebooksModule extends TabMenu {
    constructor(){
        super(Lang.get("notebooks_name"), "notebook");
    }
}
