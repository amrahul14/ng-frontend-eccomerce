import { Component, OnDestroy, OnInit } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css']
})
export class SearchProductComponent implements OnInit, OnDestroy{
  messageForNotFound:string = "";
  constructor(private service:ProductService,private activeRoute:ActivatedRoute,private route:Router){}
  routeSubscription:Subscription|undefined;
    allProduct:product[]|undefined;
    filterProduct:product[]|undefined;
  ngOnInit(): void {
    this.service.getAllProduct().subscribe((result)=>{
      this.allProduct = result;
      let inputString = this.activeRoute.snapshot.paramMap.get('query');
      let ips = inputString?inputString:'!';
      if (this.allProduct ) {
          this.filterProduct = this.allProduct.filter(
            product => product.name.toLowerCase().includes(ips)
            );
          } 
          this.routeSubscription = this.activeRoute.params.subscribe(params => {
            if (this.allProduct ) {
            this.filterProduct = this.allProduct.filter(
              product => product.name.toLowerCase().includes(params['query'])
              );
              if(this.filterProduct.length==0){
                  this.messageForNotFound = "No Product found for this search";
              }else{
                this.messageForNotFound = ""
              }
            }
          }
          )
    });
  }

ngOnDestroy(): void {
  if (this.routeSubscription) {
    this.routeSubscription.unsubscribe();
  }
}

}
