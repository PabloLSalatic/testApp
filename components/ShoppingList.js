"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { database } from "../firebase";
import { ref, onValue, push, update, remove } from "firebase/database";

export default function ShoppingList() {
  const [item, setItem] = useState("");
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
      } else {
        setItems([]);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (item.trim()) {
      const itemsRef = ref(database, "shoppingList");
      push(itemsRef, {
        name: item.trim(),
        checked: false,
      });
      setItem("");
    }
  };

  const handleToggle = (id) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const updates = {};
      updates[`/shoppingList/${id}/checked`] = !item.checked;
      update(ref(database), updates);
    }
  };

  const handleDelete = (id) => {
    remove(ref(database, `shoppingList/${id}`));
  };

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
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
