import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent {
  spots: Array<any> = [];

  constructor(private http: HttpClient) {
  }

  public getSpots() {
    this.http.get("https://localhost:8090/api/v1/spot/all", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json"
        }
      }
    ).subscribe(
      {next: (response: any) => {
          console.log(response);
          this.spots = response.content;
        },
        error: error => {
          console.log(error);}
      }
    );
  }
}
