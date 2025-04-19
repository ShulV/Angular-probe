import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';

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
  items: Array<{name:string}> = [
    {name:"Skatepark"},
    {name:"pam"},
    {name:"rampstroy"},
    {name:"world square"},
    {name: "Скейтпарк Леры"}];

  constructor(private http: HttpClient) {
  }

  public changeText() {
    this.text += " :D";
  }

  public changeCheckbox() {
    this.checked = !this.checked;
  }

  public changeDisabled() {
    this.disabled = !this.disabled;
  }

  public doGetRequest() {
    this.http.get("https://localhost:8090/api/v1/spot/all").subscribe(
      {next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error);}
      }
    );
  }

  public doPostRequest() {
    let body = {"data": "some data value"};
    this.http.post("https://localhost:8090/test/post-request", body, {
      headers: {
        "Content-Type": "application/json"
      }
    }).subscribe(
      {next: response => {
          console.log(response);
        },
        error: error => {
          console.log(error);}
      }
    );
  }
}
