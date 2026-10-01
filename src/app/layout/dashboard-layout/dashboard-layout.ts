import { Component } from '@angular/core';
import { NavbarUser } from '../../partials/navbar-user.component/navbar-user.component';
import { RouterOutlet } from '@angular/router';
import { HomeScreen } from "../../screens/home-screen/home-screen";

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    NavbarUser,
    RouterOutlet
],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {

}
