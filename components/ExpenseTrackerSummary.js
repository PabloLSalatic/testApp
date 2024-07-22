// components/ExpenseTrackerSummary.js
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";

export default function ExpenseTrackerSummary() {
  const [peopleOwed, setPeopleOwed] = useState([]);
  const [totalOwed, setTotalOwed] = useState(0);

  useEffect(() => {
    const peopleRef = ref(database, "people");
    onValue(peopleRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const peopleArray = Object.values(data).filter(
          (person) => person.amountOwed > 0,
        );
        setPeopleOwed(peopleArray);
        setTotalOwed(
          peopleArray.reduce((sum, person) => sum + person.amountOwed, 0),
        );
      } else {
        setPeopleOwed([]);
        setTotalOwed(0);
      }
    });
  }, []);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-xl">Total amount owed:</p>
            <p className="text-3xl font-bold">${totalOwed.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Breakdown:</h3>
            <ul className="space-y-1">
              {peopleOwed.map((person) => (
                <li key={person.name} className="flex justify-between">
                  <span>{person.name}</span>
                  <span>${person.amountOwed.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
