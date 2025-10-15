export const allBeneficiaries = [
	{
		id: "HBR-2025-001",
		applicantName: "Maria Santos",
		contactNumber: "+63 912 345 6789",
		emailAddress: "maria.santos@email.com",
		idType: "Driver's License",
		idNumber: "DL123456789",
		applicantAddress: "123 Rizal Street, Brgy. San Antonio, Caloocan City",
		barangay: "Brgy. San Antonio",
		yearsOfResidency: 8,
		dateOfBirth: "1985-03-15",
		placeOfBirth: "Caloocan City",
		civilStatus: "Married",
		spouseName: "Juan Santos",
		spouseOccupation: "Construction Worker",
		familyMembers: [
			{ name: "Maria Santos", age: 39, relationship: "Self", occupation: "Housewife" },
			{ name: "Juan Santos", age: 42, relationship: "Spouse", occupation: "Construction Worker" },
			{ name: "Ana Santos", age: 16, relationship: "Daughter", occupation: "Student" },
			{ name: "Pedro Santos", age: 14, relationship: "Son", occupation: "Student" },
			{ name: "Luna Santos", age: 8, relationship: "Daughter", occupation: "Student" }
		],
		monthlyIncome: 15000,
		incomeSource: "Spouse's salary",
		incomeBracket: "Low Income",
		currentHousing: {
			status: "Renting",
			monthlyRent: 5000,
			condition: "Poor",
			address: "123 Rizal Street, Brgy. San Antonio, Caloocan City",
			yearsLived: 5
		},
		housingNeeds: {
			preferredLocation: "Near school and market",
			preferredSize: "2-3 bedrooms",
			preferredType: "Single-family house",
			accessibilityNeeds: "None",
			urgency: "High"
		},
		eligibility: {
			residencyYears: 8,
			familySize: 5,
			incomeBracket: "Low Income",
			hasValidId: true,
			hasProofOfIncome: true,
			hasBarangayClearance: true,
			hasBirthCertificates: true,
			hasMarriageCertificate: true,
			meetsAllCriteria: true
		},
		documents: {
			validId: { filename: "id_maria.jpg", uploadedAt: "2025-10-01", size: "2.3 MB", status: "approved" },
			proofOfIncome: { filename: "income_maria.pdf", uploadedAt: "2025-10-01", size: "1.8 MB", status: "approved" },
			barangayClearance: { filename: "brgy_clearance_maria.pdf", uploadedAt: "2025-10-01", size: "1.5 MB", status: "approved" },
			birthCertificates: { filename: "birth_certs_maria.pdf", uploadedAt: "2025-10-01", size: "3.2 MB", status: "approved" },
			marriageCertificate: { filename: "marriage_cert_maria.pdf", uploadedAt: "2025-10-01", size: "1.1 MB", status: "approved" },
			householdPicture: { filename: "household_maria.jpg", uploadedAt: "2025-10-01", size: "4.5 MB", status: "approved" }
		},
		status: "Approved",
		assignedHousingUnit: {
			projectName: "Caloocan Housing Project Phase 1",
			unitNumber: "CHP-001-15",
			address: "Block 15, Unit 15, Caloocan Housing Project, Brgy. San Antonio",
			type: "Single-family house",
			size: "2 bedrooms, 1 living room, 1 kitchen, 1 bathroom",
			floorArea: "45 sqm",
			assignedDate: "2025-10-15",
			status: "Awarded"
		},
		applicationDate: "2025-10-01",
		verificationDate: "2025-10-05",
		approvalDate: "2025-10-10",
		remarks: "Eligible for housing assistance. Family of 5 with low income bracket.",
		compliance: {
			overallStatus: "approved",
			completionPercentage: 100,
			informationChecklist: {
				personalInfo: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-05", remarks: "Complete and accurate" },
				familyInfo: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-05", remarks: "Family composition verified" },
				incomeInfo: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-05", remarks: "Income documentation verified" },
				housingNeeds: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-05", remarks: "Housing needs assessed" }
			},
			documentChecklist: {
				validId: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-05", remarks: "Valid government ID" },
				proofOfIncome: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-05", remarks: "Income verified" },
				barangayClearance: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-05", remarks: "Clearance valid" },
				birthCertificates: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-05", remarks: "All birth certificates provided" },
				marriageCertificate: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-05", remarks: "Marriage certificate verified" },
				householdPicture: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-05", remarks: "Household picture clear" }
			},
			remarks: [
				{ id: 1, author: "Housing Officer", text: "Application meets all eligibility criteria.", date: "2025-10-05", type: "success" },
				{ id: 2, author: "Housing Officer", text: "Family qualifies for low-income housing assistance.", date: "2025-10-05", type: "info" }
			],
			statusHistory: [
				{ status: "Applied", changedBy: "System", date: "2025-10-01", time: "09:00 AM" },
				{ status: "Under Review", changedBy: "Housing Officer", date: "2025-10-02", time: "10:30 AM" },
				{ status: "Verified", changedBy: "Housing Officer", date: "2025-10-05", time: "02:15 PM" },
				{ status: "Approved", changedBy: "Housing Officer", date: "2025-10-10", time: "11:00 AM" },
				{ status: "Awarded", changedBy: "Housing Officer", date: "2025-10-15", time: "09:30 AM" }
			]
		}
	},
	{
		id: "HBR-2025-002",
		applicantName: "Pedro Gonzales",
		contactNumber: "+63 917 234 5678",
		emailAddress: "pedro.gonzales@email.com",
		idType: "SSS ID",
		idNumber: "SSS987654321",
		applicantAddress: "456 Bonifacio Avenue, Brgy. Central, Caloocan City",
		barangay: "Brgy. Central",
		yearsOfResidency: 12,
		dateOfBirth: "1978-07-22",
		placeOfBirth: "Manila",
		civilStatus: "Widowed",
		spouseName: "",
		spouseOccupation: "",
		familyMembers: [
			{ name: "Pedro Gonzales", age: 46, relationship: "Self", occupation: "Jeepney Driver" },
			{ name: "Maria Gonzales", age: 20, relationship: "Daughter", occupation: "College Student" },
			{ name: "Jose Gonzales", age: 18, relationship: "Son", occupation: "High School Student" }
		],
		monthlyIncome: 12000,
		incomeSource: "Jeepney driving",
		incomeBracket: "Low Income",
		currentHousing: {
			status: "Renting",
			monthlyRent: 4500,
			condition: "Very Poor",
			address: "456 Bonifacio Avenue, Brgy. Central, Caloocan City",
			yearsLived: 3
		},
		housingNeeds: {
			preferredLocation: "Near transport terminal",
			preferredSize: "2 bedrooms",
			preferredType: "Single-family house",
			accessibilityNeeds: "None",
			urgency: "High"
		},
		eligibility: {
			residencyYears: 12,
			familySize: 3,
			incomeBracket: "Low Income",
			hasValidId: true,
			hasProofOfIncome: true,
			hasBarangayClearance: true,
			hasBirthCertificates: true,
			hasMarriageCertificate: false,
			meetsAllCriteria: true
		},
		documents: {
			validId: { filename: "id_pedro.jpg", uploadedAt: "2025-10-02", size: "2.1 MB", status: "approved" },
			proofOfIncome: { filename: "income_pedro.pdf", uploadedAt: "2025-10-02", size: "1.5 MB", status: "approved" },
			barangayClearance: { filename: "brgy_clearance_pedro.pdf", uploadedAt: "2025-10-02", size: "1.3 MB", status: "approved" },
			birthCertificates: { filename: "birth_certs_pedro.pdf", uploadedAt: "2025-10-02", size: "2.8 MB", status: "approved" },
			marriageCertificate: { filename: "marriage_cert_pedro.pdf", uploadedAt: "2025-10-02", size: "0.9 MB", status: "pending" },
			householdPicture: { filename: "household_pedro.jpg", uploadedAt: "2025-10-02", size: "4.2 MB", status: "approved" }
		},
		status: "Under Review",
		assignedHousingUnit: null,
		applicationDate: "2025-10-02",
		verificationDate: "2025-10-06",
		approvalDate: null,
		remarks: "Missing marriage certificate. Widow's affidavit provided instead.",
		compliance: {
			overallStatus: "under_review",
			completionPercentage: 85,
			informationChecklist: {
				personalInfo: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-06", remarks: "Complete" },
				familyInfo: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-06", remarks: "Family composition verified" },
				incomeInfo: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-06", remarks: "Income verified" },
				housingNeeds: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Pending assessment" }
			},
			documentChecklist: {
				validId: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-06", remarks: "Valid ID" },
				proofOfIncome: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-06", remarks: "Income verified" },
				barangayClearance: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-06", remarks: "Clearance valid" },
				birthCertificates: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-06", remarks: "Birth certificates provided" },
				marriageCertificate: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Widow's affidavit provided instead" },
				householdPicture: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-06", remarks: "Household picture clear" }
			},
			remarks: [
				{ id: 1, author: "Housing Officer", text: "Most documents verified. Waiting for marriage certificate or widow's affidavit approval.", date: "2025-10-06", type: "warning" }
			],
			statusHistory: [
				{ status: "Applied", changedBy: "System", date: "2025-10-02", time: "10:00 AM" },
				{ status: "Under Review", changedBy: "Housing Officer", date: "2025-10-06", time: "09:00 AM" }
			]
		}
	},
	{
		id: "HBR-2025-003",
		applicantName: "Ana Rodriguez",
		contactNumber: "+63 918 345 6789",
		emailAddress: "ana.rodriguez@email.com",
		idType: "TIN ID",
		idNumber: "TIN123456789",
		applicantAddress: "789 Magsaysay Road, Brgy. Norte, Caloocan City",
		barangay: "Brgy. Norte",
		yearsOfResidency: 6,
		dateOfBirth: "1990-11-08",
		placeOfBirth: "Caloocan City",
		civilStatus: "Single",
		spouseName: "",
		spouseOccupation: "",
		familyMembers: [
			{ name: "Ana Rodriguez", age: 34, relationship: "Self", occupation: "Factory Worker" },
			{ name: "Rosa Rodriguez", age: 65, relationship: "Mother", occupation: "Retired" },
			{ name: "Miguel Rodriguez", age: 12, relationship: "Son", occupation: "Student" }
		],
		monthlyIncome: 18000,
		incomeSource: "Factory work",
		incomeBracket: "Low Income",
		currentHousing: {
			status: "Renting",
			monthlyRent: 6000,
			condition: "Fair",
			address: "789 Magsaysay Road, Brgy. Norte, Caloocan City",
			yearsLived: 4
		},
		housingNeeds: {
			preferredLocation: "Near factory",
			preferredSize: "2 bedrooms",
			preferredType: "Single-family house",
			accessibilityNeeds: "Wheelchair accessible (for mother)",
			urgency: "Medium"
		},
		eligibility: {
			residencyYears: 6,
			familySize: 3,
			incomeBracket: "Low Income",
			hasValidId: true,
			hasProofOfIncome: true,
			hasBarangayClearance: true,
			hasBirthCertificates: true,
			hasMarriageCertificate: false,
			meetsAllCriteria: true
		},
		documents: {
			validId: { filename: "id_ana.jpg", uploadedAt: "2025-10-03", size: "2.4 MB", status: "approved" },
			proofOfIncome: { filename: "income_ana.pdf", uploadedAt: "2025-10-03", size: "2.1 MB", status: "approved" },
			barangayClearance: { filename: "brgy_clearance_ana.pdf", uploadedAt: "2025-10-03", size: "1.7 MB", status: "approved" },
			birthCertificates: { filename: "birth_certs_ana.pdf", uploadedAt: "2025-10-03", size: "3.5 MB", status: "approved" },
			marriageCertificate: { filename: "marriage_cert_ana.pdf", uploadedAt: "2025-10-03", size: "0.8 MB", status: "approved" },
			householdPicture: { filename: "household_ana.jpg", uploadedAt: "2025-10-03", size: "4.8 MB", status: "approved" }
		},
		status: "Verified",
		assignedHousingUnit: null,
		applicationDate: "2025-10-03",
		verificationDate: "2025-10-07",
		approvalDate: null,
		remarks: "Single mother with elderly parent. Special consideration for accessibility needs.",
		compliance: {
			overallStatus: "verified",
			completionPercentage: 95,
			informationChecklist: {
				personalInfo: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-07", remarks: "Complete" },
				familyInfo: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-07", remarks: "Family composition verified" },
				incomeInfo: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-07", remarks: "Income verified" },
				housingNeeds: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-07", remarks: "Accessibility needs noted" }
			},
			documentChecklist: {
				validId: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-07", remarks: "Valid ID" },
				proofOfIncome: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-07", remarks: "Income verified" },
				barangayClearance: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-07", remarks: "Clearance valid" },
				birthCertificates: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-07", remarks: "Birth certificates provided" },
				marriageCertificate: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-07", remarks: "Single parent certificate provided" },
				householdPicture: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-07", remarks: "Household picture clear" }
			},
			remarks: [
				{ id: 1, author: "Housing Officer", text: "All documents verified. Special consideration for accessibility needs.", date: "2025-10-07", type: "info" },
				{ id: 2, author: "Housing Officer", text: "Single mother with elderly parent - priority case.", date: "2025-10-07", type: "info" }
			],
			statusHistory: [
				{ status: "Applied", changedBy: "System", date: "2025-10-03", time: "11:00 AM" },
				{ status: "Under Review", changedBy: "Housing Officer", date: "2025-10-04", time: "09:30 AM" },
				{ status: "Verified", changedBy: "Housing Officer", date: "2025-10-07", time: "02:45 PM" }
			]
		}
	},
	{
		id: "HBR-2025-004",
		applicantName: "Roberto Martinez",
		contactNumber: "+63 919 456 7890",
		emailAddress: "roberto.martinez@email.com",
		idType: "Voter's ID",
		idNumber: "VOTER123456789",
		applicantAddress: "321 Jose Abad Santos St, Brgy. Sur, Caloocan City",
		barangay: "Brgy. Sur",
		yearsOfResidency: 15,
		dateOfBirth: "1975-05-12",
		placeOfBirth: "Caloocan City",
		civilStatus: "Married",
		spouseName: "Carmen Martinez",
		spouseOccupation: "Vendor",
		familyMembers: [
			{ name: "Roberto Martinez", age: 49, relationship: "Self", occupation: "Construction Worker" },
			{ name: "Carmen Martinez", age: 45, relationship: "Spouse", occupation: "Vendor" },
			{ name: "Luis Martinez", age: 22, relationship: "Son", occupation: "College Student" },
			{ name: "Elena Martinez", age: 19, relationship: "Daughter", occupation: "College Student" },
			{ name: "Carlos Martinez", age: 15, relationship: "Son", occupation: "High School Student" },
			{ name: "Sofia Martinez", age: 10, relationship: "Daughter", occupation: "Elementary Student" }
		],
		monthlyIncome: 20000,
		incomeSource: "Construction work + vending",
		incomeBracket: "Low Income",
		currentHousing: {
			status: "Renting",
			monthlyRent: 7000,
			condition: "Poor",
			address: "321 Jose Abad Santos St, Brgy. Sur, Caloocan City",
			yearsLived: 8
		},
		housingNeeds: {
			preferredLocation: "Near school and market",
			preferredSize: "3-4 bedrooms",
			preferredType: "Single-family house",
			accessibilityNeeds: "None",
			urgency: "High"
		},
		eligibility: {
			residencyYears: 15,
			familySize: 6,
			incomeBracket: "Low Income",
			hasValidId: true,
			hasProofOfIncome: true,
			hasBarangayClearance: true,
			hasBirthCertificates: true,
			hasMarriageCertificate: true,
			meetsAllCriteria: true
		},
		documents: {
			validId: { filename: "id_roberto.jpg", uploadedAt: "2025-10-04", size: "2.2 MB", status: "approved" },
			proofOfIncome: { filename: "income_roberto.pdf", uploadedAt: "2025-10-04", size: "2.3 MB", status: "approved" },
			barangayClearance: { filename: "brgy_clearance_roberto.pdf", uploadedAt: "2025-10-04", size: "1.6 MB", status: "approved" },
			birthCertificates: { filename: "birth_certs_roberto.pdf", uploadedAt: "2025-10-04", size: "4.1 MB", status: "approved" },
			marriageCertificate: { filename: "marriage_cert_roberto.pdf", uploadedAt: "2025-10-04", size: "1.2 MB", status: "approved" },
			householdPicture: { filename: "household_roberto.jpg", uploadedAt: "2025-10-04", size: "5.2 MB", status: "approved" }
		},
		status: "Applied",
		assignedHousingUnit: null,
		applicationDate: "2025-10-04",
		verificationDate: null,
		approvalDate: null,
		remarks: "Large family of 6. High priority for housing assistance.",
		compliance: {
			overallStatus: "pending",
			completionPercentage: 0,
			informationChecklist: {
				personalInfo: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Pending review" },
				familyInfo: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Pending review" },
				incomeInfo: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Pending review" },
				housingNeeds: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Pending review" }
			},
			documentChecklist: {
				validId: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Pending review" },
				proofOfIncome: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Pending review" },
				barangayClearance: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Pending review" },
				birthCertificates: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Pending review" },
				marriageCertificate: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Pending review" },
				householdPicture: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Pending review" }
			},
			remarks: [
				{ id: 1, author: "System", text: "Application submitted and awaiting initial review.", date: "2025-10-04", type: "info" }
			],
			statusHistory: [
				{ status: "Applied", changedBy: "System", date: "2025-10-04", time: "02:00 PM" }
			]
		}
	},
	{
		id: "HBR-2025-005",
		applicantName: "Carmen Reyes",
		contactNumber: "+63 920 567 8901",
		emailAddress: "carmen.reyes@email.com",
		idType: "PhilHealth ID",
		idNumber: "PH123456789",
		applicantAddress: "654 Luna Street, Brgy. East, Caloocan City",
		barangay: "Brgy. East",
		yearsOfResidency: 10,
		dateOfBirth: "1982-09-25",
		placeOfBirth: "Caloocan City",
		civilStatus: "Married",
		spouseName: "Luis Reyes",
		spouseOccupation: "Security Guard",
		familyMembers: [
			{ name: "Carmen Reyes", age: 42, relationship: "Self", occupation: "Housewife" },
			{ name: "Luis Reyes", age: 45, relationship: "Spouse", occupation: "Security Guard" },
			{ name: "Maria Reyes", age: 18, relationship: "Daughter", occupation: "College Student" },
			{ name: "Jose Reyes", age: 16, relationship: "Son", occupation: "High School Student" }
		],
		monthlyIncome: 16000,
		incomeSource: "Spouse's salary",
		incomeBracket: "Low Income",
		currentHousing: {
			status: "Renting",
			monthlyRent: 5500,
			condition: "Poor",
			address: "654 Luna Street, Brgy. East, Caloocan City",
			yearsLived: 6
		},
		housingNeeds: {
			preferredLocation: "Near school",
			preferredSize: "2-3 bedrooms",
			preferredType: "Single-family house",
			accessibilityNeeds: "None",
			urgency: "Medium"
		},
		eligibility: {
			residencyYears: 10,
			familySize: 4,
			incomeBracket: "Low Income",
			hasValidId: true,
			hasProofOfIncome: true,
			hasBarangayClearance: true,
			hasBirthCertificates: true,
			hasMarriageCertificate: true,
			meetsAllCriteria: true
		},
		documents: {
			validId: { filename: "id_carmen.jpg", uploadedAt: "2025-10-05", size: "2.0 MB", status: "approved" },
			proofOfIncome: { filename: "income_carmen.pdf", uploadedAt: "2025-10-05", size: "1.9 MB", status: "approved" },
			barangayClearance: { filename: "brgy_clearance_carmen.pdf", uploadedAt: "2025-10-05", size: "1.4 MB", status: "approved" },
			birthCertificates: { filename: "birth_certs_carmen.pdf", uploadedAt: "2025-10-05", size: "3.8 MB", status: "approved" },
			marriageCertificate: { filename: "marriage_cert_carmen.pdf", uploadedAt: "2025-10-05", size: "1.0 MB", status: "approved" },
			householdPicture: { filename: "household_carmen.jpg", uploadedAt: "2025-10-05", size: "4.6 MB", status: "approved" }
		},
		status: "Rejected",
		assignedHousingUnit: null,
		applicationDate: "2025-09-28",
		verificationDate: "2025-10-01",
		approvalDate: null,
		remarks: "Income exceeds maximum threshold for low-income housing assistance.",
		compliance: {
			overallStatus: "rejected",
			completionPercentage: 60,
			informationChecklist: {
				personalInfo: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-01", remarks: "Complete" },
				familyInfo: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-01", remarks: "Family composition verified" },
				incomeInfo: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-01", remarks: "Income exceeds threshold" },
				housingNeeds: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Not applicable - rejected" }
			},
			documentChecklist: {
				validId: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-01", remarks: "Valid ID" },
				proofOfIncome: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-01", remarks: "Income exceeds maximum threshold" },
				barangayClearance: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-01", remarks: "Clearance valid" },
				birthCertificates: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-01", remarks: "Birth certificates provided" },
				marriageCertificate: { verified: true, verifiedBy: "Housing Officer", verifiedAt: "2025-10-01", remarks: "Marriage certificate verified" },
				householdPicture: { verified: false, verifiedBy: null, verifiedAt: null, remarks: "Not required - rejected" }
			},
			remarks: [
				{ id: 1, author: "Housing Officer", text: "Application rejected - income exceeds maximum threshold for low-income housing assistance.", date: "2025-10-01", type: "error" },
				{ id: 2, author: "Housing Officer", text: "Family income of ₱16,000 exceeds the ₱15,000 maximum threshold.", date: "2025-10-01", type: "error" }
			],
			statusHistory: [
				{ status: "Applied", changedBy: "System", date: "2025-09-28", time: "08:00 AM" },
				{ status: "Under Review", changedBy: "Housing Officer", date: "2025-09-29", time: "09:00 AM" },
				{ status: "Rejected", changedBy: "Housing Officer", date: "2025-10-01", time: "10:30 AM" }
			]
		}
	}
];

