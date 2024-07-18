import { Component, OnInit } from '@angular/core';
import { cart, login, product, signUp } from '../data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit{

  constructor(private service:UserService, private productService:ProductService){}

  isLogin:boolean  = true;
  errorString:string|undefined = "";
    ngOnInit(): void {
      this.service.userAuthReload();
    }

    signUp(data:signUp){
      this.service.userSignUp(data);
    }

    openLogin(){
        this.isLogin = !this.isLogin;
    }
    login(data:login){
      this.service.userLogin(data);
      this.service.isLoginError.subscribe((isError)=>{
        if(isError){
          this.errorString = "email or password is wrong";
        }
        else{  
          setTimeout(() => {
            this.addToCartLocalToRemote();
          }, 1000);
        }
      })
    }
    addToCartLocalToRemote(){
      let localCart = localStorage.getItem('localCart');
      let userString = localStorage.getItem('user')
      let user =userString && JSON.parse(userString);
      let userId = user[0].id;
      if(localCart){
        let cartList:product[] =  JSON.parse(localCart);
      cartList.forEach((element:product,index)=> {
        let cartData = {
          ...element,
          userId,
          productId:element.id
        }
        cartData.userId = userId;
        cartData.id = Math. floor(Date. now() / 1000).toString();
        // setTimeout(() => {//fast api call hone ke karan json server usko handle nhi kar sakega
          this.productService.addToCart(cartData).subscribe();
          if(cartList.length==index+1){
            localStorage.removeItem('localCart');
          }
        // }, 500);
      });
    }
      this.productService.getCartList(userId);
    
    }

}
