import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Product } from '../../Models/Product';

/*
      Child Component 

      Parent'tan gelen ürün listesini göstermek 
      Kullanıcı oradan(child'dan) bir ürünü secince , secilen ürünün id'sini Parent'a geir göndermek

      EventEmitter nedir

      Parent => Child'a veri verir : @Input

      Child => "Parent benden bir şey secildi" diye event üretir @Output

      EventEmitter<T>   
      Child'in, parant component'a "bende bir event gerçekleşti sana veri gönderiyorum" demesidir...

      emit(value) su demektir : 
      "Bak bu deger dısarı yayınlanıyor dinleyen bir gözlemci varsa yakalasın"

      (selected) = "onChildSelected($event)"

      $event => child'in emit() ettigi deger



*/

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  //@Input Parent => child veri akışı
  @Input() products: Product[] = [];

  //Output + EventEmitter
  //Child => Parent'a veri akısı
  //Child icinde bir event yayınlamak icin (emit etmek) kullanılır...Parent bu event'i template'inde dinler ...Bunun icin output keyword'uyla işaretlenmiş EventEmitter degişkeni kullanır...

  @Output() selected = new EventEmitter<number>();

  selectProduct(productId: number) {
    this.selected.emit(productId);
  }

  //todo : Sepet işlemleri

  //Kartın secimini tetikleyen bir click düzenlenecek

  //Butona tıklayına kartın(click) event'i de tetiklenmesin diye event yapısını elde edip event propagation durduracagız

  @Output() addToCart = new EventEmitter<Product>();

  addProductToCart(product: Product, e: Event) {
    e.stopPropagation(); //kartın click event'ini engeller
    this.addToCart.emit(product); //Parent'a ürünü gönderelim
  }
}
