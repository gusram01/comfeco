import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { tap, map } from 'rxjs/operators';

import { emailPattern } from '../../../core/helpers/emailPattern';

import { SaveLocalService } from '../../../core/services/save-local.service';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/reducers/index';
import { loginActions } from 'src/app/store/actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  login: FormGroup;
  isLoading$: Observable<boolean>;

  get emailErrors() {
    const field = this.login.get('usuCorreo');
    return field.touched && field.errors;
  }
  get passErrors() {
    const field = this.login.get('usuClave');
    return field.touched && field.errors;
  }

  get email() {
    return this.login.get('usuCorreo');
  }
  get checkbox() {
    return this.login.get('checkBoxRecordar');
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private saveLocal: SaveLocalService,
    private swal: AlertService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store
      .select('loader')
      .pipe(map((data) => data.isLoading));
    this.login = this.createForm();
    this.getEmailStored();
  }

  onChecked() {
    this.checkbox.patchValue(!this.checkbox.value);
  }

  getEmailStored() {
    return this.saveLocal
      .getItem(environment.LOCAL_KEY_EMAIL)
      .then((data) => this.email.patchValue(data))
      .catch(() => this.email.patchValue(''));
  }

  createForm() {
    return this.fb.group({
      usuCorreo: ['', [Validators.required, Validators.pattern(emailPattern)]],
      usuClave: ['', [Validators.required, Validators.minLength(6)]],
      checkBoxRecordar: [true],
    });
  }

  onSubmit() {
    /**
     * Validate form changes or invalid data
     */
    if (this.login.pristine || this.login.invalid) {
      this.login.markAllAsTouched();
      return;
    }
    /**
     * Spread operator to separate usefull data
     */
    const { checkBoxRecordar, ...loginData } = this.login.value;
    /**
     * Store the email if checkbox is checked or erase otherwise
     */
    if (this.checkbox.value) {
      this.saveLocal.setItem(environment.LOCAL_KEY_EMAIL, this.email.value);
    } else {
      this.saveLocal.removeItem(environment.LOCAL_KEY_EMAIL);
    }
    this.store.dispatch(loginActions.initLogin({ loginData }));
  }
}
