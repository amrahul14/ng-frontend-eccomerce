import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent {
  addProductMessage:string|undefined;
  constructor(private product:ProductService){}
submit(product:any) {
  this.product.addProduct(product).subscribe((result)=>{
    this.addProductMessage = "Product is successfully added";
    setTimeout(() => {
      this.addProductMessage = undefined;
    }, 3000);
  });
}

}
