import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import Button from "../../components/Button";
import Header from "../../components/Header";
import SearchInput from "../../components/SearchInput";
import Card from "../../components/Card";
import Table from "../../components/Table";
import { allBeneficiaries } from "./mock/Beneficiary";
import { Eye, UserCheck, CheckCircle, XCircle, Clock, AlertCircle, Filter, Grid, List } from "lucide-react";

const HousingApplications = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('');
	const [selectedIncomeBracket, setSelectedIncomeBracket] = useState('');
	const [selectedBarangay, setSelectedBarangay] = useState('');
	const [filteredApplications, setFilteredApplications] = useState(allBeneficiaries);
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

	// Filter and search applications
	useEffect(() => {
		let filtered = allBeneficiaries;

		if (searchTerm) {
			filtered = filtered.filter(app => 
				app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				app.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
				app.barangay.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (selectedStatus) {
			filtered = filtered.filter(app => app.status === selectedStatus);
		}

		if (selectedIncomeBracket) {
			filtered = filtered.filter(app => app.incomeBracket === selectedIncomeBracket);
		}

		if (selectedBarangay) {
			filtered = filtered.filter(app => app.barangay === selectedBarangay);
		}

		// Apply sorting
		if (sortConfig !== null) {
			filtered.sort((a, b) => {
				let aValue: any = a[sortConfig.key as keyof typeof a];
				let bValue: any = b[sortConfig.key as keyof typeof b];
				
				// Convert to comparable values
				if (sortConfig.key === 'applicationDate') {
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
		}

		setFilteredApplications(filtered);
		setCurrentPage(1);
	}, [searchTerm, selectedStatus, selectedIncomeBracket, selectedBarangay, sortConfig]);

	const handleSearch = (value: string) => {
		setSearchTerm(value);
	};

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);
	};

	const handleIncomeBracketFilter = (bracket: string) => {
		setSelectedIncomeBracket(bracket);
	};

	const handleBarangayFilter = (barangay: string) => {
		setSelectedBarangay(barangay);
	};

	// Calculate pagination
	const totalItems = filteredApplications.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
	const startIndex = (validCurrentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentApplications = filteredApplications.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Helper function to get card status from application status
	const getCardStatus = (status: string): 'verified' | 'pending' | 'rejected' | 'warning' => {
		switch (status) {
			case 'Approved':
			case 'Awarded':
				return 'verified';
			case 'Rejected':
				return 'rejected';
			case 'Verified':
				return 'verified';
			case 'Under Review':
				return 'warning';
			case 'Applied':
			default:
				return 'pending';
		}
	};

	// Helper function to transform application data for Card component
	const transformApplicationForCard = (app: any) => {
		return {
			title: `${app.applicantName}`,
			description: `${app.id} • ${app.barangay}`,
			status: getCardStatus(app.status),
			type: 'applicant' as const,
			data: {
				applicantName: app.applicantName,
				contactNumber: app.contactNumber,
				emailAddress: app.emailAddress,
				barangay: app.barangay,
				incomeBracket: app.incomeBracket,
				familySize: app.familyMembers.length,
				applicationDate: new Date(app.applicationDate).toLocaleDateString(),
				monthlyIncome: `₱${app.monthlyIncome.toLocaleString()}`
			},
			onView: () => router.visit(`/housing/applications/${app.id}`)
		};
	};

	// Filter options
	const statusOptions = [
		{ value: '', label: 'All Status' },
		{ value: 'Applied', label: 'Applied' },
		{ value: 'Under Review', label: 'Under Review' },
		{ value: 'Verified', label: 'Verified' },
		{ value: 'Approved', label: 'Approved' },
		{ value: 'Awarded', label: 'Awarded' },
		{ value: 'Rejected', label: 'Rejected' }
	];

	const incomeBracketOptions = [
		{ value: '', label: 'All Income Brackets' },
		{ value: 'Low Income', label: 'Low Income' },
		{ value: 'Middle Income', label: 'Middle Income' },
		{ value: 'High Income', label: 'High Income' }
	];

	const barangayOptions = [
		{ value: '', label: 'All Barangays' },
		...Array.from(new Set(allBeneficiaries.map(app => app.barangay))).map(barangay => ({
			value: barangay,
			label: barangay
		}))
	];

	// Table columns
	const columns = [
		{
			key: 'id',
			label: 'Application ID',
			sortable: true,
			render: (value: string, row: any) => (
				<div className="font-medium text-primary">{value}</div>
			)
		},
		{
			key: 'applicantName',
			label: 'Applicant Name',
			sortable: true,
			render: (value: string, row: any) => (
				<div>
					<div className="font-medium text-gray-900">{value}</div>
					<div className="text-sm text-gray-500">{row.emailAddress}</div>
				</div>
			)
		},
		{
			key: 'barangay',
			label: 'Barangay',
			sortable: true
		},
		{
			key: 'incomeBracket',
			label: 'Income Bracket',
			sortable: true,
			render: (value: string) => (
				<span className={`px-2 py-1 rounded-full text-xs font-medium ${
					value === 'Low Income' ? 'bg-red-100 text-red-800' :
					value === 'Middle Income' ? 'bg-yellow-100 text-yellow-800' :
					'bg-green-100 text-green-800'
				}`}>
					{value}
				</span>
			)
		},
		{
			key: 'familySize',
			label: 'Family Size',
			render: (value: number, row: any) => (
				<div className="text-center">
					<div className="font-medium">{row.familyMembers.length}</div>
					<div className="text-xs text-gray-500">members</div>
				</div>
			)
		},
		{
			key: 'status',
			label: 'Status',
			sortable: true,
			render: (value: string) => {
				const statusColors = {
					'Applied': 'bg-gray-100 text-gray-800',
					'Under Review': 'bg-yellow-100 text-yellow-800',
					'Verified': 'bg-blue-100 text-blue-800',
					'Approved': 'bg-green-100 text-green-800',
					'Awarded': 'bg-purple-100 text-purple-800',
					'Rejected': 'bg-red-100 text-red-800'
				};
				return (
					<span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
						{value}
					</span>
				);
			}
		},
		{
			key: 'applicationDate',
			label: 'Application Date',
			sortable: true,
			render: (value: string) => new Date(value).toLocaleDateString()
		},
		{
			key: 'actions',
			label: 'Actions',
			render: (value: any, row: any) => (
				<div className="flex items-center space-x-2">
					<button
						onClick={() => router.visit(`/housing/applications/${row.id}`)}
						className="text-blue-600 hover:text-blue-800 p-1"
						title="View Details"
					>
						<Eye className="w-4 h-4" />
					</button>
					{row.status === 'Applied' && (
						<button
							className="text-green-600 hover:text-green-800 p-1"
							title="Verify Application"
						>
							<UserCheck className="w-4 h-4" />
						</button>
					)}
					{row.status === 'Verified' && (
						<button
							className="text-blue-600 hover:text-blue-800 p-1"
							title="Approve Application"
						>
							<CheckCircle className="w-4 h-4" />
						</button>
					)}
				</div>
			)
		}
	];

	return (
		<>
			<div className="flex flex-col bg-background shadow-md p-6 rounded-xl">
				<div className="flex flex-row justify-between items-center pb-6">
					<Header title="Housing Applications" subtext="Manage and process housing beneficiary applications" />
					<Button variant="green" onClick={() => router.visit('/housing/applications/new')}>
						New Application
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
								value={selectedIncomeBracket}
								onChange={(e) => handleIncomeBracketFilter(e.target.value)}
								className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
							>
								{incomeBracketOptions.map(option => (
									<option key={option.value} value={option.value}>{option.label}</option>
								))}
							</select>

							<select
								value={selectedBarangay}
								onChange={(e) => handleBarangayFilter(e.target.value)}
								className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
							>
								{barangayOptions.map(option => (
									<option key={option.value} value={option.value}>{option.label}</option>
								))}
							</select>
						</div>

						{/* Right side: Search */}
						<div className="w-80">
							<SearchInput
								placeholder="Search applications..."
								onSearch={handleSearch}
							/>
						</div>
					</div>
				</div>
				
				{/* Applications Grid */}
				<div className="space-y-6">
					{currentApplications.length > 0 ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{currentApplications.map((app) => (
									<Card
										key={app.id}
										{...transformApplicationForCard(app)}
									/>
								))}
							</div>
							
							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex items-center justify-between mt-6">
									<div className="text-sm text-gray-700">
										Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} applications
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
							<div className="text-gray-500 text-lg">No applications found</div>
							<div className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default HousingApplications;
