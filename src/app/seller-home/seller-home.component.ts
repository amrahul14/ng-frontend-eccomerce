import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
  // imports:[FontAwesomeModule]
})
export class SellerHomeComponent implements OnInit {
  
  constructor(private productService:ProductService){}
  productList: undefined|product[];
  productMessage:undefined|string;

  faDelete = faTrash;
  faUpdate = faPenToSquare
  ngOnInit(): void {
    this.list();
  }

  deleteProduct(id:string){
    this.productService.deleteProduct(id).subscribe((result)=>{
        if(result){
          this.productMessage = "Product is deleted successfully";
          this.list();
        }
    })

    setTimeout(() => {
      this.productMessage=undefined;
    }, 3000);
  }

  list(){
    this.productService.productList().subscribe((result)=>{
      this.productList = result;
  })
  }
}
