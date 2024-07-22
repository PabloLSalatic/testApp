"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";

export default function ExpenseTrackerSummary() {
  const [accounts, setAccounts] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgetOverview, setBudgetOverview] = useState({});
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const accountsRef = ref(database, "accounts");
    onValue(accountsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAccounts(data);
        const total = Object.values(data).reduce(
          (sum, account) => sum + account.balance,
          0,
        );
        setTotalBalance(total);
      } else {
        setAccounts({});
        setTotalBalance(0);
      }
    });

    const transactionsRef = ref(database, "transactions");
    onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sortedTransactions = Object.values(data)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setRecentTransactions(sortedTransactions);
      } else {
        setRecentTransactions([]);
      }
    });

    const budgetRef = ref(database, "budget");
    onValue(budgetRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBudgetOverview(data);
      } else {
        setBudgetOverview({});
      }
    });
  }, []);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Expense Tracker Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-xl">Total Balance:</p>
            <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Account Balances:</h3>
            <ul className="space-y-1">
              {Object.entries(accounts).map(([id, account]) => (
                <li key={id} className="flex justify-between">
                  <span>{account.name}</span>
                  <span>${account.balance.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Transactions:</h3>
            <ul className="space-y-1">
              {recentTransactions.map((transaction, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>{transaction.category}</span>
                  <span
                    className={
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    ${transaction.amount.toFixed(2)}
                  </span>
                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {/* <h3 className="text-lg font-semibold mb-2">Budget Overview:</h3> */}
            {/* <ul className="space-y-1"> */}
            {/*   {Object.entries(budgetOverview).map( */}
            {/*     ([category, { limit, spent }]) => ( */}
            {/*       <li key={category} className="flex justify-between text-sm"> */}
            {/*         <span>{category}</span> */}
            {/*         <span> */}
            {/*           {((spent / limit) * 100).toFixed(0)}% (${spent.toFixed(2)}{" "} */}
            {/*           / ${limit.toFixed(2)}) */}
            {/*         </span> */}
            {/*       </li> */}
            {/*     ), */}
            {/*   )} */}
            {/* </ul> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
