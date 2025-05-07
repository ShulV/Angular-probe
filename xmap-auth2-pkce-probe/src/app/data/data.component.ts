import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface AccessTokenResponse {
  access_token: string;
  id_token?: string;
  refresh_token: string;
}

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent {
  spots$: Array<any> | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  public async getSpots() {
    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        await this.router.navigate(['/login']);
        return;
      }

      const response : any = await firstValueFrom(
        this.http.get("https://localhost:8090/api/v1/spot/all", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
      );

      console.log("spots got:", response);
      this.spots$ = response.content ?? [];
    } catch (error) {
      console.log("Error fetching spots:", error);
    }
  }

  private async getAccessToken(): Promise<string | undefined> {
    let access_token = localStorage.getItem("access_token");
    if (access_token) {
      return access_token;
    }

    let refresh_token = localStorage.getItem("refresh_token");
    if (refresh_token) {
      const updateResult = await this.updateTokens(refresh_token);
      if (updateResult && updateResult.access_token) {
        localStorage.setItem("access_token", updateResult.access_token);
        localStorage.setItem("refresh_token", updateResult.refresh_token);
        return updateResult.access_token;
      }
    }

    return undefined;
  }

  private async updateTokens(refresh_token: string): Promise<AccessTokenResponse | undefined> {
    const body = new HttpParams()
      .append('grant_type', 'refresh_token')
      .append('client_id', environment.kcClientId)
      .append('refresh_token', refresh_token);

    try {
      const result = await firstValueFrom(this.http.post(environment.kcClientUrl + '/token', body));
      return result as AccessTokenResponse;
    } catch (error) {
      console.error("Error refreshing tokens:", error);
      return undefined;
    }
  }
}
