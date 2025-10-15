
import { useState, useEffect } from 'react';
import MainHeader from "../components/MainHeader";
import Button from "../components/Button";
import Input from "../components/Input";
import Table from "../components/Table";
import Modal from "../components/Modal";
import SearchInput from "../components/SearchInput";
import Swal from "../components/Swal";
import { api } from "../services/api";
import { Edit, Trash2, UserPlus, Eye, Shield, Mail, Calendar, Building } from 'lucide-react';

// Types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber?: string;
  role: 'IT_ADMIN' | 'ZONING_ADMIN' | 'ZONING_OFFICER' | 'BUILDING_ADMIN' | 'BUILDING_OFFICER';
  status: 'ACTIVE' | 'INACTIVE' | 'DISABLED';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Constants
const departments = [
  'IT Department',
  'Zoning Department',
  'Building Department',
  'Housing Department',
  'Infrastructure Department',
  'Occupancy Department',
  'Finance Department',
  'Legal Department'
];

const roles = [
  { value: 'IT_ADMIN', label: 'IT Administrator', color: 'red' },
  { value: 'ZONING_ADMIN', label: 'Zoning Administrator', color: 'blue' },
  { value: 'ZONING_OFFICER', label: 'Zoning Officer', color: 'blue' },
  { value: 'BUILDING_ADMIN', label: 'Building Administrator', color: 'green' },
  { value: 'BUILDING_OFFICER', label: 'Building Officer', color: 'green' }
];

const statuses = [
  { value: 'ACTIVE', label: 'Active', color: 'green' },
  { value: 'INACTIVE', label: 'Inactive', color: 'gray' },
  { value: 'DISABLED', label: 'Disabled', color: 'red' }
];

const permissions = [
  'read',
  'write',
  'delete',
  'admin',
  'export',
  'import',
  'approve',
  'reject'
];

