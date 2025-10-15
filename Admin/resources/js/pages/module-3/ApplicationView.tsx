import { useState, useEffect, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import { ArrowLeft, User, Home, DollarSign, FileText, CheckCircle, XCircle, Clock, AlertCircle, Edit, Upload, History, Download, Eye, MessageSquare, UserCheck, Home as HomeIcon, Award } from "lucide-react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Header from "../../components/Header";
import Modal from "../../components/Modal";
import Card from "../../components/Card";
import { allBeneficiaries } from "./mock/Beneficiary";

const HousingApplicationView = () => {
	// Get the ID from Inertia props
	const { props } = usePage();
	const id = (props as any).applicationId;
	
	const [activeModal, setActiveModal] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'history'>('overview');
	const [documentVerificationModal, setDocumentVerificationModal] = useState<{
		isOpen: boolean;
		documentType: string;
		action: 'verify' | 'reject';
	}>({
		isOpen: false,
		documentType: '',
		action: 'verify'
	});
	const [verificationRemarks, setVerificationRemarks] = useState('');
	
	// Refs for navigation
	const documentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	
	// Form states for each section
	const [applicantData, setApplicantData] = useState({
		applicantName: '',
		contactNumber: '',
		emailAddress: '',
		idType: '',
		idNumber: '',
		applicantAddress: '',
		barangay: '',
		yearsOfResidency: '',
		dateOfBirth: '',
		placeOfBirth: '',
		civilStatus: '',
		spouseName: '',
		spouseOccupation: ''
	});
	
	const [familyData, setFamilyData] = useState({
		familyMembers: [] as any[]
	});
	
	const [incomeData, setIncomeData] = useState({
		monthlyIncome: '',
		incomeSource: '',
		incomeBracket: ''
	});
	
	const [housingData, setHousingData] = useState({
		currentHousing: {} as any,
		housingNeeds: {} as any,
		eligibility: {} as any
	});
	
	// Find the application by ID
	const application = allBeneficiaries.find(app => app.id === id);
	
	// If application not found, show error message
	if (!application) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="bg-white p-8 rounded-lg shadow-md text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-4">Application Not Found</h1>
					<p className="text-gray-600 mb-4">
						The application with ID "{id}" could not be found.
					</p>
					<Button
						variant="blue"
						onClick={() => router.get('/housing/applications')}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Applications
					</Button>
				</div>
			</div>
		);
	}
	
	// Initialize form data when application is found
	useEffect(() => {
		if (application) {
			setApplicantData({
				applicantName: application.applicantName || '',
				contactNumber: application.contactNumber || '',
				emailAddress: application.emailAddress || '',
				idType: application.idType || '',
				idNumber: application.idNumber || '',
				applicantAddress: application.applicantAddress || '',
				barangay: application.barangay || '',
				yearsOfResidency: application.yearsOfResidency?.toString() || '',
				dateOfBirth: application.dateOfBirth || '',
				placeOfBirth: application.placeOfBirth || '',
				civilStatus: application.civilStatus || '',
				spouseName: application.spouseName || '',
				spouseOccupation: application.spouseOccupation || ''
			});
			
			setFamilyData({
				familyMembers: application.familyMembers || []
			});
			
			setIncomeData({
				monthlyIncome: application.monthlyIncome?.toString() || '',
				incomeSource: application.incomeSource || '',
				incomeBracket: application.incomeBracket || ''
			});
			
			setHousingData({
				currentHousing: application.currentHousing || {},
				housingNeeds: application.housingNeeds || {},
				eligibility: application.eligibility || {}
			});
		}
	}, [application]);
	
	const handleApplicantChange = (field: string, value: string) => {
		setApplicantData(prev => ({ ...prev, [field]: value }));
	};
	
	const handleDocumentVerification = (documentType: string, action: 'verify' | 'reject') => {
		setDocumentVerificationModal({
			isOpen: true,
			documentType,
			action
		});
		setVerificationRemarks('');
	};

	const handleVerificationSubmit = () => {
		console.log(`Document ${documentVerificationModal.documentType} ${documentVerificationModal.action}ed with remarks: ${verificationRemarks}`);
		
		setDocumentVerificationModal({
			isOpen: false,
			documentType: '',
			action: 'verify'
		});
		setVerificationRemarks('');
	};

	const handleVerificationCancel = () => {
		setDocumentVerificationModal({
			isOpen: false,
			documentType: '',
			action: 'verify'
		});
		setVerificationRemarks('');
	};

	// Navigation functions
	const getUnverifiedItems = (): Array<{ type: string; key: string; ref: HTMLDivElement | null }> => {
		if (!application?.compliance) return [];
		
		const unverifiedItems: Array<{ type: string; key: string; ref: HTMLDivElement | null }> = [];
		
		// Check document verification only
		if (application?.compliance?.documentChecklist) {
			Object.entries(application?.compliance?.documentChecklist).forEach(([key, doc]: [string, any]) => {
				if (!doc.verified) {
					unverifiedItems.push({ type: 'document', key, ref: documentRefs.current[key] });
				}
			});
		}
		
		return unverifiedItems;
	};

	const scrollToNextUnverified = () => {
		const unverifiedItems = getUnverifiedItems();
		if (unverifiedItems.length > 0) {
			const nextItem = unverifiedItems[0];
			if (nextItem.ref) {
				nextItem.ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Approved':
			case 'Awarded':
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

	const StatusIcon = getStatusIcon(application.status);

	return (
		<div className="flex flex-col bg-background shadow-md p-6 rounded-xl size-full">
			{/* Header */}
			<div className="flex flex-row justify-between items-center pb-6">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-4">
						<Button 
							variant="red" 
							onClick={() => router.visit('/housing/applications')}
							className="flex items-center gap-2"
						>
							<ArrowLeft size={16} />
							Back
						</Button>
						<Header 
							title={`Application ${application.id}`} 
							subtext="View application details"
						/>
					</div>
					
					{/* Status Badge */}
					<div className={`px-4 py-2 rounded-full text-sm font-medium border-2 ${
						application.status === 'Approved' || application.status === 'Awarded' ? 'bg-green-50 text-green-800 border-green-300' :
						application.status === 'Rejected' ? 'bg-red-50 text-red-800 border-red-300' :
						application.status === 'Under Review' ? 'bg-blue-50 text-blue-800 border-blue-300' :
						'bg-yellow-50 text-yellow-800 border-yellow-300'
					}`}>
						{application.status}
					</div>
				</div>
			</div>

			{/* Tab Navigation */}
			<div className="border-b border-gray-200 mb-6">
				<nav className="flex justify-between items-center">
					<div className="flex space-x-8">
						<button
							onClick={() => setActiveTab('overview')}
							className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
								activeTab === 'overview'
									? 'border-primary text-primary'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<FileText size={18} />
							Overview
						</button>
						<button
							onClick={() => setActiveTab('documents')}
							className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
								activeTab === 'documents'
									? 'border-primary text-primary'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Upload size={18} />
							Documents
						</button>
					</div>
					<button
						onClick={() => setActiveTab('history')}
						className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
							activeTab === 'history'
								? 'border-primary text-primary'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						<History size={18} />
						History
					</button>
				</nav>
			</div>

			{/* Content */}
			{activeTab === 'overview' && (
				<div className="space-y-6">
					{/* Applicant Information */}
					<Card
						title="Applicant Information"
						description="Personal details and contact information"
						status="verified"
						type="applicant"
						data={{
							applicantName: applicantData.applicantName,
							contactNumber: applicantData.contactNumber,
							emailAddress: applicantData.emailAddress,
							barangay: applicantData.barangay,
							yearsOfResidency: `${applicantData.yearsOfResidency} years`,
							civilStatus: applicantData.civilStatus
						}}
					/>

					{/* Family Composition */}
					<div className="bg-white shadow-md rounded-xl p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">Family Composition</h3>
							<span className="text-sm text-gray-500">{familyData.familyMembers.length} members</span>
						</div>
						<div className="space-y-3">
							{familyData.familyMembers.map((member, index) => (
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

					{/* Income Details */}
					<Card
						title="Income Details"
						description="Financial information and income bracket"
						status="verified"
						type="information"
						data={{
							monthlyIncome: `₱${parseInt(incomeData.monthlyIncome).toLocaleString()}`,
							incomeSource: incomeData.incomeSource,
							incomeBracket: incomeData.incomeBracket
						}}
					/>

					{/* Current Housing Situation */}
					<div className="bg-white shadow-md rounded-xl p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Current Housing Situation</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="text-sm text-gray-600">Status:</span>
									<span className="text-sm font-medium">{housingData.currentHousing.status}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-gray-600">Monthly Rent:</span>
									<span className="text-sm font-medium">₱{housingData.currentHousing.monthlyRent?.toLocaleString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-gray-600">Condition:</span>
									<span className="text-sm font-medium">{housingData.currentHousing.condition}</span>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="text-sm text-gray-600">Years Lived:</span>
									<span className="text-sm font-medium">{housingData.currentHousing.yearsLived} years</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-gray-600">Address:</span>
									<span className="text-sm font-medium">{housingData.currentHousing.address}</span>
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
									<span className="text-sm font-medium">{housingData.housingNeeds.preferredLocation}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-gray-600">Preferred Size:</span>
									<span className="text-sm font-medium">{housingData.housingNeeds.preferredSize}</span>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="text-sm text-gray-600">Preferred Type:</span>
									<span className="text-sm font-medium">{housingData.housingNeeds.preferredType}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-gray-600">Urgency:</span>
									<span className="text-sm font-medium">{housingData.housingNeeds.urgency}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Assigned Housing Unit */}
					{application.assignedHousingUnit && (
						<div className="bg-white shadow-md rounded-xl p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Housing Unit</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Project:</span>
										<span className="text-sm font-medium">{application.assignedHousingUnit.projectName}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Unit Number:</span>
										<span className="text-sm font-medium">{application.assignedHousingUnit.unitNumber}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Type:</span>
										<span className="text-sm font-medium">{application.assignedHousingUnit.type}</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Size:</span>
										<span className="text-sm font-medium">{application.assignedHousingUnit.size}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Floor Area:</span>
										<span className="text-sm font-medium">{application.assignedHousingUnit.floorArea}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-600">Assigned Date:</span>
										<span className="text-sm font-medium">{new Date(application.assignedHousingUnit.assignedDate).toLocaleDateString()}</span>
									</div>
								</div>
							</div>
							<div className="mt-4 p-3 bg-gray-50 rounded-lg">
								<p className="text-sm text-gray-700">
									<strong>Address:</strong> {application.assignedHousingUnit.address}
								</p>
							</div>
						</div>
					)}
				</div>
			)}

				{activeTab === 'documents' && (
					<div className="space-y-6">
						{/* Document Verification Cards */}
						{Object.entries(application.documents || {}).map(([key, doc]: [string, any]) => (
							<div key={key} ref={el => documentRefs.current[key] = el}>
								<Card
									title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
									description={`${doc.filename} • ${doc.size}`}
									status={doc.status === 'approved' ? 'verified' : doc.status === 'rejected' ? 'rejected' : 'pending'}
									type="document"
									data={{
										filename: doc.filename,
										uploadedAt: new Date(doc.uploadedAt).toLocaleDateString(),
										size: doc.size
									}}
									onVerify={() => handleDocumentVerification(key, 'verify')}
									onReject={() => handleDocumentVerification(key, 'reject')}
									onView={() => console.log(`View document: ${key}`)}
									remarks={application.compliance?.documentChecklist?.[key]?.remarks}
									verifiedBy={application.compliance?.documentChecklist?.[key]?.verifiedBy}
									verifiedAt={application.compliance?.documentChecklist?.[key]?.verifiedAt}
									className="bg-white shadow-md"
								/>
							</div>
						))}

						{/* Navigation to next unverified item */}
						{getUnverifiedItems().length > 0 && (
							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<AlertCircle className="w-5 h-5 text-yellow-600" />
										<span className="text-sm text-yellow-800">
											{getUnverifiedItems().length} document(s) pending verification
										</span>
									</div>
									<Button variant="orange" onClick={scrollToNextUnverified}>
										Go to Next
									</Button>
								</div>
							</div>
						)}
					</div>
				)}

				{activeTab === 'history' && (
					<div className="space-y-6">
						{/* Status Timeline */}
						<div className="bg-white shadow-md rounded-xl p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
							<div className="space-y-4">
								{application.compliance?.statusHistory?.map((entry: any, index: number) => (
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
								{application.compliance?.remarks?.map((remark: any, index: number) => (
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

		{/* Document Verification Modal */}
		<Modal
			isOpen={documentVerificationModal.isOpen}
			onClose={handleVerificationCancel}
			title={`${documentVerificationModal.action === 'verify' ? 'Verify' : 'Reject'} Document`}
			size="md"
		>
			<div className="space-y-4">
				<p className="text-sm text-gray-600">
					{documentVerificationModal.action === 'verify' ? 'Verify' : 'Reject'} document: <strong>{documentVerificationModal.documentType}</strong>
				</p>
				<TextArea
					label="Remarks"
					value={verificationRemarks}
					onChange={(e) => setVerificationRemarks(e.target.value)}
					placeholder="Enter remarks for this action..."
					rows={3}
				/>
				<div className="flex justify-end space-x-2">
					<Button variant="red" onClick={handleVerificationCancel}>
						Cancel
					</Button>
					<Button variant="green" onClick={handleVerificationSubmit}>
						{documentVerificationModal.action === 'verify' ? 'Verify' : 'Reject'}
					</Button>
				</div>
			</div>
		</Modal>
		</div>
	);
};

export default HousingApplicationView;
