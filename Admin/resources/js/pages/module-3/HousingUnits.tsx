import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import Button from "../../components/Button";
import Header from "../../components/Header";
import SearchInput from "../../components/SearchInput";
import Card from "../../components/Card";
import Table from "../../components/Table";
import { housingUnits, allBeneficiaries } from "./mock/Beneficiary";
import { Home, MapPin, Users, Award, CheckCircle, Clock, AlertCircle, Filter, Grid, List, Plus, Edit, Eye } from "lucide-react";

const HousingUnits = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('');
	const [selectedProject, setSelectedProject] = useState('');
	const [filteredUnits, setFilteredUnits] = useState(housingUnits);
	const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
	const itemsPerPage = 10;

	// Sort handler
	const handleSort = (key: string) => {
		let direction: 'asc' | 'desc' = 'asc';
		if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	// Filter and search units
	useEffect(() => {
		let filtered = housingUnits;

		if (searchTerm) {
			filtered = filtered.filter(unit => 
				unit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				unit.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				unit.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(unit.assignedBeneficiary || '').toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (selectedStatus) {
			filtered = filtered.filter(unit => unit.status === selectedStatus);
		}

		if (selectedProject) {
			filtered = filtered.filter(unit => unit.projectName === selectedProject);
		}

		// Apply sorting
		if (sortConfig !== null) {
			filtered.sort((a, b) => {
				let aValue: any = a[sortConfig.key as keyof typeof a];
				let bValue: any = b[sortConfig.key as keyof typeof b];
				
				// Handle nested properties
				if (sortConfig.key === 'assignedBeneficiary') {
					aValue = a.assignedBeneficiary || '';
					bValue = b.assignedBeneficiary || '';
				}
				
				// Convert to comparable values
				if (sortConfig.key === 'assignedDate') {
					aValue = new Date(aValue || '');
					bValue = new Date(bValue || '');
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
		}

		setFilteredUnits(filtered);
		setCurrentPage(1);
	}, [searchTerm, selectedStatus, selectedProject, sortConfig]);

	const handleSearch = (value: string) => {
		setSearchTerm(value);
	};

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);
	};

	const handleProjectFilter = (project: string) => {
		setSelectedProject(project);
	};

	// Calculate pagination
	const totalItems = filteredUnits.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
	const startIndex = (validCurrentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentUnits = filteredUnits.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Helper function to get card status from unit status
	const getCardStatus = (status: string): 'verified' | 'pending' | 'rejected' | 'warning' => {
		switch (status) {
			case 'Available':
				return 'verified';
			case 'Awarded':
				return 'verified';
			case 'Occupied':
				return 'verified';
			case 'Under Construction':
				return 'warning';
			default:
				return 'pending';
		}
	};

	// Helper function to transform unit data for Card component
	const transformUnitForCard = (unit: any) => {
		return {
			title: `${unit.id}`,
			description: `${unit.projectName}`,
			status: getCardStatus(unit.status),
			type: 'location' as const,
			data: {
				unitNumber: unit.id,
				projectName: unit.projectName,
				type: unit.type,
				size: unit.size,
				floorArea: unit.floorArea,
				status: unit.status,
				assignedBeneficiary: unit.assignedBeneficiary || 'Not assigned',
				assignedDate: unit.assignedDate ? new Date(unit.assignedDate).toLocaleDateString() : 'N/A'
			},
			onView: () => console.log(`View unit: ${unit.id}`)
		};
	};

	// Filter options
	const statusOptions = [
		{ value: '', label: 'All Status' },
		{ value: 'Available', label: 'Available' },
		{ value: 'Awarded', label: 'Awarded' },
		{ value: 'Occupied', label: 'Occupied' },
		{ value: 'Under Construction', label: 'Under Construction' }
	];

	const projectOptions = [
		{ value: '', label: 'All Projects' },
		...Array.from(new Set(housingUnits.map(u => u.projectName))).map(project => ({
			value: project,
			label: project
		}))
	];

	// Table columns
	const columns = [
		{
			key: 'id',
			label: 'Unit ID',
			sortable: true,
			render: (value: string, row: any) => (
				<div className="font-medium text-primary">{value}</div>
			)
		},
		{
			key: 'projectName',
			label: 'Project',
			sortable: true,
			render: (value: string, row: any) => (
				<div>
					<div className="font-medium text-gray-900">{value}</div>
					<div className="text-sm text-gray-500">{row.address}</div>
				</div>
			)
		},
		{
			key: 'type',
			label: 'Type',
			sortable: true,
			render: (value: string) => (
				<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
					{value}
				</span>
			)
		},
		{
			key: 'size',
			label: 'Size',
			render: (value: string, row: any) => (
				<div>
					<div className="text-sm font-medium">{value}</div>
					<div className="text-xs text-gray-500">{row.floorArea}</div>
				</div>
			)
		},
		{
			key: 'assignedBeneficiary',
			label: 'Assigned Beneficiary',
			sortable: true,
			render: (value: string, row: any) => (
				<div>
					{row.assignedBeneficiary ? (
						<>
							<div className="font-medium text-gray-900">{row.assignedBeneficiary}</div>
							<div className="text-sm text-gray-500">
								{row.assignedDate ? new Date(row.assignedDate).toLocaleDateString() : 'N/A'}
							</div>
						</>
					) : (
						<span className="text-sm text-gray-500 italic">Not assigned</span>
					)}
				</div>
			)
		},
		{
			key: 'status',
			label: 'Status',
			sortable: true,
			render: (value: string) => {
				const statusColors = {
					'Available': 'bg-green-100 text-green-800',
					'Awarded': 'bg-purple-100 text-purple-800',
					'Occupied': 'bg-blue-100 text-blue-800',
					'Under Construction': 'bg-yellow-100 text-yellow-800'
				};
				return (
					<span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
						{value}
					</span>
				);
			}
		},
		{
			key: 'actions',
			label: 'Actions',
			render: (value: any, row: any) => (
				<div className="flex items-center space-x-2">
					<button
						onClick={() => console.log(`View unit: ${row.id}`)}
						className="text-blue-600 hover:text-blue-800 p-1"
						title="View Details"
					>
						<Eye className="w-4 h-4" />
					</button>
					<button
						onClick={() => console.log(`Edit unit: ${row.id}`)}
						className="text-gray-600 hover:text-gray-800 p-1"
						title="Edit Unit"
					>
						<Edit className="w-4 h-4" />
					</button>
					{row.status === 'Available' && (
						<button
							className="text-purple-600 hover:text-purple-800 p-1"
							title="Assign to Beneficiary"
						>
							<Award className="w-4 h-4" />
						</button>
					)}
				</div>
			)
		}
	];

	// Statistics
	const stats = {
		total: housingUnits.length,
		available: housingUnits.filter(u => u.status === 'Available').length,
		awarded: housingUnits.filter(u => u.status === 'Awarded').length,
		occupied: housingUnits.filter(u => u.status === 'Occupied').length,
		underConstruction: housingUnits.filter(u => u.status === 'Under Construction').length
	};

	return (
		<>
			<div className="flex flex-col bg-background shadow-md p-6 rounded-xl">
				<div className="flex flex-row justify-between items-center pb-6">
					<Header title="Housing Units" subtext="Manage housing projects and units" />
					<Button variant="green" className="flex items-center gap-2">
						<Plus className="w-4 h-4" />
						Add Unit
					</Button>
				</div>

				{/* Filters Section */}
				<div className="mb-4">
					<div className="flex items-center justify-between gap-4">
						{/* Left side: Filter label and dropdowns */}
						<div className="flex items-center gap-3">
							<span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by:</span>
							
							<select
								value={selectedStatus}
								onChange={(e) => handleStatusFilter(e.target.value)}
								className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
							>
								{statusOptions.map(option => (
									<option key={option.value} value={option.value}>{option.label}</option>
								))}
							</select>

							<select
								value={selectedProject}
								onChange={(e) => handleProjectFilter(e.target.value)}
								className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
							>
								{projectOptions.map(option => (
									<option key={option.value} value={option.value}>{option.label}</option>
								))}
							</select>
						</div>

						{/* Right side: Search */}
						<div className="w-80">
							<SearchInput
								placeholder="Search units..."
								onSearch={handleSearch}
							/>
						</div>
					</div>
				</div>
				
				{/* Units Grid */}
				<div className="space-y-6">
					{currentUnits.length > 0 ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{currentUnits.map((unit) => (
									<Card
										key={unit.id}
										{...transformUnitForCard(unit)}
									/>
								))}
							</div>
							
							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex items-center justify-between mt-6">
									<div className="text-sm text-gray-700">
										Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} units
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="blue"
											onClick={() => handlePageChange(validCurrentPage - 1)}
											disabled={validCurrentPage === 1}
											className="px-3 py-1 text-sm"
										>
											Previous
										</Button>
										
										<div className="flex items-center gap-1">
											{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
												<Button
													key={page}
													variant={page === validCurrentPage ? "blue" : "red"}
													onClick={() => handlePageChange(page)}
													className={`px-3 py-1 text-sm ${
														page === validCurrentPage 
															? "bg-blue-600 text-white" 
															: "bg-gray-100 text-gray-700 hover:bg-gray-200"
													}`}
												>
													{page}
												</Button>
											))}
										</div>
										
										<Button
											variant="blue"
											onClick={() => handlePageChange(validCurrentPage + 1)}
											disabled={validCurrentPage === totalPages}
											className="px-3 py-1 text-sm"
										>
											Next
										</Button>
									</div>
								</div>
							)}
						</>
					) : (
						<div className="text-center py-12">
							<div className="text-gray-500 text-lg">No housing units found</div>
							<div className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default HousingUnits;
