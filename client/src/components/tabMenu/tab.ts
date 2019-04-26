/**
 * 
 */
export class Tab {
    public child:Tab;
    public parent:Tab = null;
	public domTab:HTMLElement;

    constructor(){
        this.domTab = document.createElement("div");
		  this.domTab.className = "tab";
    }
        
    /**
     * 
     */
    public show() : void {
		//if( this.child != null ){
		//	this.child.hide();
		//}

		this.domTab.classList.add("active");
		if ( ! this.domTab.classList.contains("stack")) {
			this.domTab.classList.add("stack");
		}
    }

    /**
     * 
     */
    public get() : HTMLElement{
        return this.domTab;
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
    /**
     * 
     */
	public back() : boolean {
		if ( this.domTab.classList.contains("active") && this.parent!=null) {
            
            this.hide();
            return true;
		}else if ( this.child != null ) {
			if( this.child.back() ){
                this.domTab.classList.add("active");
            }
        }
        return false;
    }
    
    /**
     * 
     */
    public hide() : void {
		if( this.child != null ){
			this.child.hide();
		}
		this.domTab.classList.remove("active");
		this.domTab.classList.remove("stack");
    }

}