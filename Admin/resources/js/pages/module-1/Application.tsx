import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import Button from "../../components/Button";
import Header from "../../components/Header";
import SearchInput from "../../components/SearchInput";
import Card from "../../components/Card";
import { allApplications } from "./mock/Application";


const ZoningApplication = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('');
	const [selectedZone, setSelectedZone] = useState('');
	const [filteredApplications, setFilteredApplications] = useState(allApplications);
	const itemsPerPage = 10; // Fixed max 10 items per page

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
		let filtered = allApplications;

		if (searchTerm) {
			filtered = filtered.filter(app => 
				app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				app.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
				app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				app.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (selectedStatus) {
			filtered = filtered.filter(app => app.status === selectedStatus);
		}

		if (selectedZone) {
			filtered = filtered.filter(app => app.proposedZone === selectedZone);
		}

		// Apply sorting
		if (sortConfig !== null) {
			filtered.sort((a, b) => {
				let aValue: any = a[sortConfig.key as keyof typeof a];
				let bValue: any = b[sortConfig.key as keyof typeof b];
				
				// Convert to comparable values
				if (sortConfig.key === 'dateSubmitted') {
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
	}, [searchTerm, selectedStatus, selectedZone, sortConfig]);

	const handleSearch = (value: string) => {
		setSearchTerm(value);
	};

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);
	};

	const handleZoneFilter = (zone: string) => {
		setSelectedZone(zone);
	};

	// Calculate pagination
	const totalItems = filteredApplications.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
	const startIndex = (validCurrentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentApplications = filteredApplications.slice(startIndex, endIndex);
	
	// Pagination is always shown

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Helper function to get card status from application status
	const getCardStatus = (status: string): 'verified' | 'pending' | 'rejected' | 'warning' => {
		switch (status) {
			case 'Approved':
				return 'verified';
			case 'Rejected':
				return 'rejected';
			case 'Under Review':
				return 'warning';
			case 'Pending Review':
			default:
				return 'pending';
		}
	};

	// Helper function to transform application data for Card component
	const transformApplicationForCard = (app: any) => {
		return {
			title: `Application ${app.id}`,
			description: app.applicantName,
			status: getCardStatus(app.status),
			type: 'applicant' as const,
			data: {
				applicantName: app.applicantName,
				propertyAddress: app.propertyAddress,
				proposedZone: app.proposedZone,
				dateSubmitted: new Date(app.dateSubmitted).toLocaleDateString(),
				emailAddress: app.emailAddress
			},
			onView: () => router.visit(`/zoning/applications/${app.id}`)
		};
	};

	// Filter options
	const statusOptions = [
		{ value: '', label: 'All Status' },
		{ value: 'Pending Review', label: 'Pending Review' },
		{ value: 'Under Review', label: 'Under Review' },
		{ value: 'Approved', label: 'Approved' },
		{ value: 'Rejected', label: 'Rejected' }
	];

	const zoneOptions = [
		{ value: '', label: 'All Zones' },
		{ value: 'Residential', label: 'Residential' },
		{ value: 'Commercial', label: 'Commercial' },
		{ value: 'Industrial', label: 'Industrial' },
		{ value: 'Mixed-Use', label: 'Mixed-Use' }
	];


	return (
		<>
		<div className="flex flex-col bg-background shadow-md p-6 rounded-xl">
			<div className="flex flex-row justify-between items-center pb-6">
				<Header title="Application" subtext="Manage zoning clearance applications" />
				<Button variant="green" onClick={() => router.visit('/Zoning-Clearance/Application/New')}>
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
							value={selectedZone}
							onChange={(e) => handleZoneFilter(e.target.value)}
							className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
						>
							{zoneOptions.map(option => (
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
						<div className="text-gray-500 text-lg mb-2">No applications found</div>
						<div className="text-gray-400 text-sm">
							{searchTerm || selectedStatus || selectedZone 
								? "Try adjusting your search or filter criteria"
								: "No applications have been submitted yet"
							}
						</div>
					</div>
				)}
			</div>
		</div>
		</>
	);
};

export default ZoningApplication;
