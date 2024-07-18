import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  cartData = new EventEmitter<product[] | []>();

  constructor(private http: HttpClient) { }

  addProduct(data: product) {
    return this.http.post('http://localhost:3000/product', data)
  }

  productList() {
    return this.http.get<product[]>('http://localhost:3000/product');
  }

  deleteProduct(id: string) {
    return this.http.delete(`http://localhost:3000/product/${id}`)
  }

  getProduct(id: string) {
    return this.http.get<product>(`http://localhost:3000/product/${id}`);
  }

  updateProduct(id: string | null, data: product) {
    return this.http.put(`http://localhost:3000/product/${id}`, data)
  }

  popularProducts() {
    return this.http.get<product[]>('http://localhost:3000/product?_limit=3');
  }

  trendyProducts() {
    return this.http.get<product[]>('http://localhost:3000/product?_limit=8');
  }

  getAllProduct() {
    return this.http.get<product[]>(`http://localhost:3000/product`)
  }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');

    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data])
    }
    else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
    }
    this.cartData.emit(cartData);
  }
  localRemoveToCart(productId: string) {
    let localCart = localStorage.getItem('localCart');
    if (localCart) {
      let cartData: product[] = JSON.parse(localCart);
      cartData = cartData.filter((item: product) => item.id !== productId);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }
  addToCart(data: cart) {
    return this.http.post('http://localhost:3000/cart', data);
  }

  getCartList(userId: string) {
    return this.http.get<product[]>('http://localhost:3000/cart?userId=' + userId,
      { observe: 'response' }).subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      })
  }

  removeFromCart(cartId: string) {
    return this.http.delete('http://localhost:3000/cart/' + cartId);
  }

  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore)[0];
    let userId = userData.id;
    return this.http.get<cart[]>('http://localhost:3000/cart?userId=' + userId)
  }

  orderNow(order:order){
    return this.http.post('http://localhost:3000/orders', order)
  }
  
  orderDetail(){
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore)[0];
    let userId = userData.id;
    return this.http.get<order[]>('http://localhost:3000/orders?userId=' + userId);
  }

  deleteCartItems(cartId: string) {
    return this.http.delete('http://localhost:3000/cart/' + cartId).subscribe((result) => {
      this.cartData.emit([]);
    })
  }
  cancelOrder(orderId:string){
    return this.http.delete('http://localhost:3000/orders/' + orderId)
  }
}
