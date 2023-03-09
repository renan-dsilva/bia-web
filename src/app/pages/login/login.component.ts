import { Component, OnInit, isDevMode } from '@angular/core';
import { UserProvider } from "../user/user.provider";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidator } from '../../validators/custom.validators';
import { Security } from '../../utils/security.util';
import { Router } from '@angular/router';
import { ApiResponse } from 'app/providers/provider';
import { User } from '../user/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.css'],
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public isBusy = false;
  public appleStoreUrl = environment.appleStoreUrl
  public googlePlayUrl = environment.googlePlayUrl

  constructor(
    private provider: UserProvider,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.setUp();
  }

  ngOnInit() {
  }


  setUp() {
    this.isAlreadyLogged();
    this.populateForm();
  }

  isAlreadyLogged() {
    const token = Security.getToken();
    if (token) {
      this.isBusy = true;
      this
        .provider
        .refreshToken()
        .subscribe(
          (response: any) => {
            this.isBusy = false;
            this.setUser(response.data, response.data.token);
          },
          (err) => {
            localStorage.clear();
            this.isBusy = false;
          }
        );
    }
  }

  populateForm() {
    var email = '';
    var password = '';
    if (isDevMode()) {
      email = 'marcelo.reis@foursys.com.br';
      password = '123456';
    }

    this.form = this.fb.group({
      email: [email, Validators.compose([
        Validators.required,
        CustomValidator.EmailValidator
      ])],
      password: [password, Validators.compose([
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.required
      ])]
    });
  }

  login() {

    this.isBusy = true;
    this.snackBar.open('Aguarde...', '', { panelClass: ['alert', 'alert-warning'] });

    this
      .provider
      .authenticate(this.form.value)
      .subscribe(
        (response: any) => {
          this.isBusy = false;
          let res = response as ApiResponse
          let user: User = res.data

          if (res.success) {
            this.setUser(user, user.token);
          } else {
            this.snackBar.open(res.message, 'Fechar', { panelClass: ['alert', 'alert-danger'] });
          }
        },
        (err) => {
          this.snackBar.open(err.message, 'Fechar', { panelClass: ['alert', 'alert-danger'] });
          console.log(err);
          this.isBusy = false;
        }
      );
  }

  setUser(user: User, token: string) {
    console.log(user)
    Security.set(user, token);
    this.router.navigate(['/']);
    this.snackBar.open(`Bem-Vindo(a) à ${environment.appName}`, '', { duration: 5000, panelClass: ['alert', 'alert-success'] });
  }
}
