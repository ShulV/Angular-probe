import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  text = "<3";
  disabled = false;
  checked = true;
  items: Array<{name:string}> = [{name:"Skatepark"}, {name:"pam"}, {name:"rampstroy"}, {name:"world square"}];


  public changeText() {
    this.text += " :D";
  }

  public changeCheckbox() {
    this.checked = !this.checked;
  }

  public changeDisabled() {
    this.disabled = !this.disabled;
  }
}
