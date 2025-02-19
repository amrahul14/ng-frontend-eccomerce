import { Component, OnInit } from '@angular/core';
import { cart, order } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  totalPrice: number | undefined;
  cartData: cart[] | undefined;
  constructor(private productService:ProductService, private router:Router){}
  ngOnInit(): void {
    this.productService.currentCart().subscribe((result) => {

      let price = 0;
      this.cartData = result;
      result.forEach((item) => {
        if (item.quantity) {
          price = price + parseFloat(item.price.toString())*item.quantity;
        }
      })
      this.totalPrice = price + (price / 10) + 100 - (price / 10);

    })

  }

  orderNow(data: { email: string, address: string, contact: string }) {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore)[0];
    let userId = userData.id;
    if(this.totalPrice){
      if (this.totalPrice) {
        let orderData: order = {
          ...data,
          totalPrice: this.totalPrice,
          userId,
          id: undefined
        }

        this.cartData?.forEach((item) => {
         item.id && this.productService.deleteCartItems(item.id)
        });

        this.productService.orderNow(orderData).subscribe((result)=>{
          if(result){
            this.router.navigate(['order-details'])
             alert('the order has been placed')
          }
        })
    }
  }
}
}
