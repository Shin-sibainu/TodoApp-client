import { API_URL } from "@/constants/url";
import React from "react";
import { mutate } from "swr";
import useSWR from "swr";

type TodoProps = {
  todo: TodoType;
};

const Todo = ({ todo }: TodoProps) => {
  const { data: todos } = useSWR(`${API_URL}/allTodos`); // todosデータを取得

  const toggleTodoCompletion = async (id: number, isCompleted: boolean) => {
    const response = await fetch(`${API_URL}/editTodo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !isCompleted }),
    });
    if (response.ok && todos) {
      // todosが存在することを確認
      const updatedTodos = todos.map((todo: TodoType) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      mutate(`${API_URL}/allTodos`, updatedTodos, false); // 更新されたtodosをキャッシュにセット
    }
  };

  const deleteTodo = async (id: number) => {
    const response = await fetch(`${API_URL}/deleteTodo/${id}`, {
      method: "DELETE", // DELETEメソッドを使用
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok && todos) {
      const updatedTodos = todos.filter((todo: TodoType) => todo.id !== id);
      mutate(`${API_URL}/allTodos`, updatedTodos, false); // 更新されたtodosをキャッシュにセット
    }
  };

  return (
    <div>
      <li className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="todo1"
              name="todo1"
              type="checkbox"
              checked={todo.isCompleted}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500
                  border-gray-300 rounded"
              onChange={() => toggleTodoCompletion(todo.id, todo.isCompleted)}
            />
            <label className="ml-3 block text-gray-900">
              <span
                className={`text-lg font-medium mr-2 ${
                  todo.isCompleted ? "line-through" : ""
                }`}
              >
                {todo.title}
              </span>
            </label>
          </div>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded"
            onClick={() => deleteTodo(todo.id)}
          >
            ✖
          </button>
        </div>
      </li>
    </div>
  );
};

export default Todo;
