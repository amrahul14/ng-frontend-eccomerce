import { Component, OnInit } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  popularProducts:product[]|undefined;
  trendyProducts:product[]|undefined;
  allProduct:product[]|undefined;
  filterProduct:product[]|undefined;
  
  constructor(private service:ProductService){}
  ngOnInit(): void {
    this.service.popularProducts().subscribe((result)=>{
      this.popularProducts = result;
    })

    this.service.trendyProducts().subscribe((result)=>{
     this.trendyProducts = result;
    })

    
  }

  
}
