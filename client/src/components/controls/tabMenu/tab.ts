import { Util } from '../../../components/util/util';

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
     * 
     */
    public show() : void {
        this.deactivateOther();
		this.dom.classList.add("active");
		if ( ! this.dom.classList.contains("stack")) {
			this.dom.classList.add("stack");
		}
    }

    public getFirstItem() : Tab {
        if(this.parent==null){
            return this;
        }
        return this.parent.getFirstItem();
    }

    public setMenuLayout(){
        const device = Util.getDevice();
        const tab = this.getFirstItem();
        const stackAmount = tab.getStackAmount();
        
        if(device === Util.desktop){
            if(stackAmount>2){
                tab.setHidden(1);
                return;
            }
        } else if(device === Util.tablet){
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

	public getStackAmount() : number {
		if(this.dom.classList.contains("stack")){
			return 1 + (this.child==null?0:this.child.getStackAmount());
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

    private deactivateOther(direction:number=0){
        if(direction<0){
            if(this.parent != null){
                this.parent.dom.classList.remove("active");
                this.parent.deactivateOther(direction);
            }
        } else if(direction>0){
            if(this.child != null){
                this.child.dom.classList.remove("active");
                this.child.deactivateOther(direction);
            }
        } else{
            this.deactivateOther(-1);
            this.deactivateOther(1);
        }
    }

    /**
     * 
     * @param child 
     */
	public setChild(child:Tab){
        this.child = child;
        this.child.setParent(this);
    }
    
    public setParent(parent:Tab){
		this.parent = parent;
    }
    
    public onHide() : void {

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
    

    /**
     * 
     */
    public hide() : void {
        this.onHide();
		if( this.child != null ){
			this.child.hide();
		}
		this.dom.classList.remove("active");
        this.dom.classList.remove("stack");
    }
}