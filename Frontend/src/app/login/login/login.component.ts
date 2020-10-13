import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  contactForm: FormGroup;
  messageError: string;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,
              private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      Login: ['', Validators.required],
      Email: ['', [Validators.required, Validators.pattern(/[^@]+@[^\.]+\..+/)]],
      MPasse: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() { return this.contactForm.controls; }

  onSubmit() {
    this.submitted = true;
    const email = this.contactForm.value.Email;
    const Password = this.contactForm.value.MPasse;
    this.userService.connection({ Email: email, MPasse: Password }).subscribe(
      (data) => {
        const id = ((data.body) as any).id;
        this.authentificationService.saveId(id);
        const role = ((data.body) as any).role;
        this.authentificationService.saveRole(role);
        this.authentificationService.saveToken(data.body['token']);
        console.log(data);
        if (role === 'admin') {
          this.router.navigateByUrl('/administrateur');
        } else {
          this.router.navigateByUrl('/list/todoList');
        }
      },
      (err) => {
        console.log(err);
        this.messageError = err.error.message;
      }
    );
    console.log('rryyyyyyyyyy');
  }

  validForm() {
    return this.contactForm.status === 'INVALID';
  }

  navigateToSignup() {
    this.router.navigateByUrl('/signup');
  }

  onGoBack() {
    this.contactForm.reset();
    this.messageError = null;
    this.submitted = false;
  }
}
