"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export default function ExpenseTracker({ showAmountOwed = false }) {
  const [amount, setAmount] = useState("");
  const [people, setPeople] = useState("");
  const [amountOwed, setAmountOwed] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const calculatedAmount = parseFloat(amount) / parseInt(people);
    setAmountOwed(calculatedAmount.toFixed(2));
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Expense Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount Spent</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="people">Number of People</Label>
            <Input
              id="people"
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              placeholder="Enter number of people"
            />
          </div>
          <Button type="submit" className="w-full">
            Calculate
          </Button>
        </form>
        {showAmountOwed && amountOwed > 0 && (
          <div className="mt-4 text-center">
            <p className="text-xl">Amount owed per person:</p>
            <p className="text-3xl font-bold">${amountOwed}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
