import { useState, useEffect } from 'react';
import { getTasks, getTaskStats } from '../../services/api';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import Analytics from './Analytics';
import LoadingSpinner from '../Common/LoadingSpinner';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tasksData, statsData] = await Promise.all([
        getTasks(),
        getTaskStats()
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowForm(false);
    loadData(); // Reload stats
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
    setEditingTask(null);
    loadData(); // Reload stats
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
    loadData(); // Reload stats
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (isLoading) {
    return <div className="flex justify-center mt-20"><LoadingSpinner /></div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <button 
          onClick={loadData} 
          className="ml-4 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Main content */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">My Tasks</h1>
              
              <button
                onClick={() => { setShowForm(!showForm); setEditingTask(null); }}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                {showForm ? 'Cancel' : '+ Add Task'}
              </button>
            </div>
            
            {showForm && (
              <TaskForm
                onTaskCreated={handleTaskCreated}
                onTaskUpdated={handleTaskUpdated}
                editingTask={editingTask}
                setShowForm={setShowForm}
              />
            )}
            
            <div className="mb-6">
  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
    <div className="flex-grow">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900 placeholder-gray-500"
      />
    </div>

    <div className="flex space-x-2">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900"
      >
        <option value="all">All Statuses</option>
        <option value="not-started">Not Started</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900"
      >
        <option value="all">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  </div>
</div>

            
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No tasks found. Create your first task!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={() => handleEditTask(task)}
                    onDelete={handleTaskDeleted}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Analytics sidebar */}
        <div className="w-full md:w-1/3">
          <Analytics stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
