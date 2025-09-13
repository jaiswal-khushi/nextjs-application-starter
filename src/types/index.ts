export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  branch: string;
  phone: string;
  accountNo: string;
  balance: number;
}

export interface Transaction {
  id: number;
  fromAccount: string;
  toAccount: string;
  amount: number;
  date: Date;
}
