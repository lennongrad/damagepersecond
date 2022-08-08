import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveService {
  key = "123";

  constructor() { }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }

  public getData(key: string) {
    let data = localStorage.getItem(key)|| "";
    return this.decrypt(data);
  }
  
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  private encrypt(txt: string): string {
    return txt;
  }

  private decrypt(txtToDecrypt: string) {
    return txtToDecrypt;
  }
}
