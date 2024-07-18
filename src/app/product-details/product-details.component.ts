import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-type';
import { identifierName } from '@angular/compiler';
import { faThList } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{

  constructor(private activeRoute:ActivatedRoute, private productService:ProductService, private router:Router){}
  
  productData:product|undefined;
  removeCart:boolean = false;
  productQuantity:number = 1;
  cartData:product|undefined;

    ngOnInit(): void {
      let productId = this.activeRoute.snapshot.paramMap.get('id');
      productId && this.productService.getProduct(productId).subscribe((result)=>{
        this.productData = result;
        let cartData = localStorage.getItem('localCart');
        if(productId && cartData){
          let items = JSON.parse(cartData);
          items = items.filter((item:product)=> item.id===productId);
          if(items.length){
            this.removeCart = true;
          }
          else{
            this.removeCart = false
          }
        }

        let userString = localStorage.getItem('user');
        if(userString){
          let user =userString && JSON.parse(userString);
          let userId = user[0].id;
          this.productService.getCartList(userId);
          this.productService.cartData.subscribe((result)=>{
           let items = result.filter((item)=> productId?.toString()==item.productId?.toString());
           if(items.length){
            this.cartData = items[0];
            this.removeCart = true;
           }
          })
        }
      })

    }

    addToCart(){
      if(this.productData){
        this.productData.quantity=this.productQuantity;
        if(!localStorage.getItem('user')){
          this.productService.localAddToCart(this.productData);
        }
        else{
            let userString = localStorage.getItem('user');
            let user =userString && JSON.parse(userString);
            let userId = user[0].id;
            
              let cartData = {
                ...this.productData,
                userId,
                productId:this.productData.id
              }
              cartData.id = Math. floor(Date. now() / 1000).toString();
              this.productService.addToCart(cartData).subscribe((res)=>{
                if(res){
                  this.productService.getCartList(userId);
                  this.removeCart = true;
                }
              })
        }
        this.removeCart= true;
      }
    }

    
    handleQuantity(operation:string) {
      if(this.productQuantity<20 && operation=="plus"){
        this.productQuantity++;
      }else if(this.productQuantity>1 && operation=='min'){
        this.productQuantity--;
      }
    }
    
    
    removeToCart(productId:string){
      if(!localStorage.getItem('user')){
        this.productService.localRemoveToCart(productId);
      }else{
          this.cartData && this.productService.removeFromCart(this.cartData.id)
          .subscribe((result)=>{
            if(result){
              let userString = localStorage.getItem('user');
            let user =userString && JSON.parse(userString);
            let userId = user[0].id;
               this.productService.getCartList(userId);
            }
          })
      }
      this.removeCart = false;
    }
  }
  