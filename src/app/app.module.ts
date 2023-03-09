import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';

/** BIA */
import { Provider } from "./providers/provider";
import { UserProvider } from "./pages/user/user.provider";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { PagesComponentsModule } from './pages/components/pages-component.module';
import { GlobalErrorHandler } from './global-error-handler';
import { ServerErrorInterceptor } from './server-error.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxCurrencyModule } from "ngx-currency";
import { NgxMaskModule, IConfig } from 'ngx-mask';
/** BIA */

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  imports: [
    HttpClientModule,
    PagesComponentsModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    NgxCurrencyModule,
    NgxMaskModule.forRoot(maskConfig),

    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    LogoutComponent,
  ],
  providers: [
    AuthService,
    Provider,
    UserProvider,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
