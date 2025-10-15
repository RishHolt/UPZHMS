import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import Button from "../../components/Button";
import Header from "../../components/Header";
import SearchInput from "../../components/SearchInput";
import Card from "../../components/Card";
import Table from "../../components/Table";
import { allBeneficiaries, housingUnits } from "./mock/Beneficiary";
import { Eye, Home, UserCheck, Award, CheckCircle, Clock, Filter, Grid, List } from "lucide-react";

const HousingBeneficiaries = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('');
	const [selectedBarangay, setSelectedBarangay] = useState('');
	const [filteredBeneficiaries, setFilteredBeneficiaries] = useState(allBeneficiaries);
	const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
	const itemsPerPage = 10;

	// Filter to only show approved beneficiaries
	const approvedBeneficiaries = allBeneficiaries.filter(b => 
		b.status === 'Approved' || b.status === 'Awarded' || b.status === 'Occupied'
	);

	// Sort handler
	const handleSort = (key: string) => {
		let direction: 'asc' | 'desc' = 'asc';
		if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	// Filter and search beneficiaries
	useEffect(() => {
		let filtered = approvedBeneficiaries;

		if (searchTerm) {
			filtered = filtered.filter(beneficiary => 
				beneficiary.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				beneficiary.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				beneficiary.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
				beneficiary.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(beneficiary.assignedHousingUnit?.projectName || '').toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (selectedStatus) {
			filtered = filtered.filter(beneficiary => beneficiary.status === selectedStatus);
		}

		if (selectedBarangay) {
			filtered = filtered.filter(beneficiary => beneficiary.barangay === selectedBarangay);
		}

		// Apply sorting
		if (sortConfig !== null) {
			filtered.sort((a, b) => {
				let aValue: any = a[sortConfig.key as keyof typeof a];
				let bValue: any = b[sortConfig.key as keyof typeof b];
				
				// Handle nested properties
				if (sortConfig.key === 'assignedHousingUnit') {
					aValue = a.assignedHousingUnit?.projectName || '';
					bValue = b.assignedHousingUnit?.projectName || '';
				} else if (sortConfig.key === 'familySize') {
					aValue = a.familyMembers.length;
					bValue = b.familyMembers.length;
				}
				
				// Convert to comparable values
				if (sortConfig.key === 'approvalDate') {
					aValue = new Date(aValue || a.applicationDate);
					bValue = new Date(bValue || b.applicationDate);
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

		setFilteredBeneficiaries(filtered);
		setCurrentPage(1);
	}, [searchTerm, selectedStatus, selectedBarangay, sortConfig]);

	const handleSearch = (value: string) => {
		setSearchTerm(value);
	};

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);
	};

	const handleBarangayFilter = (barangay: string) => {
		setSelectedBarangay(barangay);
	};

	// Calculate pagination
	const totalItems = filteredBeneficiaries.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
	const startIndex = (validCurrentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentBeneficiaries = filteredBeneficiaries.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Helper function to get card status from beneficiary status
	const getCardStatus = (status: string): 'verified' | 'pending' | 'rejected' | 'warning' => {
		switch (status) {
			case 'Awarded':
			case 'Occupied':
				return 'verified';
			case 'Approved':
				return 'verified';
			default:
				return 'pending';
		}
	};

	// Helper function to transform beneficiary data for Card component
	const transformBeneficiaryForCard = (beneficiary: any) => {
		return {
			title: `${beneficiary.applicantName}`,
			description: `${beneficiary.id} • ${beneficiary.barangay}`,
			status: getCardStatus(beneficiary.status),
			type: 'applicant' as const,
			data: {
				applicantName: beneficiary.applicantName,
				contactNumber: beneficiary.contactNumber,
				emailAddress: beneficiary.emailAddress,
				barangay: beneficiary.barangay,
				familySize: beneficiary.familyMembers.length,
				incomeBracket: beneficiary.incomeBracket,
				assignedUnit: beneficiary.assignedHousingUnit?.unitNumber || 'Not assigned',
				approvalDate: new Date(beneficiary.approvalDate || beneficiary.applicationDate).toLocaleDateString()
			},
			onView: () => router.visit(`/housing/beneficiaries/${beneficiary.id}`)
		};
	};

	// Filter options
	const statusOptions = [
		{ value: '', label: 'All Status' },
		{ value: 'Approved', label: 'Approved' },
		{ value: 'Awarded', label: 'Awarded' },
		{ value: 'Occupied', label: 'Occupied' }
	];

	const barangayOptions = [
		{ value: '', label: 'All Barangays' },
		...Array.from(new Set(approvedBeneficiaries.map(b => b.barangay))).map(barangay => ({
			value: barangay,
			label: barangay
		}))
	];

	// Table columns
	const columns = [
		{
			key: 'id',
			label: 'Beneficiary ID',
			sortable: true,
			render: (value: string, row: any) => (
				<div className="font-medium text-primary">{value}</div>
			)
		},
		{
			key: 'applicantName',
			label: 'Beneficiary Name',
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
			key: 'assignedHousingUnit',
			label: 'Assigned Unit',
			sortable: true,
			render: (value: any, row: any) => (
				<div>
					{row.assignedHousingUnit ? (
						<>
							<div className="font-medium text-gray-900">{row.assignedHousingUnit.unitNumber}</div>
							<div className="text-sm text-gray-500">{row.assignedHousingUnit.projectName}</div>
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
					'Approved': 'bg-green-100 text-green-800',
					'Awarded': 'bg-purple-100 text-purple-800',
					'Occupied': 'bg-blue-100 text-blue-800'
				};
				return (
					<span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
						{value}
					</span>
				);
			}
		},
		{
			key: 'approvalDate',
			label: 'Approval Date',
			sortable: true,
			render: (value: string, row: any) => new Date(value || row.applicationDate).toLocaleDateString()
		},
		{
			key: 'actions',
			label: 'Actions',
			render: (value: any, row: any) => (
				<div className="flex items-center space-x-2">
					<button
						onClick={() => router.visit(`/housing/beneficiaries/${row.id}`)}
						className="text-blue-600 hover:text-blue-800 p-1"
						title="View Profile"
					>
						<Eye className="w-4 h-4" />
					</button>
					{!row.assignedHousingUnit && (
						<button
							className="text-purple-600 hover:text-purple-800 p-1"
							title="Assign Housing Unit"
						>
							<Home className="w-4 h-4" />
						</button>
					)}
					{row.assignedHousingUnit && row.status === 'Awarded' && (
						<button
							className="text-green-600 hover:text-green-800 p-1"
							title="Mark as Occupied"
						>
							<CheckCircle className="w-4 h-4" />
						</button>
					)}
				</div>
			)
		}
	];

	// Statistics
	const stats = {
		total: approvedBeneficiaries.length,
		assigned: approvedBeneficiaries.filter(b => b.assignedHousingUnit).length,
		occupied: approvedBeneficiaries.filter(b => b.status === 'Occupied').length,
		unassigned: approvedBeneficiaries.filter(b => !b.assignedHousingUnit).length
	};

	return (
		<>
			<div className="flex flex-col bg-background shadow-md p-6 rounded-xl">
				<div className="flex flex-row justify-between items-center pb-6">
					<Header title="Housing Beneficiaries" subtext="Manage approved housing program beneficiaries" />
					<Button variant="green" onClick={() => router.visit('/housing/beneficiaries/new')}>
						New Beneficiary
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
								placeholder="Search beneficiaries..."
								onSearch={handleSearch}
							/>
						</div>
					</div>
				</div>
				
				{/* Beneficiaries Grid */}
				<div className="space-y-6">
					{currentBeneficiaries.length > 0 ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{currentBeneficiaries.map((beneficiary) => (
									<Card
										key={beneficiary.id}
										{...transformBeneficiaryForCard(beneficiary)}
									/>
								))}
							</div>
							
							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex items-center justify-between mt-6">
									<div className="text-sm text-gray-700">
										Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} beneficiaries
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
							<div className="text-gray-500 text-lg">No beneficiaries found</div>
							<div className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default HousingBeneficiaries;
