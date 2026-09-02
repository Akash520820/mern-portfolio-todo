import { AnimatePresence, motion } from 'framer-motion';
import TodoItem from './TodoItem';
import { fadeIn } from '../../utils/motion';

const TodoList = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return (
      <motion.div className="todo-empty" initial="hidden" animate="visible" variants={fadeIn}>
        <p className="todo-empty__glyph">{'{ }'}</p>
        <p>No todos yet — add your first one above.</p>
      </motion.div>
    );
  }

  return (
    <div className="todo-list">
      <AnimatePresence initial={false}>
        {todos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TodoList;
