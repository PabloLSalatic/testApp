"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export default function ExpenseTrackerSummary() {
  const [amountOwed, setAmountOwed] = useState(0);

  useEffect(() => {
    // In a real application, you would fetch this data from an API or local storage
    // For now, we'll just set a dummy value
    setAmountOwed(50.75);
  }, []);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-xl">Amount owed per person:</p>
          <p className="text-3xl font-bold">${amountOwed.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
