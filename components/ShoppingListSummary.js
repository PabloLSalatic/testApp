"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export default function ShoppingListSummary() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch this data from an API or local storage
    // For now, we'll just set some dummy values
    setItems([
      { name: "Milk", checked: false },
      { name: "Bread", checked: true },
      { name: "Eggs", checked: false },
      { name: "Butter", checked: false },
      { name: "Cheese", checked: true },
    ]);
  }, []);

  const handleToggle = (index) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);
    // In a real application, you would also update this in your backend or local storage
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Shopping List</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`item-${index}`}
                checked={item.checked}
                onCheckedChange={() => handleToggle(index)}
              />
              <Label
                htmlFor={`item-${index}`}
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
