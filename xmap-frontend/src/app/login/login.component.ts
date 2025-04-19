import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = "";

  constructor(private router: Router) {}

  public login() {
    this.router.navigate(['/data'], { queryParams: { email: this.email } })
      .then(r => {
        console.log("successful login", r);
    });
  }
}
