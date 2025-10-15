import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import Table from "../components/Table";
import Modal from "../components/Modal";
import SearchInput from "../components/SearchInput";
import { Edit, Trash2, Plus, Eye, Shield, Mail, Calendar } from 'lucide-react';

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

interface UserFormData extends Partial<User> {
  password?: string;
}

interface UserManagementProps {
  users?: User[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters?: {
    search?: string;
    role?: string;
    status?: string;
  };
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

// Generate role-based avatar
const generateRoleAvatar = (role: string, firstName: string, lastName: string) => {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  
  // Create SVG avatar based on role
  const roleColors = {
    IT_ADMIN: { bg: '#dc2626', text: '#ffffff' }, // Red
    ZONING_ADMIN: { bg: '#2563eb', text: '#ffffff' }, // Blue
    ZONING_OFFICER: { bg: '#3b82f6', text: '#ffffff' }, // Blue
    BUILDING_ADMIN: { bg: '#059669', text: '#ffffff' }, // Green
    BUILDING_OFFICER: { bg: '#10b981', text: '#ffffff' } // Green
  };
  
  const colors = roleColors[role as keyof typeof roleColors] || { bg: '#6b7280', text: '#ffffff' };
  
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" fill="${colors.bg}" rx="20"/>
      <text x="20" y="26" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="${colors.text}">${initials}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const UserManagement = ({ users = [], pagination, filters = {} }: UserManagementProps) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({});
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Initialize filters from props
  useEffect(() => {
    setSearchTerm(filters.search || '');
    setSelectedRole(filters.role || '');
    setSelectedStatus(filters.status || '');
  }, [filters]);

  // Sort handler - now client-side
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
      router.get('/users', {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        role: selectedRole || undefined,
        status: selectedStatus || undefined
      }, {
        preserveState: true,
        onSuccess: (page) => {
          const data = page.props as any;
          setFilteredUsers(data.users || []);
          setTotalPages(data.pagination?.last_page || 0);
          setTotalUsers(data.pagination?.total || 0);
        }
      });
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
  }, [currentPage, searchTerm, selectedRole, selectedStatus]);

  // Update filtered users when users data changes
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // Apply client-side sorting when sortConfig changes
  useEffect(() => {
    if (sortConfig && filteredUsers.length > 0) {
      const sorted = [...filteredUsers].sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof User];
        let bValue: any = b[sortConfig.key as keyof User];
        
        // Convert to comparable values
        if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt' || sortConfig.key === 'lastLogin') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      
      setFilteredUsers(sorted);
    }
  }, [sortConfig]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    router.get('/users', { ...filters, role: role || undefined }, { preserveState: true });
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    router.get('/users', { ...filters, status: status || undefined }, { preserveState: true });
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
    setValidationErrors({});
    setError(null);
    setActiveModal('create');
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData(user);
    setValidationErrors({});
    setError(null);
    setActiveModal('edit');
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setActiveModal('view');
  };

  const handleDeleteUser = async (user: User) => {
    // Show confirmation dialog
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
      try {
        setIsLoading(true);
        router.delete(`/users/${user.id}`, {
          onSuccess: () => {
            loadUsers();
          },
          onError: (errors) => {
            const errorMessage = Object.values(errors)[0] as string || 'Failed to delete user';
            setError(errorMessage);
          }
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
        setError(errorMessage);
        console.error('Error deleting user:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (activeModal === 'create' && !formData.password?.trim()) {
      errors.password = 'Password is required for new users';
    }
    
    if (!formData.role) {
      errors.role = 'Role is required';
    }
    
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveUser = async () => {
    // Clear previous errors
    setError(null);
    setValidationErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      if (activeModal === 'create') {
        router.post('/users', formData as any, {
          onSuccess: () => {
            loadUsers();
            setActiveModal(null);
            setSelectedUser(null);
            setFormData({});
            setValidationErrors({});
          },
          onError: (errors) => {
            if (typeof errors === 'object' && errors !== null) {
              setValidationErrors(errors as {[key: string]: string});
            } else {
              const errorMessage = Object.values(errors)[0] as string || 'Failed to create user';
              setError(errorMessage);
            }
          }
        });
      } else if (activeModal === 'edit' && selectedUser) {
        router.put(`/users/${selectedUser.id}`, formData as any, {
          onSuccess: () => {
            loadUsers();
            setActiveModal(null);
            setSelectedUser(null);
            setFormData({});
            setValidationErrors({});
          },
          onError: (errors) => {
            if (typeof errors === 'object' && errors !== null) {
              setValidationErrors(errors as {[key: string]: string});
            } else {
              const errorMessage = Object.values(errors)[0] as string || 'Failed to update user';
              setError(errorMessage);
            }
          }
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save user';
      setError(errorMessage);
      console.error('Error saving user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

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
				<Header title="User Management" subtext="Manage users and their permissions" />
				<Button
					variant="blue"
					onClick={handleCreateUser}
					className="flex items-center space-x-2"
					disabled={isLoading}
				>
					<Plus className="w-4 h-4" />
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
          <form id="user-form" onSubmit={(e) => {
            e.preventDefault();
            handleSaveUser();
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name *"
                value={formData.firstName || ''}
                onChange={(e) => handleFormChange('firstName', e.target.value)}
                placeholder="Enter first name"
                required
                error={validationErrors.firstName}
                disabled={isLoading}
              />
              <Input
                label="Last Name *"
                value={formData.lastName || ''}
                onChange={(e) => handleFormChange('lastName', e.target.value)}
                placeholder="Enter last name"
                required
                error={validationErrors.lastName}
                disabled={isLoading}
              />
            </div>

            <Input
              label="Email Address *"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleFormChange('email', e.target.value)}
              placeholder="Enter email address"
              required
              error={validationErrors.email}
              disabled={isLoading}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Contact Number"
                value={formData.contactNumber || ''}
                onChange={(e) => handleFormChange('contactNumber', e.target.value)}
                placeholder="e.g., +63 912 345 6789"
                disabled={isLoading}
              />
              
              <Input
                label="Password"
                type="password"
                value={formData.password || ''}
                onChange={(e) => handleFormChange('password', e.target.value)}
                placeholder="Enter password"
                required={activeModal === 'create'}
                error={validationErrors.password}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Role *</label>
                <select
                  value={formData.role || ''}
                  onChange={(e) => handleFormChange('role', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    validationErrors.role ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                {validationErrors.role && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status *</label>
                <select
                  value={formData.status || ''}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    validationErrors.status ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  required
                  disabled={isLoading}
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
                {validationErrors.status && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.status}</p>
                )}
              </div>
            </div>
          </form>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="red"
              type="button"
              onClick={() => {
                if (!isLoading) {
                  setActiveModal(null);
                  setValidationErrors({});
                  setError(null);
                }
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="blue"
              type="button"
              onClick={() => {
                const form = document.getElementById('user-form') as HTMLFormElement;
                if (form) {
                  form.requestSubmit();
                }
              }}
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