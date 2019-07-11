import { Util } from '../../../components/util/util';
import { Constants } from '../../../services/config/constants';

/**
 * 
 */
export class Tab {
    public child:Tab = null;
    public parent:Tab = null;
	public dom:HTMLElement;

    constructor(){
        this.dom = document.createElement("div");
        this.dom.className = "tab";
    }

    /**
     * Hides or shows the menu's according to the size of the screen mobile, tablet, desktop or retina.
     * - on tablet: only show one menuItem
     * - on desktop: show max two items
     * - on retina: always show all items
     */
    public setDeviceLayout(){
        const device = Util.getDevice();
        const tab = this.getFirstTab();
        const stackAmount = tab.getStackSize();
        
        if(device === Constants.desktop){
            if(stackAmount>2){
                tab.setHidden(1);
                return;
            }
        } else if(device === Constants.tablet){
            if(stackAmount>2){
                tab.setHidden(2);
                return;
            } else if(stackAmount>1){
                tab.setHidden(1);
                return;
            }
        }
        tab.setHidden(0);
    }

	public getStackSize() : number {
		if(this.dom.classList.contains("stack")){
			return 1 + (this.child==null?0:this.child.getStackSize());
		} else {
            return 0;
        }
	}

    public setHidden(amount : number = 1){
        if( amount > 0 ){
            this.dom.classList.add("hide");
        }else {
            this.dom.classList.remove("hide");
        }
        if(this.child != null){
            this.child.setHidden(amount-1);
        }
    }

    /**
     * Link a child Tab item. 
     * @param child 
     */
	public setChild(child:Tab){
        this.child = child;
        this.child.setParent(this);
    }
    
    /**
     * Link a parent Tab item. 
     * @param parent 
     */
    public setParent(parent:Tab){
		this.parent = parent;
    }

    /**
     * Return the first tab in the list
     */
    public getFirstTab() : Tab {
        if(this.parent==null){
            return this;
        }
        return this.parent.getFirstTab();
    }

    /**
     * Return the last tab in the list
     */
    public getLastTab() : Tab {
        if(this.child==null){
            return this;
        }
        return this.child.getLastTab();
    }

    /**
     * 
     */
	public back() : boolean {
		if ( this.dom.classList.contains("active") && this.parent != null ) {
            this.hide();
            return true;
		} else if ( this.child != null ) {
            
			if( this.child.back() ){
                this.dom.classList.add("active");
            }
        }
        return false;
    }

    public activate(){
        this.dom.classList.add("active");
    }
    public deactivate(){
        this.dom.classList.remove("active");
    }
    public deactivateAll() : void{
        let tab: Tab = this.getFirstTab();
        while(tab != null){
            tab.deactivate();
            tab = tab.child;
        }
    }

    /**
     * Shows tab. Put item on stack and set active.
     */
    public show() : void {
        this.deactivateAll();
        this.activate();
		if ( ! this.dom.classList.contains("stack")) {
			this.dom.classList.add("stack");
		}
    }

    /**
     * Hides tab
     * Removes item from the stack
     */
    public hide() : void {
        this.onHide();
		if( this.child != null ){
			this.child.hide();
		}
		this.dom.classList.remove("active");
        this.dom.classList.remove("stack");
    }
    
    /**
     * IF IMPLEMENTED
     */
    public onHide() : void {
    }
}