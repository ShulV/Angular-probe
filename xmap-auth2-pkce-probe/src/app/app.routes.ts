import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {DataComponent} from "./data/data.component";
import {CallbackComponent} from "./callback/callback.component";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'data', component: DataComponent},
  {path: 'callback', component: CallbackComponent},
];
