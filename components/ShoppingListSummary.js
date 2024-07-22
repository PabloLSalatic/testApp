"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { database } from "../firebase";
import { ref, onValue, update } from "firebase/database";

export default function ShoppingListSummary() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, "shoppingList");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setItems(
          Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          })),
        );
      }
    });
  }, []);

  const handleToggle = (id) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const updates = {};
      updates[`/shoppingList/${id}/checked`] = !item.checked;
      update(ref(database), updates);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Shopping List</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={`item-${item.id}`}
                checked={item.checked}
                onCheckedChange={() => handleToggle(item.id)}
              />
              <Label
                htmlFor={`item-${item.id}`}
                className={`flex-grow ${item.checked ? "line-through text-gray-500" : ""}`}
              >
                {item.name}
              </Label>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
