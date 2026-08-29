import { useEffect, useState } from 'react';
import TodoForm from '../components/Todo/TodoForm';
import TodoList from '../components/Todo/TodoList';
import api from '../services/api';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    try {
      const { data } = await api.get('/todos');
      setTodos(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (todoData) => {
    const { data } = await api.post('/todos', todoData);
    setTodos((prev) => [data, ...prev]);
  };

  const handleToggle = async (todo) => {
    const { data } = await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
    setTodos((prev) => prev.map((t) => (t._id === data._id ? data : t)));
  };

  const handleDelete = async (id) => {
    await api.delete(`/todos/${id}`);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  const doneCount = todos.filter((t) => t.completed).length;

  return (
    <div className="todo-page">
      <div className="todo-page__inner">
        <p className="eyebrow">{'{todos}'}</p>
        <div className="todo-page__header">
          <h2>My Todos</h2>
          {todos.length > 0 && (
            <span className="badge-chip badge-chip--accent">
              {doneCount}/{todos.length} done
            </span>
          )}
        </div>

        {error && <div className="auth-card__error">{error}</div>}

        <TodoForm onAdd={handleAdd} />

        {loading ? (
          <div className="todo-page__loading">Loading…</div>
        ) : (
          <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default TodoApp;
