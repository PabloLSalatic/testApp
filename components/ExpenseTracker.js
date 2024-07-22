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
  const [people, setPeople] = useState({});
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const peopleRef = ref(database, "people");
    onValue(peopleRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPeople(data);
      } else {
        setPeople({});
      }
    });

    const expensesRef = ref(database, "expenses");
    onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setExpenses(Object.values(data));
      } else {
        setExpenses([]);
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
      selectedPeople.forEach((personId) => {
        const personRef = ref(database, `people/${personId}`);
        get(personRef).then((snapshot) => {
          const person = snapshot.val();
          if (person) {
            set(personRef, {
              ...person,
              amountOwed: (person.amountOwed || 0) + splitAmount,
            });
          }
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
                  {Object.entries(people).map(([id, person]) => (
                    <SelectItem key={id} value={id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPeople.map((personId) => (
                <div key={personId} className="flex items-center space-x-2">
                  <span>{people[personId]?.name}</span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setSelectedPeople((prev) =>
                        prev.filter((id) => id !== personId),
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
            {Object.entries(people)
              .filter(([_, person]) => person.amountOwed > 0)
              .map(([id, person]) => (
                <li key={id} className="flex justify-between">
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
