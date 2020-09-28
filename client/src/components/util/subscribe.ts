
export  class Observable<T> {
  private observer: ((value: T) => void)[] = [];

  private _value: T;
  
  public next(value: T) {
    this._value = value;
    this.observer.forEach((func) => { func(value); });
  }

  public getValue(): T {
    return this._value;
  }

  constructor(value: T) {
    this.next(value);
  }

  public subscribe(func: (value: T) => void): number {
    return this.observer.push(func) - 1;
  }

  public unsubscribe(identifier: number) {
    this.observer.splice(identifier, 1);
  }
}
