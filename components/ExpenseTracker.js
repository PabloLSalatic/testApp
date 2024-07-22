// components/ExpenseTracker.js
"use client";

import { useState, useEffect } from "react";
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

export default function ExpenseTracker() {
  const [amount, setAmount] = useState("");
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [newPerson, setNewPerson] = useState("");
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const peopleRef = ref(database, "people");
    onValue(peopleRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPeople(Object.values(data));
      }
    });

    const expensesRef = ref(database, "expenses");
    onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setExpenses(Object.values(data));
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && selectedPeople.length > 0) {
      const expenseAmount = parseFloat(amount);
      const splitAmount = expenseAmount / selectedPeople.length;

      // Add the expense to the expenses list
      const expensesRef = ref(database, "expenses");
      push(expensesRef, {
        amount: expenseAmount,
        people: selectedPeople,
        date: new Date().toISOString(),
      });

      // Update owed amounts for each person
      selectedPeople.forEach((person) => {
        const personRef = ref(database, `people/${person}`);
        get(personRef).then((snapshot) => {
          const currentAmount = snapshot.val()?.amountOwed || 0;
          set(personRef, {
            name: person,
            amountOwed: currentAmount + splitAmount,
          });
        });
      });

      // Clear the form
      setAmount("");
      setSelectedPeople([]);
    }
  };

  const handleAddPerson = () => {
    if (newPerson.trim()) {
      const peopleRef = ref(database, "people");
      push(peopleRef, {
        name: newPerson.trim(),
        amountOwed: 0,
      });
      setNewPerson("");
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
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
              <Label htmlFor="people">Select People</Label>
              <Select
                onValueChange={(value) =>
                  setSelectedPeople((prev) => [...prev, value])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a person" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((person) => (
                    <SelectItem key={person.name} value={person.name}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPeople.map((person) => (
                <div key={person} className="flex items-center space-x-2">
                  <span>{person}</span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setSelectedPeople((prev) =>
                        prev.filter((p) => p !== person),
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPerson">Add New Person</Label>
              <div className="flex space-x-2">
                <Input
                  id="newPerson"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  placeholder="Enter name"
                />
                <Button type="button" onClick={handleAddPerson}>
                  Add
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Amount Owed</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {people
              .filter((person) => person.amountOwed > 0)
              .map((person) => (
                <li key={person.name} className="flex justify-between">
                  <span>{person.name}</span>
                  <span>${person.amountOwed.toFixed(2)}</span>
                </li>
              ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
