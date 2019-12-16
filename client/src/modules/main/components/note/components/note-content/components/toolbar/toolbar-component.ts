import ButtonIconComponent from "../../../../../../../../components/controls/buttons/button-icon/button-icon-component";
import svgLeft from '../../../../../../../../assets/images/left.svg';
import svgRight from '../../../../../../../../assets/images/right.svg';
import {Resize} from '../../../../../../../../services/resize/resize-service';

export default class ToolbarComponent {
	public dom: HTMLDivElement;
	private toolbarContainer: HTMLDivElement;

	private btnLeft: ButtonIconComponent;
	private btnRight: ButtonIconComponent;

	private toolbarGroupMargin = 15;
	private toolbarGroups: Array<HTMLSpanElement>;
	private toolbarPages: Array<Array<HTMLSpanElement>>;
	private toolbarGroupsWidth: Array<number>;
	private toolbarScrollIndex: number = 0;
	private toolbarTimer: any;
	private toolbarTimeout = 500;

	constructor() {
		this.dom = document.createElement("div");
		this.dom.classList.add("toolbar");
		
		this.btnLeft = new ButtonIconComponent(svgLeft,null,() => {
			this.goToToolbarPage("previous");
		},"small btnToolbar");
		this.btnLeft.disable = true;
		this.dom.appendChild(this.btnLeft.dom);

		this.toolbarContainer = document.createElement("div");
		this.toolbarContainer.classList.add("toolbarContainer");
		
		this.dom.appendChild(this.toolbarContainer);

		this.btnRight = new ButtonIconComponent(svgRight,null,
		() => {
			this.goToToolbarPage("next");
		},"small btnToolbar");
		this.btnRight.disable = true;
		this.dom.appendChild(this.btnRight.dom);

		this.createToolbar();		
		
		this.calculateToolbarPages();

		Resize.set("toolbar", ()=> {
			clearTimeout(this.toolbarTimer);
			this.calculateToolbarPages();
		});
	}

	public calculateToolbarPages() {
		this.toolbarTimer = setTimeout(() => {
		if (this.toolbarGroupsWidth) {
			let width = this.toolbarContainer.getBoundingClientRect().width;
			if (width === 0) {
				return;
			}

			this.toolbarPages = [];
			let pageWidth = 0;
			let pageIndex = 0;
			this.toolbarPages[pageIndex] = new Array();

			for (let i=0; i<this.toolbarGroupsWidth.length; i++) {
				pageWidth += this.toolbarGroupsWidth[i];
				
				if (pageWidth > width) {
					pageWidth = this.toolbarGroupsWidth[i];
					pageIndex++;
					this.toolbarPages[pageIndex] = new Array();
				}
				this.toolbarPages[pageIndex].push(this.toolbarGroups[i]);
			}
			this.toolbarScrollIndex = (this.toolbarScrollIndex<this.toolbarPages.length-1)?this.toolbarScrollIndex:this.toolbarPages.length-1;
			this.setPagesState();
		}
	}, this.toolbarTimeout );
	}

	private setPagesState() {
		for (let i=0; i<this.toolbarPages.length; i++) {
			if (i===this.toolbarScrollIndex) {
				this.showToolbarPage(i);
			} else {
				this.hideToolbarPage(i);
			}
		}
		this.setPagesBtnState();
	}

	private setPagesBtnState() {
		if (this.toolbarScrollIndex <= 0) {
			this.btnLeft.disable = true;
		} else {
			this.btnLeft.disable = false;
		}
		if (this.toolbarScrollIndex >= this.toolbarPages.length-1) {
			this.btnRight.disable = true;
		} else {
			this.btnRight.disable = false;
		}
	}

	private hideToolbarPage(index: number) {
		const pages = this.toolbarPages[index];
		for (let page of pages) {
			page.classList.add("hidden");
		}
	}

	private showToolbarPage(index: number) {
		const pages = this.toolbarPages[index];
		for (let page of pages) {
			page.classList.remove("hidden");
		}
	}

	private goToToolbarPage(direction:string) {
		
		if (direction==="previous") {
			if (this.toolbarScrollIndex > 0 ) {
				this.toolbarScrollIndex--;
			}
		} else {
			if ( this.toolbarScrollIndex < this.toolbarPages.length-1 ) {
				this.toolbarScrollIndex++;
			}
		}
		this.setPagesState();
	}

	public setToolbarGroupsWidth() {
		this.toolbarGroupsWidth = new Array<number>();
		for(let i=0; i<this.toolbarGroups.length; i++) {
			this.toolbarGroupsWidth.push(this.toolbarGroups[i].getBoundingClientRect().width+this.toolbarGroupMargin);
		}
	}

