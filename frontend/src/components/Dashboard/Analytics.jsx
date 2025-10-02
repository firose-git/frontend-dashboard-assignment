import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Analytics = ({ stats }) => {
  const { user } = useAuth();
  
  if (!stats) return null;
  
  const statusData = [
    { name: 'Not Started', value: stats.tasks_by_status['not-started'], color: '#9CA3AF' },
    { name: 'In Progress', value: stats.tasks_by_status['in-progress'], color: '#A78BFA' },
    { name: 'Completed', value: stats.tasks_by_status.completed, color: '#60A5FA' }
  ];
  
  const priorityData = [
    { name: 'Low', value: stats.tasks_by_priority.low, color: '#34D399' },
    { name: 'Medium', value: stats.tasks_by_priority.medium, color: '#FCD34D' },
    { name: 'High', value: stats.tasks_by_priority.high, color: '#F87171' }
  ];
  
  const getIcon = (type) => {
    switch(type) {
      case 'completed': return <CheckCircle className="text-blue-500" size={24} />;
      case 'in-progress': return <Clock className="text-purple-500" size={24} />;
      case 'not-started': return <AlertCircle className="text-gray-500" size={24} />;
      default: return <TrendingUp className="text-indigo-500" size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <div className="glass-card p-6 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
        <p className="text-sm text-indigo-600 mt-1">{user?.email}</p>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-3xl font-bold heading-gradient">{stats.total_tasks}</div>
          <div className="text-sm text-indigo-600">Total Tasks</div>
        </div>
      </div>
      
      {/* Completion Rate */}
      <div className="neumorph-card p-6">
        <h3 className="text-lg font-semibold text-indigo-600 mb-4">
  Completion Rate
</h3>

        <div className="relative">
          <div className="text-4xl font-bold text-center heading-gradient">
            {stats.completion_rate.toFixed(1)}%
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000"
              style={{ width: `${stats.completion_rate}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Status Overview */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Overview</h3>
        <div className="space-y-3">
          {Object.entries(stats.tasks_by_status).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                {getIcon(status)}
                <span className="text-sm font-medium text-gray-700">
                  {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </div>
              <span className="text-lg font-bold text-gray-800">{count}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Priority Distribution */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Priority Distribution</h3>
        {stats.total_tasks > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
