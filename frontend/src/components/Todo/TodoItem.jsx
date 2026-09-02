import { motion } from 'framer-motion';
import { buttonBounce } from '../../utils/motion';

const priorityClass = {
  low: 'badge-chip--accent',
  medium: 'badge-chip--warn',
  high: 'todo-item__priority--high',
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -24, scale: 0.96, transition: { duration: 0.2 } },
};

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -2 }}
      className={`card todo-item ${todo.completed ? 'is-done' : ''}`}
    >
      <motion.button
        type="button"
        className={`todo-item__check ${todo.completed ? 'is-checked' : ''}`}
        onClick={() => onToggle(todo)}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        whileTap={{ scale: 0.85 }}
      >
        {todo.completed && '✓'}
      </motion.button>

      <div className="todo-item__body">
        <p className="todo-item__title">{todo.title}</p>
        {todo.description && <p className="todo-item__desc">{todo.description}</p>}
        {todo.dueDate && (
          <p className="todo-item__due">Due {new Date(todo.dueDate).toLocaleDateString()}</p>
        )}
      </div>

      <div className="todo-item__meta">
        <span className={`badge-chip ${priorityClass[todo.priority]}`}>{todo.priority}</span>
        <motion.button
          type="button"
          className="todo-item__delete"
          onClick={() => onDelete(todo._id)}
          aria-label="Delete todo"
          {...buttonBounce}
        >
          ✕
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TodoItem;
