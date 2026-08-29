const priorityClass = {
  low: 'badge-chip--accent',
  medium: 'badge-chip--warn',
  high: 'todo-item__priority--high',
};

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className={`card todo-item ${todo.completed ? 'is-done' : ''}`}>
      <button
        type="button"
        className={`todo-item__check ${todo.completed ? 'is-checked' : ''}`}
        onClick={() => onToggle(todo)}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && '✓'}
      </button>

      <div className="todo-item__body">
        <p className="todo-item__title">{todo.title}</p>
        {todo.description && <p className="todo-item__desc">{todo.description}</p>}
        {todo.dueDate && (
          <p className="todo-item__due">Due {new Date(todo.dueDate).toLocaleDateString()}</p>
        )}
      </div>

      <div className="todo-item__meta">
        <span className={`badge-chip ${priorityClass[todo.priority]}`}>{todo.priority}</span>
        <button type="button" className="todo-item__delete" onClick={() => onDelete(todo._id)} aria-label="Delete todo">
          ✕
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
