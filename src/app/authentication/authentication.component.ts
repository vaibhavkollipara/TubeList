import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '.././authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FadeInOut } from '.././animations/fadeinout';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
  animations: [
    FadeInOut.animation
  ]
})

export class AuthenticationComponent implements OnInit {

  signUpStatus: boolean = false;
  signUpForm : FormGroup;
  loginForm : FormGroup;
  loginLoading: boolean = false;
  signupLoading: boolean = false;

  signUpSubscription : any;
  loginSubscription : any;

  constructor(private _auth: AuthenticationService,
              private _router : Router,
              private _formBuilder : FormBuilder) { }

  ngOnInit() {

    this.signUpForm = this._formBuilder.group({
      first_name : ["",[Validators.required, Validators.minLength(3)]],
      last_name : ["",[Validators.required, Validators.minLength(3)]],
      email: ["",[Validators.required, Validators.email]],
      username : ["",[Validators.required, Validators.minLength(4)]],
      password : ["",[Validators.required, Validators.minLength(5)]]
    });

    this.loginForm = this._formBuilder.group({
      username : ["",[Validators.required]],
      password : ["",[Validators.required]]
    });

  }

  ngOnDestroy(){
    if(this.signUpSubscription){
      this.signUpSubscription.unsubscribe();
    }
  }

  signIn(){
     this.loginLoading = true;
     let credentials = this.loginForm.value;
     let data ={
        'username' : credentials.username,
        'password' : credentials.password
     };
     this._auth.login(data).then(res => {
       if(res){
         //alert("Login Successful");
         this._router.navigate(['/dashboard']);
       }else{
         alert("Failed to login");
       }
       this.loginLoading = false;
     },err=>{
       alert("Something went wrong");
       this.loginLoading = false;
     });
  }

  signUp(){
    this.signupLoading = true;
    let userDetails = this.signUpForm.value;
    let data = {
      'first_name':userDetails.first_name,
      'last_name' : userDetails.last_name,
      'email' : userDetails.email,
      'username' : userDetails.username,
      'password' : userDetails.password
    };

    this.signUpSubscription =  this._auth.register(data)
              .subscribe((res) => {
                alert("Signup successful");
                this.signupLoading = false;
                this.signUpForm.reset();
              },
              (err) => {
                if(err.username){
                    alert(err.username[0]);
                }else{
                  alert("Something wrong...");
                }
                this.signupLoading = false;
              });
  }

  isLoginSubmitable(): boolean{
    if(!this.loginForm.valid || this.loginLoading)
      return true;
    else
      return false;
  }

  isSignupSubmitable(): boolean{
    if(!this.signUpForm.valid || this.signupLoading)
      return true;
    else
      return false;
  }

}
