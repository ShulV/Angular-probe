import { Component } from '@angular/core';
import * as CryptoES from 'crypto-es';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  constructor() {
    this.startPKCE();
  }

  private startPKCE() {
    console.log('login component startPKCE');
    const state = this.randomString(40);
    const codeVerifier = this.randomString(128);

    //сохраняем временное значение, чтобы затем сверить их при получении ответа от auth server
    localStorage.setItem("state", state);
    localStorage.setItem("codeVerifier", codeVerifier);
    console.log(`state = ${state}`);
    console.log(`codeVerifier = ${codeVerifier}`);

    //получаем хэш значения на основе codeVerifier
    //заменяем символы согласно требованиям RFC 7636 sec 4
    const codeChallenge = CryptoES.default.SHA256(codeVerifier)
      .toString(CryptoES.default.enc.Base64)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    console.log(`codeChallenge = ${codeChallenge}`);

    const params = [
      "response_type=code",
      "state=" + state,
      "client_id=" + environment.kcClientId,
      "scope=openid",
      "code_challenge=" + codeChallenge,
      "code_challenge_method=S256",
      "redirect_uri=" + encodeURIComponent(environment.frontendRedirectUrl),
    ];
    const url = environment.kcClientUrl + '/auth' + '?' + params.join('&');
    console.log(`url = ${url}`);
    window.open(url, '_self');
  }

  // Функция для генерации случайной строки заданной длины
  private randomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }


}
