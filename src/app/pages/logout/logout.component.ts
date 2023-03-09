import { Component, OnInit, isDevMode } from '@angular/core';
import { UserProvider } from "../user/user.provider";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidator } from '../../validators/custom.validators';
import { Security } from '../../utils/security.util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  styleUrls: ['./logout.component.css'],
  templateUrl: 'logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    Security.clear();
    this.router.navigate(['/login']);
  }
}
