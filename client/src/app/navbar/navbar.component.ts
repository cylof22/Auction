import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../module/authentication/services/authentication.service'

@Component({
  selector: 'auction-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [
    AuthenticationService
  ]
})
export class NavbarComponent implements OnInit {
  isAuthenticated : boolean;
  userName:string;
  userId:string;

  constructor(private authService: AuthenticationService) { 
    this.isAuthenticated = false;
    if (this.authService.currentUser != undefined && this.authService.currentUser != null ) {
      this.isAuthenticated = true;
      this.userName = this.authService.currentUser.username;
      this.userId = this.authService.currentUser.id;
    }
  }

  ngOnInit() {
  }

  
  onLogout() {
    this.authService.logout();

    this.isAuthenticated = false;
    this.userName = "";
    this.userId = "";
    location.href = "/#/";
  }
}
