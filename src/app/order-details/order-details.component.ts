import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { order } from '../data-type';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit{

  orderData:order[]|undefined ;
  constructor(private productService:ProductService){}

  ngOnInit(): void {
    this.getOrderList()
  }
  cancelOrder(orderId:string|undefined){
    orderId && this.productService.cancelOrder(orderId).subscribe((result)=>{
      if(result){
        this.getOrderList()
      }
    });
  }
  getOrderList(){
    this.productService.orderDetail().subscribe((result)=>{
      this.orderData = result;
    })
  }
}
