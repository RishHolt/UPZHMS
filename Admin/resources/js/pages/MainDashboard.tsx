import Header from '../components/Header';
import { LayoutDashboard, Users, FileText, MapPin } from 'lucide-react';

const MainDashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '12',
      icon: Users,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Active Applications',
      value: '8',
      icon: FileText,
      color: 'bg-green-500',
      change: '+1 this week'
    },
    {
      title: 'Zoning Clearances',
      value: '24',
      icon: MapPin,
      color: 'bg-purple-500',
      change: '+3 this month'
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: LayoutDashboard,
      color: 'bg-orange-500',
      change: 'All systems operational'
    }
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Dashboard"
        subtext="Welcome to the Urban Planning, Zoning & Housing Management System"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">New Application</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Manage Users</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">View Map</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;