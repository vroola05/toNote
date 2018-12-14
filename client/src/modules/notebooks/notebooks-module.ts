import Lang from '../../components/language/lang';

import {TabMenu} from '../../components/tabMenu/tab-menu';
import { stringify } from 'querystring';

export default class NotebooksModule extends TabMenu {
    constructor(){
        let labels = new Map<string,string>([
            ["name", Lang.get("notebooks_name")], 
            ["add", Lang.get("notebooks_add")]
        ]);
        super(labels, "notebook");
    }

    public click(e:Event, identifier:number){
        console.log("Load the chapters");
    }
}
