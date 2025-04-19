import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-data',
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent {
  text = "<3";
  disabled = false;
  checked = true;
  items: Array<{name:string}> = [
    {name:"Skatepark"},
    {name:"pam"},
    {name:"rampstroy"},
    {name:"world square"},
    {name: "Скейтпарк Леры"}];
  inputValue = "";
  email = "";

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log("activated route consumes", params);
    })
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
