import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Product } from './Models/Product';
import { ProductList } from './myComponents/product-list/product-list';
import { ProductFilterPipe } from './Pipes/productFilterPipe';
import { CommonModule } from '@angular/common';
import { CartItem } from './Models/CartItem';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ProductFilterPipe, ProductList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('emitterProductLab');

  //Ürün listemiz

  products = signal<Product[]>([
    { id: 1, name: 'Mouse', price: 210 },
    { id: 2, name: 'Uzay gemisi', price: 400 },
    { id: 3, name: 'Klavye', price: 3200 },
    { id: 4, name: 'Meta VR', price: 18000 },
  ]);

  //filtre input state'lerimiz
  searchText = signal<string>('');
  maxPrice = signal<number | null>(null);

  //child'dan gelecek secili ürün id'si

  selectedProductId = signal<number | null>(null);

  selectedProduct = computed(() => {
    const id = this.selectedProductId();
    if (id == null) return null;
    return this.products().find((p) => p.id === id) ?? null;
  });

  //Child component event handler
  onChildSelected(productId: number) {
    this.selectedProductId.set(productId);
  }

  //Refactor ödevi NgModel'e ceviriniz
  //Input eventlerinden ngmodel olmadıgı icin ayrı bir signal güncellemesi
  onSearchInput(e: Event) {
    this.searchText.set((e.target as HTMLInputElement).value);
  }

  onMaxPriceInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value.trim();
    this.maxPrice.set(raw === '' ? null : Number(raw));
  }

  //Ödev custom pipe dısında düz filtreleme...

  //Todo Sepet işlemleri :

  cart = signal<CartItem[]>([]);

  //Child => Parent

  onAddToCart(product: Product) {
    this.cart.update((items) => {
      const existing = items.find((x) => x.product.id === product.id);
      if (!existing) {
        return [...items, { product, quantity: 1 }];
      }

      return items.map((x) =>
        x.product.id === product.id ? { ...x, quantity: x.quantity + 1 } : x
      );
    });
  }

  //Toplamı otomatik hesaplama

  cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  });

  removeFromCart(productId: number) {
    this.cart.update((items) => {
      const item = items.find((x) => x.product.id === productId);
      if (!item) return items;

      //quantity sadece 1 ise komple satırı kaldıralım
      if (item.quantity <= 1) {
        return items.filter((x) => x.product.id !== productId);
      }

      //Quantity azaltma durumu
      return items.map((x) =>
        x.product.id === productId ? { ...x, quantity: x.quantity - 1 } : x
      );
    });
  }
}
