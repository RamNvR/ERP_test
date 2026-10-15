export interface Company {
  name: string;
  contactName?: string;
  email: string;
  phone: string;
  country: string;
  website: string;
}

export interface Person {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Customer extends Person {
  companyName: string;
  country: string;
  address: string;
}

export interface ProductCategory {
  name: string;
  description: string;
  color: string;
  enabled: boolean;
}

export interface Product {
  name: string;
  category: string;
  price: number;
  description: string;
}

export interface Invoice {
  number: number;
  year: number;
  clientName: string;
  date: string;
  expireDate: string;
  itemName: string;
  itemDescription: string;
  quantity: number;
  price: number;
  note: string;
}

export interface Payment {
  number: number;
  clientName: string;
  amount: number;
  date: string;
  paymentModeName: string;
  reference: string;
  description: string;
}
