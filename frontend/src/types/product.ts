export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    subCategory?: string;
    vendorId: string;
    vendorName: string;
    stock: number;
    isFeatured?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}
