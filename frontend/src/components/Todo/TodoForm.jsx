import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, buttonBounce } from '../../utils/motion';

const TodoForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onAdd({ title, description, priority, dueDate: dueDate || undefined });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="card todo-form"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <input
        type="text"
        className="todo-form__title"
        placeholder="What needs doing?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="todo-form__row">
        <input
          type="text"
          className="todo-form__desc"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select className="todo-form__select" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          className="todo-form__date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <motion.button type="submit" className="btn-glow todo-form__submit" disabled={submitting} {...buttonBounce}>
          Add
        </motion.button>
      </div>
    </motion.form>
  );
};

export default TodoForm;