export const housingUnits = [
	{
		id: "CHP-001-15",
		projectName: "Caloocan Housing Project Phase 1",
		address: "Block 15, Unit 15, Caloocan Housing Project, Brgy. San Antonio",
		type: "Single-family house",
		size: "2 bedrooms, 1 living room, 1 kitchen, 1 bathroom",
		floorArea: "45 sqm",
		status: "Awarded",
		assignedBeneficiary: "Maria Santos",
		assignedDate: "2025-10-15",
		occupancyDate: null
	},
	{
		id: "CHP-002-08",
		projectName: "Caloocan Housing Project Phase 1",
		address: "Block 8, Unit 8, Caloocan Housing Project, Brgy. Central",
		type: "Single-family house",
		size: "2 bedrooms, 1 living room, 1 kitchen, 1 bathroom",
		floorArea: "45 sqm",
		status: "Available",
		assignedBeneficiary: null,
		assignedDate: null,
		occupancyDate: null
	},
	{
		id: "CHP-003-22",
		projectName: "Caloocan Housing Project Phase 1",
		address: "Block 22, Unit 22, Caloocan Housing Project, Brgy. Norte",
		type: "Single-family house",
		size: "3 bedrooms, 1 living room, 1 kitchen, 1 bathroom",
		floorArea: "60 sqm",
		status: "Available",
		assignedBeneficiary: null,
		assignedDate: null,
		occupancyDate: null
	},
	{
		id: "CHP-004-12",
		projectName: "Caloocan Housing Project Phase 2",
		address: "Block 12, Unit 12, Caloocan Housing Project Phase 2, Brgy. Sur",
		type: "Single-family house",
		size: "2 bedrooms, 1 living room, 1 kitchen, 1 bathroom",
		floorArea: "45 sqm",
		status: "Under Construction",
		assignedBeneficiary: null,
		assignedDate: null,
		occupancyDate: null
	}
];