// Generate role-based avatar
const generateRoleAvatar = (role: string, firstName: string, lastName: string) => {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  
  // Create SVG avatar based on role
  const roleColors = {
    admin: { bg: '#dc2626', text: '#ffffff' }, // Red
    staff: { bg: '#2563eb', text: '#ffffff' }, // Blue
    viewer: { bg: '#059669', text: '#ffffff' } // Green
  };
  
  const colors = roleColors[role as keyof typeof roleColors] || roleColors.staff;
  
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" fill="${colors.bg}" rx="20"/>
      <text x="20" y="26" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="${colors.text}">${initials}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Sort handler
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Pagination - Use server-side pagination data directly
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const currentUsers = filteredUsers; // API already returns paginated data

  // Load users from API
  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.users.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        role: selectedRole || undefined,
        status: selectedStatus || undefined,
        sortBy: sortConfig?.key || undefined,
        sortOrder: sortConfig?.direction || undefined
      });
      
      setUsers(response.users);
      setFilteredUsers(response.users);
      setTotalPages(response.pagination.pages);
      setTotalUsers(response.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load users on component mount and when filters change
  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, selectedRole, selectedStatus, sortConfig]);

  // Update filtered users when users data changes
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
  };

  const handleDepartmentFilter = (department: string) => {
    setSelectedDepartment(department);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      password: '',
      role: 'ZONING_OFFICER',
      status: 'ACTIVE'
    });
    setActiveModal('create');
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData(user);
    setActiveModal('edit');
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setActiveModal('view');
  };

  const handleDeleteUser = async (user: User) => {
    // Show confirmation dialog
    const result = await Swal.confirmDelete(
      'Delete User?',
      `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      { confirmButtonText: 'Yes, delete user!' }
    );
    
    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await api.users.delete(user.id);
        
        // Show success popup
        await Swal.success(
          'Deleted!',
          `${user.firstName} ${user.lastName} has been successfully deleted.`,
          { confirmButtonText: 'OK' }
        );
        
        await loadUsers();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
        setError(errorMessage);
        console.error('Error deleting user:', err);
        
        // Show error popup
        await Swal.error(
          'Error!',
          errorMessage,
          { confirmButtonText: 'OK' }
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveUser = async () => {
    try {
      setIsLoading(true);
      
      if (activeModal === 'create') {
        await api.users.create({
          firstName: formData.firstName!,
          lastName: formData.lastName!,
          email: formData.email!,
          password: formData.password!,
          contactNumber: formData.contactNumber,
          role: formData.role!,
          status: formData.status!
        });
        
        // Show success popup
        await Swal.success(
          'User Created!',
          `${formData.firstName} ${formData.lastName} has been successfully created.`,
          { confirmButtonText: 'OK' }
        );
      } else if (activeModal === 'edit' && selectedUser) {
        await api.users.update(selectedUser.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          contactNumber: formData.contactNumber,
          role: formData.role,
          status: formData.status
        });
        
        // Show success popup
        await Swal.success(
          'User Updated!',
          `${formData.firstName} ${formData.lastName} has been successfully updated.`,
          { confirmButtonText: 'OK' }
        );
      }
      
      // Reload users
      await loadUsers();
      setActiveModal(null);
      setSelectedUser(null);
      setFormData({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save user';
      setError(errorMessage);
      console.error('Error saving user:', err);
      
      // Show error popup
      await Swal.error(
        'Error!',
        errorMessage,
        { confirmButtonText: 'OK' }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Remove permission handling since it's not in the backend model

  const getRoleColor = (role: string) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj?.color || 'gray';
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'gray';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tableColumns = [
    {
      key: 'user',
      label: 'User',
      header: 'User',
      sortable: false,
      render: (_value: any, user: User) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img 
              src={generateRoleAvatar(user.role, user.firstName, user.lastName)} 
              alt={`${user.firstName} ${user.lastName}`} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <div className="text-xs text-gray-400">{user.contactNumber}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      header: 'Role',
      sortable: true,
      render: (_value: any, user: User) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getRoleColor(user.role)}-100 text-${getRoleColor(user.role)}-800`}>
          {roles.find(r => r.value === user.role)?.label}
        </span>
      )
    },
    {
      key: 'email',
      label: 'Email',
      header: 'Email',
      sortable: true,
      render: (_value: any, user: User) => (
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{user.email}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      header: 'Status',
      sortable: true,
      render: (_value: any, user: User) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(user.status)}-100 text-${getStatusColor(user.status)}-800`}>
          {statuses.find(s => s.value === user.status)?.label}
        </span>
      )
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      header: 'Last Login',
      sortable: true,
      render: (_value: any, user: User) => (
        <div className="text-sm text-gray-900">
          {user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      header: 'Actions',
      sortable: false,
      render: (_value: any, user: User) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="blue"
            onClick={() => handleViewUser(user)}
            className="px-2 py-1"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="green"
            onClick={() => handleEditUser(user)}
            className="px-2 py-1"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="red"
            onClick={() => handleDeleteUser(user)}
            className="px-2 py-1"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

	return (
		<>
			<div className="flex flex-col bg-background shadow-md p-6 rounded-xl">
			<div className="flex flex-row justify-between items-center pb-6">
				<MainHeader title="User Management" subtext="Manage users and their permissions" />
				<Button
					variant="blue"
					onClick={handleCreateUser}
					className="flex items-center space-x-2"
					disabled={isLoading}
				>
					<UserPlus className="w-4 h-4" />
					<span>Add User</span>
				</Button>
			</div>

			{/* Error Message */}
			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
					<p className="text-red-600 text-sm">{error}</p>
				</div>
			)}

			{/* Filters Section */}
			<div className="mb-4">
				<div className="flex items-center justify-between gap-4">
					{/* Left side: Filter label and dropdowns */}
					<div className="flex items-center gap-3">
						<span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by:</span>
						
						<select
							value={selectedRole}
							onChange={(e) => handleRoleFilter(e.target.value)}
							className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
						>
							<option value="">All Roles</option>
							{roles.map(role => (
								<option key={role.value} value={role.value}>{role.label}</option>
							))}
						</select>

						<select
							value={selectedStatus}
							onChange={(e) => handleStatusFilter(e.target.value)}
							className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
						>
							<option value="">All Status</option>
							{statuses.map(status => (
								<option key={status.value} value={status.value}>{status.label}</option>
							))}
						</select>

						<select
							value={selectedDepartment}
							onChange={(e) => handleDepartmentFilter(e.target.value)}
							className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
						>
							<option value="">All Departments</option>
							{departments.map(dept => (
								<option key={dept} value={dept}>{dept}</option>
							))}
						</select>
					</div>

					{/* Right side: Search */}
					<div className="w-80">
						<SearchInput
							placeholder="Search users..."
							onSearch={handleSearch}
						/>
					</div>
				</div>
			</div>
			
			<div>
				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
						<span className="ml-2 text-gray-600">Loading users...</span>
					</div>
				) : (
					<Table 
						columns={tableColumns} 
						data={currentUsers}
						className="w-full"
						sortConfig={sortConfig}
						onSort={handleSort}
						pagination={{
							currentPage: validCurrentPage,
							totalPages,
							totalItems: totalUsers,
							itemsPerPage,
							onPageChange: setCurrentPage
						}}
					/>
				)}
			</div>
		</div>

		{/* Create/Edit User Modal */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={activeModal === 'create' ? 'Create New User' : 'Edit User'}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName || ''}
                onChange={(e) => handleFormChange('firstName', e.target.value)}
                placeholder="Enter first name"
                required
              />
              <Input
                label="Last Name"
                value={formData.lastName || ''}
                onChange={(e) => handleFormChange('lastName', e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleFormChange('email', e.target.value)}
              placeholder="Enter email address"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Contact Number"
                value={formData.contactNumber || ''}
                onChange={(e) => handleFormChange('contactNumber', e.target.value)}
                placeholder="e.g., +63 912 345 6789"
              />
              
              <Input
                label="Password"
                type="password"
                value={formData.password || ''}
                onChange={(e) => handleFormChange('password', e.target.value)}
                placeholder="Enter password"
                required={activeModal === 'create'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.role || ''}
                  onChange={(e) => handleFormChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status || ''}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="red"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </Button>
            <Button
              variant="blue"
              onClick={handleSaveUser}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (activeModal === 'create' ? 'Create User' : 'Save Changes')}
            </Button>
          </div>
        </Modal>
      )}

      {/* View User Modal */}
      {activeModal === 'view' && selectedUser && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="User Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img 
                  src={generateRoleAvatar(selectedUser.role, selectedUser.firstName, selectedUser.lastName)} 
                  alt={`${selectedUser.firstName} ${selectedUser.lastName}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getRoleColor(selectedUser.role)}-100 text-${getRoleColor(selectedUser.role)}-800`}>
                    {roles.find(r => r.value === selectedUser.role)?.label}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(selectedUser.status)}-100 text-${getStatusColor(selectedUser.status)}-800`}>
                    {statuses.find(s => s.value === selectedUser.status)?.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{selectedUser.email}</p>
              </div>
            </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact Number</p>
                    <p className="text-sm text-gray-900">{selectedUser.contactNumber}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-sm text-gray-900">
                      {roles.find(r => r.value === selectedUser.role)?.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Login</p>
                    <p className="text-sm text-gray-900">
                      {selectedUser.lastLogin ? formatDateTime(selectedUser.lastLogin) : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="red"
              onClick={() => setActiveModal(null)}
            >
              Close
            </Button>
            <Button
              variant="blue"
              onClick={() => selectedUser && handleEditUser(selectedUser)}
            >
              Edit User
            </Button>
          </div>
        </Modal>
      )}
		</>
  );
};

export default UserManagement;