	private createToolbar() {
		this.toolbarGroups = new Array<HTMLSpanElement>();
		//////////////////////////////////////////////////
		//
		//////////////////////////////////////////////////
		var domGroupSizeType = document.createElement("span");
		domGroupSizeType.className = "ql-formats groupSizeType";
		this.toolbarContainer.appendChild(domGroupSizeType);
		this.toolbarGroups.push(domGroupSizeType);

		var domToobarSize = document.createElement("select");
		domToobarSize.className = "tb-btn ql-size";
		domToobarSize.innerHTML = '<option value="small">Klein</option><option selected>Normaal</option><option value="large">Groot</option><option value="huge">Supergroot</option>';
		domGroupSizeType.appendChild(domToobarSize);

		var domToobarFonts = document.createElement("select");
		domToobarFonts.className = "tb-btn ql-font";
		domToobarFonts.innerHTML = '<option selected="selected"></option><option value="serif"></option><option value="monospace"></option>';
		domGroupSizeType.appendChild(domToobarFonts);

		//////////////////////////////////////////////////
		//
		//////////////////////////////////////////////////
		var domGroupDefault = document.createElement("span");
		domGroupDefault.className = "ql-formats groupDefault";
		this.toolbarContainer.appendChild(domGroupDefault);
		this.toolbarGroups.push(domGroupDefault);

		var domToobarBold = document.createElement("button");
		domToobarBold.className = "tb-btn ql-bold";
		domToobarBold.innerHTML = "B";
		domGroupDefault.appendChild(domToobarBold);

		var domToobarItalic = document.createElement("button");
		domToobarItalic.className = "tb-btn ql-italic";
		domToobarItalic.innerHTML = "I";
		domGroupDefault.appendChild(domToobarItalic);

		var domToobarUnderline = document.createElement("button");
		domToobarUnderline.className = "tb-btn ql-underline";
		domToobarUnderline.innerHTML = "U";
		domGroupDefault.appendChild(domToobarUnderline);

		//////////////////////////////////////////////////
		//
		//////////////////////////////////////////////////
		var domGroupStyle = document.createElement("span");
		domGroupStyle.className = "ql-formats groupStyle";
		this.toolbarContainer.appendChild(domGroupStyle);
		this.toolbarGroups.push(domGroupStyle);

		var domToobarH1 = document.createElement("button");
		domToobarH1.className = "tb-btn ql-header";
		domToobarH1.value = "1";
		domGroupStyle.appendChild(domToobarH1);

		var domToobarH2 = document.createElement("button");
		domToobarH2.className = "tb-btn ql-header";
		domToobarH2.value = "2";
		domGroupStyle.appendChild(domToobarH2);

		var domToobarBlockQuote = document.createElement("button");
		domToobarBlockQuote.className = "tb-btn ql-blockquote";
		domGroupStyle.appendChild(domToobarBlockQuote);

		var domToobarCodeBlock = document.createElement("button");
		domToobarCodeBlock.className = "tb-btn ql-code-block";
		domGroupStyle.appendChild(domToobarCodeBlock);
		//////////////////////////////////////////////////
		//
		//////////////////////////////////////////////////
		var domGroupLists = document.createElement("span");
		domGroupLists.className = "ql-formats groupLists";
		this.toolbarContainer.appendChild(domGroupLists);
		this.toolbarGroups.push(domGroupLists);

		var domToobarListOrdered = document.createElement("button");
		domToobarListOrdered.className = "tb-btn ql-list";
		domToobarListOrdered.value = "ordered";
		domGroupLists.appendChild(domToobarListOrdered);

		var domToobarListBulled = document.createElement("button");
		domToobarListBulled.className = "tb-btn ql-list";
		domToobarListBulled.value = "bullet";
		domGroupLists.appendChild(domToobarListBulled);

		var domToobarAlign = document.createElement("select");
		domToobarAlign.className = "tb-btn ql-align";
		domToobarAlign.innerHTML = '<option selected=""></option><option value="center"></option><option value="right"></option><option value="justify"></option>';
		domGroupLists.appendChild(domToobarAlign);		

		var domToobarIndent1 = document.createElement("button");
		domToobarIndent1.className = "tb-btn ql-indent";
		domToobarIndent1.value = "-1";
		domGroupLists.appendChild(domToobarIndent1);

		var domToobarIndent2 = document.createElement("button");
		domToobarIndent2.className = "tb-btn ql-indent";
		domToobarIndent2.value = "+1";
		domGroupLists.appendChild(domToobarIndent2);
		//////////////////////////////////////////////////
		//
		//////////////////////////////////////////////////
		var domGroupColor = document.createElement("span");
		domGroupColor.className = "ql-formats groupColor";
		this.toolbarContainer.appendChild(domGroupColor);
		this.toolbarGroups.push(domGroupColor);

		var domToobarColor = document.createElement("select");
		domToobarColor.className = "tb-btn ql-color";
		domToobarColor.innerHTML = '<option value="#e60000"></option><option value="#ff9900"></option><option value="#ffff00"></option><option value="#008a00"></option><option value="#0066cc"></option><option value="#9933ff"></option><option value="#ffffff"></option><option value="#facccc"></option><option value="#ffebcc"></option><option value="#ffffcc"></option><option value="#cce8cc"></option><option value="#cce0f5"></option><option value="#ebd6ff"></option><option value="#bbbbbb"></option><option value="#f06666"></option><option value="#ffc266"></option><option value="#ffff66"></option><option value="#66b966"></option><option value="#66a3e0"></option><option value="#c285ff"></option><option value="#888888"></option><option value="#a10000"></option><option value="#b26b00"></option><option value="#b2b200"></option><option value="#006100"></option><option value="#0047b2"></option><option value="#6b24b2"></option><option value="#444444"></option><option value="#5c0000"></option><option value="#663d00"></option><option value="#666600"></option><option value="#003700"></option><option value="#002966"></option><option value="#3d1466"></option>';
		domGroupColor.appendChild(domToobarColor);

		var domToobarBackground = document.createElement("select");
		domToobarBackground.className = "tb-btn ql-background";
		domToobarBackground.innerHTML = "BC";
		domGroupColor.appendChild(domToobarBackground);
	}
}
