export interface Product {
  id: number;
  name: string;
  description?: string;
  eanCode: string;
  minimumQuantity: string;
  categoryId: number;
  subcategoryId: number;
  imagePath: string;
  price: number;
  warehouseId: number;
  quantity: number;
}
