import { useState } from 'react';
import { deleteTask, updateTask } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Trash2, Edit3, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const priorityClasses = {
    'high': 'priority-high',
    'medium': 'priority-medium',
    'low': 'priority-low',
  };
  
  const statusClasses = {
    'completed': 'status-completed',
    'in-progress': 'status-in-progress',
    'not-started': 'status-not-started',
  };
  
  const statusIcons = {
    'completed': <CheckCircle size={16} />,
    'in-progress': <Clock size={16} />,
    'not-started': <AlertCircle size={16} />,
  };
  
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await deleteTask(task._id);
        onDelete(task._id);
      } catch (err) {
        console.error('Delete task error:', err);
        alert('Failed to delete task.');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      const updatedTask = await updateTask(task._id, { ...task, status: newStatus });
      window.location.reload(); // Simple reload to reflect changes
    } catch (err) {
      console.error('Update status error:', err);
      alert('Failed to update task status.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="task-card card-3d group">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
            {task.title}
          </h3>
          <p className="text-gray-600 mt-1 line-clamp-2">{task.description}</p>
          
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className={`text-xs px-3 py-1 rounded-full ${priorityClasses[task.priority]}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>
            
            <div className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full ${statusClasses[task.status]}`}>
              {statusIcons[task.status]}
              <span>{task.status.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onEdit}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300 transform hover:scale-110"
            title="Edit Task"
          >
            <Edit3 size={18} />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 transform hover:scale-110"
            disabled={isDeleting}
            title="Delete Task"
          >
            {isDeleting ? <LoadingSpinner size="small" /> : <Trash2 size={18} />}
          </button>
        </div>
      </div>
      
      {task.status !== 'completed' && (
  <div className="mt-4 pt-4 border-t border-gray-100">
    <select
      value={task.status}
      onChange={(e) => handleStatusChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900"
      disabled={isUpdating}
    >
      <option value="not-started">Not Started</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>
  </div>
)}

    </div>
  );
};

export default TaskCard;
