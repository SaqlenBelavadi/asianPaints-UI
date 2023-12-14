import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentBase } from '@shared/abstracts/component-base';
import { FormBase } from '@shared/contracts';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends ComponentBase implements FormBase {
  loginForm!: FormGroup;

  invalidUserName: boolean = false;
  constructor(private loginService: LoginService) {
    super();
  }

  /* Public Methods */
  initVariables(): void {}

  subscribeEvents(): void {}

  load(): void {
    this.buildForm();
  }

  unload(): void {}

  buildForm(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required, usernameValidator]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  bindForm(): void {}

  resetForm(): void {
    this.loginForm.reset();
  }

  login(): void {
    this.loginForm.markAllAsTouched();
    let username = this.loginForm.controls.username.value.toString();

    if (/@asianpaints.com\s*$/.test(username)) {
    } else {
      username = `${this.loginForm.controls.username.value
        .toString()
        .trim()}@asianpaints.com`.toString();
    }
    if (this.loginForm.valid) {
      this.loginService.login(username, this.loginForm.controls.password.value);
    }
  }

  resolved() {}
}

export function usernameValidator(control: FormControl) {
  const username = control.value;

  // Regular expression to validate username without domain
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  // Regular expression to validate username with domain
  const usernameWithDomainRegex = /^[A-Za-z0-9._%+-]+@asianpaints\.com$/;

  // Check if the username matches either regular expression
  if (usernameRegex.test(username) || usernameWithDomainRegex.test(username)) {
    return null; // Return null if the username is valid
  } else {
    return { invalidUsername: true }; // Return an object with an error key if the username is invalid
  }
}
