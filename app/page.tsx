"use client";

import { useState } from "react";
import useSWR from "swr";
import Todo from "./components/Todo";
import { API_URL } from "@/constants/url";
import { mutate } from "swr";

async function fetcher(key: string) {
  return fetch(key).then((res) => res.json() as Promise<TodoType[] | null>);
}

export default function Home() {
  const { data, isLoading, error } = useSWR(API_URL + "/allTodos", fetcher);
  const [title, setTitle] = useState<string>("");

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/createTodo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, isCompleted: false }),
    });

    if (response.ok) {
      const newTodo = await response.json();
      mutate(
        `${API_URL}/allTodos`,
        async (currentTodos: TodoType[] = []) => [newTodo, ...currentTodos],
        false
      );
      setTitle(""); // Reset input after adding
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-32 py-4 px-4">
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">
          To-Do List
        </h1>
      </div>
      <form
        className="w-full max-w-sm mx-auto px-4 py-2"
        onSubmit={(e: React.FormEvent) => addTodo(e)}
      >
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Add a task"
            value={title}
          />
          <button
            className="duration-150 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
      <ul className="divide-y divide-gray-200 px-4">
        {data?.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
