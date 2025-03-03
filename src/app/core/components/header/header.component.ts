import { Component } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})

export class HeaderComponent {

  constructor(private router: Router) {
   }

  navegar(direccion: string) {
    this.router.navigate([direccion]);
    console.log(direccion);
  }


}