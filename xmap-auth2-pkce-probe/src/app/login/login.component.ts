import { Component } from '@angular/core';
import * as CryptoES from 'crypto-es';
import {environment} from "../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private pkceStates = [
    "getting auth code",
    "code exists, access token getting",
    "access token exists",
  ];

  public pkceState;

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient) {
    this.pkceState = this.pkceStates[0];
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['code']) {
        this.pkceState = this.pkceStates[1];

        const code = params['code'];
        const state = params['state'];

        //удалили параметры из урла
        window.history.pushState({}, "", document.location.href.split("?")[0]);

        console.log(`code: ${code}`);
        console.log(`state: ${state}`);

        this.getTokens(code, state);
        return;
      }

      this.startPKCE();
    });
  }

  private getTokens(authCode: string, state: string) {
    console.log('tokens getting');
    if (state !== localStorage.getItem("state")) {
      console.error("state mismatch");
      return;
    }

    const codeVerifier = localStorage.getItem('codeVerifier') as string;
    localStorage.removeItem('codeVerifier');
    console.log(`codeVerifier ${codeVerifier}`);

    const body = new HttpParams()
      .append('grant_type', 'authorization_code')
      .append('code', authCode)
      .append('code_verifier', codeVerifier)
      .append('client_id', environment.kcClientId)
      .append('redirect_uri', environment.frontendLoginUrl);

    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }

    console.log(`get tokens: body=${body}, options=${options}`);

    this.http.post(environment.kcClientUrl + '/token', body, options).subscribe({
      next: (res: any) => {
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("id_token", res.id_token);
        localStorage.setItem("refresh_token", res.refresh_token);
        this.pkceState = this.pkceStates[2];
      },
      error: (err) => {
        console.log('tokens getting failed', err);
      }
    });
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
      "redirect_uri=" + encodeURIComponent(environment.frontendLoginUrl),
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
