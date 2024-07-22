"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { database } from "../firebase";
import { ref, set, push, onValue, get } from "firebase/database";

export default function EnhancedExpenseTracker() {
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [budget, setBudget] = useState({});
  const [accounts, setAccounts] = useState({});
  const [selectedAccount, setSelectedAccount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [newAccountName, setNewAccountName] = useState("");
  const [isDivided, setIsDivided] = useState(false);

  useEffect(() => {
    const budgetRef = ref(database, "budget");
    onValue(budgetRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setBudget(data);
    });

    const accountsRef = ref(database, "accounts");
    onValue(accountsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setAccounts(data);
    });

    const transactionsRef = ref(database, "transactions");
    onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setTransactions(Object.values(data));
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && selectedAccount) {
      const transactionAmount = parseFloat(amount);

      const transactionsRef = ref(database, "transactions");
      push(transactionsRef, {
        amount: transactionAmount,
        type: transactionType,
        category,
        date,
        account: selectedAccount,
        isDivided,
      });

      const accountRef = ref(database, `accounts/${selectedAccount}`);
      get(accountRef).then((snapshot) => {
        const account = snapshot.val();
        if (account) {
          set(accountRef, {
            ...account,
            balance:
              account.balance +
              (transactionType === "income"
                ? transactionAmount
                : -transactionAmount),
          });
        }
      });

      if (category) {
        const budgetRef = ref(database, `budget/${category}`);
        get(budgetRef).then((snapshot) => {
          const categoryBudget = snapshot.val() || { limit: 0, spent: 0 };
          set(budgetRef, {
            ...categoryBudget,
            spent:
              categoryBudget.spent +
              (transactionType === "expense" ? transactionAmount : 0),
          });
        });
      }

      setAmount("");
      setCategory("");
      setIsDivided(false);
    }
  };

  const handleAddAccount = () => {
    if (newAccountName.trim()) {
      const accountsRef = ref(database, "accounts");
      push(accountsRef, {
        name: newAccountName.trim(),
        balance: 0,
      });
      setNewAccountName("");
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "all"
        ? true
        : transaction.category === filterCategory),
  );

  return (
    <div className="space-y-8">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select onValueChange={setTransactionType} defaultValue="expense">
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Account</Label>
              <Select onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(accounts).map(([id, account]) => (
                    <SelectItem key={id} value={id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {transactionType === "expense" && (
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  onClick={() => setIsDivided(!isDivided)}
                  variant={isDivided ? "default" : "outline"}
                >
                  {isDivided ? "Divided" : "Divide?"}
                </Button>
              </div>
            )}
            <Button type="submit" className="w-full">
              Add Transaction
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Manage Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="New account name"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
              />
              <Button onClick={handleAddAccount}>Add Account</Button>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Existing Accounts</h3>
              <ul>
                {Object.entries(accounts).map(([id, account]) => (
                  <li key={id} className="flex justify-between">
                    <span>{account.name}</span>
                    <span>${account.balance.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {Object.entries(budget).map(([category, { limit, spent }]) => (
              <li key={category} className="flex justify-between">
                <span>{category}</span>
                <span>
                  ${spent.toFixed(2)} / ${limit.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Search transactions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select onValueChange={setFilterCategory} defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Array.from(new Set(transactions.map((t) => t.category))).map(
                    (category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <ul className="space-y-2">
              {filteredTransactions.map((transaction, index) => (
                <li key={index} className="flex justify-between">
                  <span>{transaction.category}</span>
                  <span>${transaction.amount.toFixed(2)}</span>
                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                  <span>{transaction.isDivided ? "Divided" : ""}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
