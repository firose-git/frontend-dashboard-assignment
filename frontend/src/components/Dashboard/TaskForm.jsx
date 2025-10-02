import { useState } from 'react';
import { createTask, updateTask } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import { X } from 'lucide-react';

const TaskForm = ({ onTaskCreated, onTaskUpdated, editingTask, setShowForm }) => {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [priority, setPriority] = useState(editingTask?.priority || 'medium');
  const [status, setStatus] = useState(editingTask?.status || 'not-started');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    const taskData = { title, description, priority, status };
    
    try {
      if (editingTask) {
        const updatedTask = await updateTask(editingTask._id, taskData);
        onTaskUpdated(updatedTask);
      } else {
        const newTask = await createTask(taskData);
        onTaskCreated(newTask);
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('not-started');
      setShowForm(false);
    } catch (err) {
      console.error('Task form error:', err);
      alert('Failed to save task.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 mb-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h3>
        <button
          onClick={() => setShowForm(false)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`input-custom w-full ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter task title..."
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`input-custom w-full ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Enter task description..."
            rows="3"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-white-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input-custom w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-white-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-custom w-full"
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="small" /> : (editingTask ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
