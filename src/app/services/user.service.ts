import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { login, signUp } from '../data-type';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient, private router:Router) { }
  isLoginError= new EventEmitter<boolean>(false)

  userSignUp(data:signUp){
    this.http.post('http://localhost:3000/user',
    data,
    {observe:'response'}).subscribe((result)=>{
      if(result){
        localStorage.setItem('user',JSON.stringify(result.body));
        this.router.navigate(['']);
      }
    })
  }

  userAuthReload(){
    if(localStorage.getItem('user')){
      this.router.navigate([''])
    }
  }

  userLogin(data:login){
    this.http.get(`http://localhost:3000/user?email=${data.email}&password=${data.password}`,
    {observe:'response'}).subscribe((result:any)=>{
     if(result && result.body && result.body.length>=1){
       this.isLoginError.emit(false)
       localStorage.setItem('user',JSON.stringify(result.body))
       this.router.navigate([''])
     }else{
       this.isLoginError.emit(true)
     }
    })
   }
}
