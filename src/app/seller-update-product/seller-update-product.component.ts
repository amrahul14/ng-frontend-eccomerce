import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit{
  gotProduct:product|undefined;

  ngOnInit(): void {
    let pId= this.route.snapshot.paramMap.get('id');
    if(pId!==null)
    this.productService.getProduct(pId).subscribe((result)=>{
      this.gotProduct = result;
  })
  }
  updateProductMessage:string|undefined;
  constructor(private productService:ProductService,private route:ActivatedRoute){
  }
  
  submit(product:product) {
    let productId = this.route.snapshot.paramMap.get('id');
  this.productService.updateProduct(productId,product).subscribe((result)=>{
    this.updateProductMessage = "Product is successfully updated";
    setTimeout(() => {
      this.updateProductMessage = undefined;
    }, 3000);
  });
}


 

}
