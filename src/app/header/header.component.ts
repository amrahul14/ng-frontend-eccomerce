import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  @ViewChild('searchInputText') searchInputText!: ElementRef;
  menuType:string = "default";

  sellerName:string="";
  allProduct:product[]|undefined;
  filterProduct:product[]|undefined;

  userName:string = "";

  cartItems:number = 0;

  constructor(private route: Router, private service:ProductService) {}

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          let sellerStore = localStorage.getItem('seller');
          let sellerData = sellerStore && JSON.parse(sellerStore)[0];
          if (sellerData && sellerData.name) { // Check if sellerData and sellerData.name are defined
            this.sellerName = sellerData.name;
          }
          this.menuType = 'seller';
        }
        else if(localStorage.getItem('user')){
            let userStore = localStorage.getItem('user');
            let userData = userStore && JSON.parse(userStore)[0];
            if(userData && userData.name){
              this.userName = userData.name;
            }
            this.menuType = 'user'
            this.service.getCartList(userData.id);
        }
         else {
          this.menuType = 'default';
        }
      }
    });

    this.service.getAllProduct().subscribe((result)=>{
      this.allProduct = result;
    })

    let cartData = localStorage.getItem('localCart');
    this.cartItems = cartData && JSON.parse(cartData).length;
    
    this.service.cartData.subscribe((items)=>{
      this.cartItems = items.length;
    })
  }
  sellerLogout(){
    localStorage.removeItem('seller');
    this.route.navigate(['/'])
  }
  userLogout(){
    localStorage.removeItem('user');
    this.route.navigate(['user-auth'])
    this.service.cartData.emit([]);
  }

  searchProduct(query:KeyboardEvent){
    const element = query.target as HTMLInputElement;
    if(this.allProduct){
      this.filterProduct = this.allProduct.filter(
        product => product.name.toLowerCase().includes(element.value)
      );
      if(this.filterProduct.length>5){
        this.filterProduct.length = 5;
      }
    }
  }

  hideSearch(){
    this.filterProduct = undefined;
  }

  searchInput(data:string){
    this.route.navigate([`search-product/${data}`])
    this.searchInputText.nativeElement.value=data;
  }

  redirectToProduct(id:string){
    this.route.navigate([`product-details/${id}`]);
  }
}
