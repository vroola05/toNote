

export default class CheckboxComponent {
  public dom: HTMLElement = document.createElement('label');
  private checkbox: HTMLInputElement = document.createElement('input');
  private _checked = false;

  public get checked(): boolean {
    return this._checked;
  }

  public set checked(checked: boolean) {
    this._checked  = checked;
    this.checkbox.checked = this._checked;
  }

  public set readonly(readonly: boolean) {
    this.checkbox.readOnly = readonly;
  }

  public set disabled(disabled: boolean) {
    this.checkbox.disabled = disabled;
  }

  constructor() {
    this.dom.className = 'checkboxContainer';
    this.checkbox.type = 'checkbox';
    this.dom.appendChild(this.checkbox);
    
    const checkmark: HTMLElement = document.createElement('span');
    checkmark.className = 'checkmark';
    this.dom.appendChild(checkmark);
  }


}
