import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../Models/Product';

/*
   Custom pipe : productFiltreleme

   Pipe'in görevi : ürün listesini filtreleme

   searchText : ürün adı icinde gecen metin 
   maxPrice : maksimum fiyat (bossa veya  gecersizse uygulanmasın)



*/

@Pipe({
  name: 'productFilter',
  standalone: true,
  pure: true, //default zaten true...
})
export class ProductFilterPipe implements PipeTransform {
  transform(products: Product[], searchText: string, maxPrice: number | null): Product[] {
    if (!products) return [];

    const text = (searchText ?? '').trim().toLowerCase();

    return products.filter((p) => {
      const nameOk = text.length === 0 ? true : p.name.toLowerCase().includes(text);

      const priceOk = maxPrice === null || Number.isNaN(maxPrice) ? true : p.price <= maxPrice;

      return nameOk && priceOk;
    });
  }
}
