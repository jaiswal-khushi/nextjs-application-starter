"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Customer, Transaction } from '@/types';

interface BankContextType {
  currentUser: User | null;
  users: User[];
  customers: Customer[];
  transactions: Transaction[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: number) => void;
  findCustomerByAccount: (accountNo: string) => Customer | undefined;
  transferMoney: (fromAccount: string, toAccount: string, amount: number) => boolean;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

const initialUsers: User[] = [
  { id: 1, name: "Admin", username: "admin", password: "admin123" },
  { id: 2, name: "Parth", username: "parth06", password: "pass123" },
  { id: 3, name: "Shivam", username: "shivam28", password: "pass456" },
  { id: 4, name: "Pranav", username: "pranav10", password: "pass789" }
];

const initialCustomers: Customer[] = [
  {
    id: 1,
    firstName: "rohit",
    lastName: "sharma",
    street: "rsc",
    city: "mumbai",
    branch: "Borivali",
    phone: "7715691343",
    accountNo: "1001",
    balance: 50000
  },
  {
    id: 2,
    firstName: "virat",
    lastName: "kohli",
    street: "mg",
    city: "mumbai",
    branch: "Kandivali",
    phone: "9867078312",
    accountNo: "1002",
    balance: 75000
  },
  {
    id: 3,
    firstName: "arya",
    lastName: "bose",
    street: "station",
    city: "mumbai",
    branch: "Andheri",
    phone: "8562786171",
    accountNo: "1003",
    balance: 25000
  }
];

export function BankProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Math.max(...users.map(u => u.id)) + 1
    };
    setUsers([...users, newUser]);
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const findCustomerByAccount = (accountNo: string): Customer | undefined => {
    return customers.find(c => c.accountNo === accountNo);
  };

  const transferMoney = (fromAccount: string, toAccount: string, amount: number): boolean => {
    const fromCustomer = customers.find(c => c.accountNo === fromAccount);
    const toCustomer = customers.find(c => c.accountNo === toAccount);

    if (!fromCustomer || !toCustomer || fromCustomer.balance < amount) {
      return false;
    }

    setCustomers(prev => prev.map(c => {
      if (c.accountNo === fromAccount) {
        return { ...c, balance: c.balance - amount };
      }
      if (c.accountNo === toAccount) {
        return { ...c, balance: c.balance + amount };
      }
      return c;
    }));

    const newTransaction: Transaction = {
      id: transactions.length + 1,
      fromAccount,
      toAccount,
      amount,
      date: new Date()
    };
    setTransactions([...transactions, newTransaction]);

    return true;
  };

  return (
    <BankContext.Provider value={{
      currentUser,
      users,
      customers,
      transactions,
      login,
      logout,
      addUser,
      deleteUser,
      findCustomerByAccount,
      transferMoney
    }}>
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const context = useContext(BankContext);
  if (context === undefined) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
}
