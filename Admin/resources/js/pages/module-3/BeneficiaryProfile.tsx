import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { ArrowLeft, User, Home, DollarSign, FileText, CheckCircle, XCircle, Clock, AlertCircle, Edit, Download, Eye, MessageSquare, UserCheck, Award, MapPin, Calendar, Users } from "lucide-react";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Card from "../../components/Card";
import { allBeneficiaries } from "./mock/Beneficiary";

const HousingBeneficiaryProfile = () => {
	// Get the ID from Inertia props
	const { props } = usePage();
	const id = (props as any).beneficiaryId;
	
	const [activeTab, setActiveTab] = useState<'overview' | 'housing' | 'documents' | 'history'>('overview');
	
	// Find the beneficiary by ID
	const beneficiary = allBeneficiaries.find(b => b.id === id);
	
	// If beneficiary not found, show error message
	if (!beneficiary) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="bg-white p-8 rounded-lg shadow-md text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-4">Beneficiary Not Found</h1>
					<p className="text-gray-600 mb-4">
						The beneficiary with ID "{id}" could not be found.
					</p>
					<Button
						variant="blue"
						onClick={() => router.get('/housing/beneficiaries')}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Beneficiaries
					</Button>
				</div>
			</div>
		);
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Approved':
			case 'Awarded':
			case 'Occupied':
				return 'text-green-600 bg-green-50 border-green-200';
			case 'Verified':
				return 'text-blue-600 bg-blue-50 border-blue-200';
			case 'Under Review':
				return 'text-yellow-600 bg-yellow-50 border-yellow-200';
			case 'Applied':
				return 'text-gray-600 bg-gray-50 border-gray-200';
			case 'Rejected':
				return 'text-red-600 bg-red-50 border-red-200';
			default:
				return 'text-gray-600 bg-gray-50 border-gray-200';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'Approved':
			case 'Awarded':
			case 'Occupied':
				return CheckCircle;
			case 'Verified':
				return UserCheck;
			case 'Under Review':
				return Clock;
			case 'Applied':
				return AlertCircle;
			case 'Rejected':
				return XCircle;
			default:
				return AlertCircle;
		}
	};

	const StatusIcon = getStatusIcon(beneficiary.status);

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="bg-white shadow-md rounded-xl p-6 mb-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="blue"
								onClick={() => router.get('/housing/beneficiaries')}
								className="flex items-center gap-2"
							>
								<ArrowLeft className="w-4 h-4" />
								Back
							</Button>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">{beneficiary.applicantName}</h1>
								<p className="text-gray-600">{beneficiary.id}</p>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getStatusColor(beneficiary.status)}`}>
								<StatusIcon className="w-5 h-5" />
								<span className="font-medium">{beneficiary.status}</span>
							</div>
							<Button variant="green" className="flex items-center gap-2">
								<Edit className="w-4 h-4" />
								Edit Profile
							</Button>
						</div>
					</div>
				</div>

				{/* Navigation Tabs */}
				<div className="bg-white shadow-md rounded-xl mb-6">
					<div className="border-b border-gray-200">
						<nav className="flex space-x-8 px-6">
							{[
								{ id: 'overview', label: 'Overview', icon: User },
								{ id: 'housing', label: 'Housing Assignment', icon: Home },
								{ id: 'documents', label: 'Documents', icon: FileText },
								{ id: 'history', label: 'History', icon: Clock }
							].map((tab) => {
								const Icon = tab.icon;
								return (
									<button
										key={tab.id}
										onClick={() => setActiveTab(tab.id as any)}
										className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
											activeTab === tab.id
												? 'border-primary text-primary'
												: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
										}`}
									>
										<Icon className="w-4 h-4" />
										<span>{tab.label}</span>
									</button>
								);
							})}
						</nav>
					</div>
				</div>

				{/* Content */}
				{activeTab === 'overview' && (
					<div className="space-y-6">
						{/* Personal Information */}
						<Card
							title="Personal Information"
							description="Basic demographic details"
							status="verified"
							type="applicant"
							data={{
								applicantName: beneficiary.applicantName,
								contactNumber: beneficiary.contactNumber,
								emailAddress: beneficiary.emailAddress,
								dateOfBirth: new Date(beneficiary.dateOfBirth).toLocaleDateString(),
								placeOfBirth: beneficiary.placeOfBirth,
								civilStatus: beneficiary.civilStatus,
								barangay: beneficiary.barangay,
								yearsOfResidency: `${beneficiary.yearsOfResidency} years`
							}}
							className="bg-white shadow-md"
						/>

						{/* Family Composition */}
						<div className="bg-white shadow-md rounded-xl p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">Family Composition</h3>
								<span className="text-sm text-gray-500">{beneficiary.familyMembers.length} members</span>
							</div>
							<div className="space-y-3">
								{beneficiary.familyMembers.map((member, index) => (
									<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div className="flex items-center space-x-3">
											<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
												<User className="w-4 h-4 text-primary" />
											</div>
											<div>
												<p className="font-medium text-gray-900">{member.name}</p>
												<p className="text-sm text-gray-500">{member.relationship} • {member.age} years old</p>
											</div>
										</div>
										<div className="text-sm text-gray-600">{member.occupation}</div>
									</div>
								))}
							</div>
						</div>

						{/* Income Information */}
						<Card
							title="Income Information"
							description="Financial details and income bracket"
							status="verified"
							type="information"
							data={{
								monthlyIncome: `₱${beneficiary.monthlyIncome.toLocaleString()}`,
								incomeSource: beneficiary.incomeSource,
								incomeBracket: beneficiary.incomeBracket
							}}
							className="bg-white shadow-md"
						/>

						{/* Current Housing Situation */}
						<div className="bg-white shadow-md rounded-xl p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Current Housing Situation</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Status:</span>
										<span className="text-sm font-medium">{beneficiary.currentHousing.status}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Monthly Rent:</span>
										<span className="text-sm font-medium">₱{beneficiary.currentHousing.monthlyRent.toLocaleString()}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Condition:</span>
										<span className="text-sm font-medium">{beneficiary.currentHousing.condition}</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Years Lived:</span>
										<span className="text-sm font-medium">{beneficiary.currentHousing.yearsLived} years</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Address:</span>
										<span className="text-sm font-medium">{beneficiary.currentHousing.address}</span>
									</div>
								</div>
							</div>
						</div>

						{/* Housing Needs Assessment */}
						<div className="bg-white shadow-md rounded-xl p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Housing Needs Assessment</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Preferred Location:</span>
										<span className="text-sm font-medium">{beneficiary.housingNeeds.preferredLocation}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Preferred Size:</span>
										<span className="text-sm font-medium">{beneficiary.housingNeeds.preferredSize}</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Preferred Type:</span>
										<span className="text-sm font-medium">{beneficiary.housingNeeds.preferredType}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Urgency:</span>
										<span className="text-sm font-medium">{beneficiary.housingNeeds.urgency}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{activeTab === 'housing' && (
					<div className="space-y-6">
						{/* Housing Assignment Status */}
						<div className="bg-white shadow-md rounded-xl p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">Housing Assignment</h3>
								{beneficiary.assignedHousingUnit ? (
									<span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
										Assigned
									</span>
								) : (
									<span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
										Not Assigned
									</span>
								)}
							</div>
							
							{beneficiary.assignedHousingUnit ? (
								<div className="space-y-4">
									{/* Project Information */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">Project Name:</span>
												<span className="text-sm font-medium">{beneficiary.assignedHousingUnit.projectName}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">Unit Number:</span>
												<span className="text-sm font-medium">{beneficiary.assignedHousingUnit.unitNumber}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">Type:</span>
												<span className="text-sm font-medium">{beneficiary.assignedHousingUnit.type}</span>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">Size:</span>
												<span className="text-sm font-medium">{beneficiary.assignedHousingUnit.size}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">Floor Area:</span>
												<span className="text-sm font-medium">{beneficiary.assignedHousingUnit.floorArea}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">Status:</span>
												<span className="text-sm font-medium">{beneficiary.assignedHousingUnit.status}</span>
											</div>
										</div>
									</div>
									
									{/* Address */}
									<div className="p-3 bg-gray-50 rounded-lg">
										<div className="flex items-start space-x-2">
											<MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
											<div>
												<p className="text-sm font-medium text-gray-900">Unit Address</p>
												<p className="text-sm text-gray-600">{beneficiary.assignedHousingUnit.address}</p>
											</div>
										</div>
									</div>
									
									{/* Assignment Details */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="flex items-center space-x-2">
											<Calendar className="w-4 h-4 text-gray-500" />
											<div>
												<p className="text-sm font-medium text-gray-900">Assigned Date</p>
												<p className="text-sm text-gray-600">{new Date(beneficiary.assignedHousingUnit.assignedDate).toLocaleDateString()}</p>
											</div>
										</div>
										{beneficiary.assignedHousingUnit.occupancyDate && (
											<div className="flex items-center space-x-2">
												<Home className="w-4 h-4 text-gray-500" />
												<div>
													<p className="text-sm font-medium text-gray-900">Occupancy Date</p>
													<p className="text-sm text-gray-600">{new Date(beneficiary.assignedHousingUnit.occupancyDate).toLocaleDateString()}</p>
												</div>
											</div>
										)}
									</div>
								</div>
							) : (
								<div className="text-center py-8">
									<Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
									<p className="text-gray-600 mb-4">No housing unit assigned yet</p>
									<Button variant="purple" className="flex items-center gap-2">
										<Award className="w-4 h-4" />
										Assign Housing Unit
									</Button>
								</div>
							)}
						</div>

						{/* Housing Timeline */}
						{beneficiary.assignedHousingUnit && (
							<div className="bg-white shadow-md rounded-xl p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">Housing Timeline</h3>
								<div className="space-y-4">
									<div className="flex items-start space-x-3">
										<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
											<CheckCircle className="w-4 h-4 text-blue-600" />
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<span className="font-medium text-gray-900">Application Approved</span>
												<span className="text-sm text-gray-500">{new Date(beneficiary.approvalDate || beneficiary.applicationDate).toLocaleDateString()}</span>
											</div>
											<p className="text-sm text-gray-600">Beneficiary approved for housing assistance</p>
										</div>
									</div>
									<div className="flex items-start space-x-3">
										<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
											<Award className="w-4 h-4 text-green-600" />
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<span className="font-medium text-gray-900">Unit Assigned</span>
												<span className="text-sm text-gray-500">{new Date(beneficiary.assignedHousingUnit.assignedDate).toLocaleDateString()}</span>
											</div>
											<p className="text-sm text-gray-600">Housing unit {beneficiary.assignedHousingUnit.unitNumber} assigned</p>
										</div>
									</div>
									{beneficiary.assignedHousingUnit.occupancyDate && (
										<div className="flex items-start space-x-3">
											<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
												<Home className="w-4 h-4 text-purple-600" />
											</div>
											<div className="flex-1">
												<div className="flex items-center justify-between">
													<span className="font-medium text-gray-900">Unit Occupied</span>
													<span className="text-sm text-gray-500">{new Date(beneficiary.assignedHousingUnit.occupancyDate).toLocaleDateString()}</span>
												</div>
												<p className="text-sm text-gray-600">Beneficiary moved into assigned unit</p>
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				)}

				{activeTab === 'documents' && (
					<div className="space-y-6">
						{/* Document Verification Cards */}
						{Object.entries(beneficiary.documents || {}).map(([key, doc]: [string, any]) => (
							<Card
								key={key}
								title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
								description={`${doc.filename} • ${doc.size}`}
								status={doc.status === 'approved' ? 'verified' : doc.status === 'rejected' ? 'rejected' : 'pending'}
								type="document"
								data={{
									filename: doc.filename,
									uploadedAt: new Date(doc.uploadedAt).toLocaleDateString(),
									size: doc.size
								}}
								onView={() => console.log(`View document: ${key}`)}
								remarks={beneficiary.compliance?.documentChecklist?.[key]?.remarks}
								verifiedBy={beneficiary.compliance?.documentChecklist?.[key]?.verifiedBy}
								verifiedAt={beneficiary.compliance?.documentChecklist?.[key]?.verifiedAt}
								className="bg-white shadow-md"
							/>
						))}
					</div>
				)}

				{activeTab === 'history' && (
					<div className="space-y-6">
						{/* Status Timeline */}
						<div className="bg-white shadow-md rounded-xl p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
							<div className="space-y-4">
								{beneficiary.compliance?.statusHistory?.map((entry: any, index: number) => (
									<div key={index} className="flex items-start space-x-3">
										<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
											<Clock className="w-4 h-4 text-primary" />
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<span className="font-medium text-gray-900">{entry.status}</span>
												<span className="text-sm text-gray-500">{entry.date} {entry.time}</span>
											</div>
											<p className="text-sm text-gray-600">Changed by: {entry.changedBy}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Remarks */}
						<div className="bg-white shadow-md rounded-xl p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Remarks</h3>
							<div className="space-y-3">
								{beneficiary.compliance?.remarks?.map((remark: any, index: number) => (
									<div key={index} className="p-3 bg-gray-50 rounded-lg">
										<div className="flex items-center justify-between mb-1">
											<span className="text-sm font-medium text-gray-900">{remark.author}</span>
											<span className="text-xs text-gray-500">{remark.date}</span>
										</div>
										<p className="text-sm text-gray-700">{remark.text}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HousingBeneficiaryProfile;
