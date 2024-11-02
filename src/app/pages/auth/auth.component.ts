import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  action : 'login' | 'register' = 'login'; // Valor inicial para 'login'

  constructor(private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      this.action = params['action'] || 'login';
    })
  }

  toggleAction(action: 'login' | 'register') {
    
  }
}
