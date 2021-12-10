import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import TodoInput from "./TodoInput";
import TodoItem from "./TodoItem";

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [limitNo, setLimit] = useState(3);

  const addTask = async (task) => {
    const payload = {
      title: task,
      status: false
    };
    console.log(task);
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    };
    try {
      const res = await fetch(
        `https://json-server-mocker-kittu.herokuapp.com/tasks`,
        config
      );
      return await res.json();
    } catch (err) {
      setError(true);
    }
  };

  const getTasks = () => {
    return fetch(
      `https://json-server-mocker-kittu.herokuapp.com/tasks?_limit=${limitNo}&_page=${pageNo}`
    );
  };

  const handleAdd = (todo) => {
    setLoading(true);
    addTask(todo);
    setLoading(false);
    console.log(tasks);
  };

  const changePage = (num) => {
    setPageNo(num);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    let res = await fetch(
      `https://json-server-mocker-kittu.herokuapp.com/tasks/${id}`,
      {
        method: "DELETE"
      }
    );
    await res.json().then((res) => console.log(res));
    getTasks()
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setTasks(res);
      });
    setLoading(false);
  };

  const handleToggle = async (id, Status) => {
    setLoading(true);
    console.log(id);
    let res = await fetch(
      `https://json-server-mocker-kittu.herokuapp.com/tasks/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: !Status
        })
      }
    );
    await res.json().then((res) => console.log(res));
    getTasks()
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setTasks(res);
      });
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getTasks()
      .then((res) => res.json())
      .then((res) => {
        setTasks(res);
        setLoading(false);
      })
      .catch((err) => setError(true));
  }, [pageNo]);

  if (loading) {
    return <h1>Loading.....</h1>;
  }

  if (error) {
    return <h1>Sorry something went wrong</h1>;
  }

  return (
    <div>
      <h1>Todo App</h1>
      <TodoInput onAdd={handleAdd} />
      {tasks.map((item) => {
        return (
          <TodoItem
            key={item.id}
            id={item.id}
            Title={item.title}
            Status={item.status}
            handleDelete={handleDelete}
            handleToggle={handleToggle}
          />
        );
      })}
      <Pagination currentPage={pageNo} handlePage={changePage} />
    </div>
  );
}
export default Todo;
