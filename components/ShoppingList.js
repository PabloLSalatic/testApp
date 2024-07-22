"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

export default function ShoppingList({ limitItems = null }) {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (item.trim()) {
      setItems([...items, { name: item.trim(), checked: false }]);
      setItem("");
    }
  };

  const handleToggle = (index) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);
  };

  const displayItems = limitItems ? items.slice(0, limitItems) : items;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Shopping List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item">Add Item</Label>
            <Input
              id="item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Enter item to buy"
            />
          </div>
          <Button type="submit" className="w-full">
            Add Item
          </Button>
        </form>
        <ul className="mt-4 space-y-2">
          {displayItems.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`item-${index}`}
                checked={item.checked}
                onCheckedChange={() => handleToggle(index)}
              />
              <Label
                htmlFor={`item-${index}`}
                className={`flex-grow p-2 ${item.checked ? "line-through text-gray-500" : ""}`}
              >
                {item.name}
              </Label>
            </li>
          ))}
        </ul>
        {limitItems && items.length > limitItems && (
          <p className="mt-2 text-sm text-gray-500">
            {items.length - limitItems} more item(s) not shown
          </p>
        )}
      </CardContent>
    </Card>
  );
}
