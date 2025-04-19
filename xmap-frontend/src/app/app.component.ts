import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DataComponent} from './data/data.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'xmap-frontend';
}
