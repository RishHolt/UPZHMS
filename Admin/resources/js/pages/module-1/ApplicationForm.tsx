import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { AlertCircle, MapPin, User, Calendar, Building, Upload, ArrowLeft, ArrowRight, Signature } from "lucide-react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Header from "../../components/Header";
import Timeline from "../../components/Timeline";

// TypeScript interface for the application form
interface ZoningApplicationFormData {
  // Personal Information
  applicantName: string;
  applicantAddress: string;
  contactNumber: string;
  emailAddress: string;
  idType: string;
  idNumber: string;
  idImage: File | null;
  
  // Location Information
  propertyAddress: string;
  barangay: string;
  lotNumber: string;
  blockNumber: string;
  pcsPsdPcnBsdCad: string;
  titleNumber: string;
  landArea: string;
  buildingArea: string;
  numberOfFloors: string;
  
  // Project Information
  isBusiness: boolean;
  isBuilding: boolean;
  proposedZone: string;
  natureOfApplication: string;
  natureOfApplicationOther: string;
  projectDescription: string;
  lotOwner: string;
  tctNumber: string;
  taxDecNumber: string;
  lotArea: string;
  yardArea: string;
  totalFloorArea: string;
  businessArea: string;
  productsManufactured: string;
  sizeOfEmployment: string;
  pendingLitigation: string;
  
  // Documents
  documents: {
    lotPlanVicinityMap: File | null;
    leaseContractConsent: File | null;
    tctLandTitle: File | null;
    taxDeclaration: File | null;
    realPropertyTaxReceipts: File | null;
    barangayClearanceResolution: File | null;
    barangayConstructionPermit: File | null;
    architecturalPlan: File | null;
  };
  
  // Additional Information
  remarks: string;
  signature: File | null;
  declaration: boolean;
}

const ZoningApplicationForm = () => {
  const [formData, setFormData] = useState<ZoningApplicationFormData>({
    applicantName: "",
    applicantAddress: "",
    contactNumber: "",
    emailAddress: "",
    idType: "",
    idNumber: "",
    idImage: null,
    propertyAddress: "",
    barangay: "",
    lotNumber: "",
    blockNumber: "",
    pcsPsdPcnBsdCad: "",
    titleNumber: "",
    landArea: "",
    buildingArea: "",
    numberOfFloors: "",
    isBusiness: false,
    isBuilding: false,
    proposedZone: "",
    natureOfApplication: "",
    natureOfApplicationOther: "",
    projectDescription: "",
    lotOwner: "",
    tctNumber: "",
    taxDecNumber: "",
    lotArea: "",
    yardArea: "",
    totalFloorArea: "",
    businessArea: "",
    productsManufactured: "",
    sizeOfEmployment: "",
    pendingLitigation: "",
    documents: {
      lotPlanVicinityMap: null,
      leaseContractConsent: null,
      tctLandTitle: null,
      taxDeclaration: null,
      realPropertyTaxReceipts: null,
      barangayClearanceResolution: null,
      barangayConstructionPermit: null,
      architecturalPlan: null,
    },
    remarks: "",
    signature: null,
    declaration: false,
  });

  const [errors, setErrors] = useState<Partial<ZoningApplicationFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Timeline steps configuration
  const timelineSteps = [
    { id: 1, title: "Reminders", description: "Application Guidelines" },
    { id: 2, title: "Applicant Info", description: "Applicant Details" },
    { id: 3, title: "Location Info", description: "Location Details" },
    { id: 4, title: "Project Info", description: "Project Details" },
    { id: 5, title: "Documents", description: "Required Documents" },
    { id: 6, title: "Signature", description: "Digital Signature" },
    { id: 7, title: "Declaration", description: "Final Declaration" },
  ];

  const handleInputChange = (field: keyof ZoningApplicationFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleDocumentUpload = (documentType: keyof ZoningApplicationFormData['documents'], file: File | null) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file
      }
    }));
  };

  const handleSignatureUpload = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      signature: file
    }));
  };

  const handleIdImageUpload = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      idImage: file
    }));
  };

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < timelineSteps.length) {
      setCompletedSteps(prev => [...prev.filter(step => step !== currentStep), currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setCompletedSteps(prev => prev.filter(step => step !== currentStep - 1));
    }
  };


  const validateStep = (step: number): boolean => {
    const newErrors: Partial<ZoningApplicationFormData> = {};

    switch (step) {
      case 2: // Applicant Information
        // if (!formData.applicantName.trim()) newErrors.applicantName = "Applicant name is required";
        // if (!formData.applicantAddress.trim()) newErrors.applicantAddress = "Applicant address is required";
        // if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
        // if (!formData.emailAddress.trim()) newErrors.emailAddress = "Email address is required";
        // if (!formData.idType.trim()) newErrors.idType = "ID type is required";
        // if (!formData.idNumber.trim()) newErrors.idNumber = "ID number is required";
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.emailAddress && !emailRegex.test(formData.emailAddress)) {
          newErrors.emailAddress = "Please enter a valid email address";
        }

        // Phone validation
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (formData.contactNumber && !phoneRegex.test(formData.contactNumber)) {
          newErrors.contactNumber = "Please enter a valid contact number";
        }
        break;

      case 3: // Location Information
        // if (!formData.propertyAddress.trim()) newErrors.propertyAddress = "Property address is required";
        // if (!formData.barangay.trim()) newErrors.barangay = "Barangay is required";
        // if (!formData.titleNumber.trim()) newErrors.titleNumber = "Title number is required";
        // if (!formData.landArea.trim()) newErrors.landArea = "Land area is required";
        break;

      case 4: // Project Information
        // if (!formData.proposedZone.trim()) newErrors.proposedZone = "Proposed zone is required";
        // if (!formData.natureOfApplication.trim()) newErrors.natureOfApplication = "Nature of application is required";
        // if (!formData.projectDescription.trim()) newErrors.projectDescription = "Project description is required";
        // if (!formData.lotOwner.trim()) newErrors.lotOwner = "Lot owner is required";
        break;

      case 6: // Signature
        // if (!formData.signature) newErrors.signature = "Signature is required" as any;
        break;

      case 7: // Declaration
        // if (!formData.declaration) newErrors.declaration = "You must agree to the declaration" as any;
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ZoningApplicationFormData> = {};

    // Required fields validation - COMMENTED OUT FOR TESTING
    // if (!formData.applicantName.trim()) newErrors.applicantName = "Applicant name is required";
    // if (!formData.applicantAddress.trim()) newErrors.applicantAddress = "Applicant address is required";
    // if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    // if (!formData.emailAddress.trim()) newErrors.emailAddress = "Email address is required";
    // if (!formData.idType.trim()) newErrors.idType = "ID type is required";
    // if (!formData.idNumber.trim()) newErrors.idNumber = "ID number is required";
    // if (!formData.propertyAddress.trim()) newErrors.propertyAddress = "Property address is required";
    // if (!formData.barangay.trim()) newErrors.barangay = "Barangay is required";
    // if (!formData.titleNumber.trim()) newErrors.titleNumber = "Title number is required";
    // if (!formData.landArea.trim()) newErrors.landArea = "Land area is required";
    // if (!formData.currentZoning.trim()) newErrors.currentZoning = "Current zoning is required";
    // if (!formData.proposedZoning.trim()) newErrors.proposedZoning = "Proposed zoning is required";
    // if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
    // if (!formData.businessType.trim()) newErrors.businessType = "Business type is required";
    // if (!formData.signature) newErrors.signature = "Signature is required" as any;
    // if (!formData.declaration) newErrors.declaration = "You must agree to the declaration" as any;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.emailAddress && !emailRegex.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (formData.contactNumber && !phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid contact number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    prevStep();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate application ID
      const applicationId = `ZCA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      // Here you would typically send the data to your backend API
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate back to applications list with success message
      router.visit('/zoning/applications');
      
    } catch (error) {
      console.error("Error submitting application:", error);
      // Handle error (show error message, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.visit('/zoning/applications');
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Online Application Reminders
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3 mb-6">
              <AlertCircle className="text-blue-600 mt-0.5" size={24} />
              <div>
                <h2 className="text-xl font-semibold text-blue-800 mb-3">Online Application Reminders</h2>
                <div className="text-sm text-blue-700 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-800">1.</span>
                    <div>
                      <strong>Complete Information:</strong> Fill up all required fields accurately. Only applications with complete requirements will be processed.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-800">2.</span>
                    <div>
                      <strong>Document Upload:</strong> Upload all required documents in PDF format. Ensure documents are clear and readable.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-800">3.</span>
                    <div>
                      <strong>Digital Signature:</strong> By submitting this form, you are providing your digital signature and agreeing to the terms and conditions.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-800">4.</span>
                    <div>
                      <strong>Authorization:</strong> Only the registered/rightful owner or their designated representative with proper authorization may submit applications.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-800">5.</span>
                    <div>
                      <strong>Follow-up:</strong> You will receive email notifications about your application status. Direct follow-up with Caloocan City Government employees is not required.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">What to Expect:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Application will be reviewed within 5-7 business days</li>
                <li>• You will receive email updates on your application status</li>
                <li>• Required documents must be uploaded before submission</li>
                <li>• Digital signature is legally binding</li>
              </ul>
            </div>
          </div>
        );

      case 2: // Personal Information
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-primary" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Applicant Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name of Applicant/Owner/Firm/Corporation"
                value={formData.applicantName}
                onChange={(e) => handleInputChange('applicantName', e.target.value)}
                error={errors.applicantName}
                // required
                placeholder="Enter name of applicant/owner/firm/corporation"
              />
              
              <Input
                label="Contact Number"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                error={errors.contactNumber}
                // required
                placeholder="e.g., +63 912 345 6789"
              />
              
              <Input
                label="Email Address"
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                error={errors.emailAddress}
                // required
                placeholder="your.email@example.com"
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  ID Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.idType}
                  onChange={(e) => handleInputChange('idType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Select ID Type</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="Passport">Passport</option>
                  <option value="SSS ID">SSS ID</option>
                  <option value="GSIS ID">GSIS ID</option>
                  <option value="PhilHealth ID">PhilHealth ID</option>
                  <option value="Postal ID">Postal ID</option>
                  <option value="TIN ID">TIN ID</option>
                  <option value="Voter's ID">Voter's ID</option>
                  <option value="Senior Citizen ID">Senior Citizen ID</option>
                  <option value="Other">Other</option>
                </select>
                {errors.idType && <p className="text-red-600 text-xs">{errors.idType}</p>}
              </div>
              
              <Input
                label="ID Number"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                error={errors.idNumber}
                // required
                placeholder="Enter your ID number"
              />
            </div>
            
            {/* ID Image Upload */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Image <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleIdImageUpload(e.target.files?.[0] || null)}
                  className="hidden"
                  id="idImage"
                />
                <label htmlFor="idImage" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-sm text-gray-600">
                    {formData.idImage ? (
                      <div>
                        <p className="text-green-600 font-medium">✓ {formData.idImage.name}</p>
                        <p className="text-gray-500">Click to change image</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Upload ID Image</p>
                        <p className="text-gray-500">Click to select or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 10MB</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              {errors.idImage && <p className="text-red-600 text-xs mt-1">{String(errors.idImage)}</p>}
            </div>
            
            <div className="mt-4">
              <TextArea
                label="Home/Office Address"
                value={formData.applicantAddress}
                onChange={(e) => handleInputChange('applicantAddress', e.target.value)}
                error={errors.applicantAddress}
                // required
                rows={3}
                placeholder="Enter home/office address"
              />
            </div>
          </div>
        );

      case 3: // Location Information
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="text-primary" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Location Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Property Address"
                value={formData.propertyAddress}
                onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                error={errors.propertyAddress}
                // required
                placeholder="Enter property address"
              />
              
              <Input
                label="Barangay"
                value={formData.barangay}
                onChange={(e) => handleInputChange('barangay', e.target.value)}
                error={errors.barangay}
                // required
                placeholder="Enter barangay"
              />
              
              <Input
                label="Lot Number"
                value={formData.lotNumber}
                onChange={(e) => handleInputChange('lotNumber', e.target.value)}
                placeholder="Enter lot number"
              />
              
              <Input
                label="Block Number"
                value={formData.blockNumber}
                onChange={(e) => handleInputChange('blockNumber', e.target.value)}
                placeholder="Enter block number"
              />
              
              <Input
                label="PCS/PSD/PCN/BSD/CAD# (Optional)"
                value={formData.pcsPsdPcnBsdCad}
                onChange={(e) => handleInputChange('pcsPsdPcnBsdCad', e.target.value)}
                placeholder="Leave blank if submitting new application"
              />
              
            </div>
          </div>
        );

      case 4: // Project Information
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Building className="text-primary" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Project Information</h2>
            </div>
            
            {/* Business/Building Selection */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Project Type</h3>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isBusiness}
                    onChange={(e) => {
                      handleInputChange('isBusiness', e.target.checked);
                      if (e.target.checked) {
                        handleInputChange('isBuilding', false);
                      }
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Business</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isBuilding}
                    onChange={(e) => {
                      handleInputChange('isBuilding', e.target.checked);
                      if (e.target.checked) {
                        handleInputChange('isBusiness', false);
                      }
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Building</span>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Proposed Zone <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.proposedZone}
                  onChange={(e) => handleInputChange('proposedZone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Select Proposed Zone</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Mixed-Use">Mixed-Use</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Institutional">Institutional</option>
                  <option value="Open Space">Open Space</option>
                  <option value="Other">Other</option>
                </select>
                {errors.proposedZone && <p className="text-red-600 text-xs">{errors.proposedZone}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nature of Application <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.natureOfApplication}
                  onChange={(e) => handleInputChange('natureOfApplication', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Select Nature of Application</option>
                  <option value="new construction">New Construction</option>
                  <option value="repair/renovation/expansion/addition">Repair/Renovation/Expansion/Addition</option>
                  <option value="reconsideration">Reconsideration</option>
                  <option value="new business">New Business</option>
                  <option value="existing business">Existing Business</option>
                  <option value="others">Others</option>
                </select>
                {errors.natureOfApplication && <p className="text-red-600 text-xs">{errors.natureOfApplication}</p>}
              </div>
            </div>
            
            {/* Others text area - appears when "others" is selected */}
            {formData.natureOfApplication === 'others' && (
              <div className="mt-4">
                <TextArea
                  label="Please specify"
                  value={formData.natureOfApplicationOther}
                  onChange={(e) => handleInputChange('natureOfApplicationOther', e.target.value)}
                  rows={2}
                  placeholder="Please specify the nature of application"
                />
              </div>
            )}
            
            <div className="mt-4">
              <TextArea
                label="Project Description"
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                error={errors.projectDescription}
                rows={3}
                placeholder="Describe your project in detail"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Lot Owner"
                value={formData.lotOwner}
                onChange={(e) => handleInputChange('lotOwner', e.target.value)}
                error={errors.lotOwner}
                placeholder="Enter lot owner name"
              />
              
              <Input
                label="TCT No."
                value={formData.tctNumber}
                onChange={(e) => handleInputChange('tctNumber', e.target.value)}
                placeholder="Enter TCT number"
              />
              
              <Input
                label="Tax Dec No."
                value={formData.taxDecNumber}
                onChange={(e) => handleInputChange('taxDecNumber', e.target.value)}
                placeholder="Enter tax declaration number"
              />
              
              <Input
                label="Lot Area (sq.m.)"
                value={formData.lotArea}
                onChange={(e) => handleInputChange('lotArea', e.target.value)}
                placeholder="Enter lot area in square meters"
              />
              
              <Input
                label="Yard Area (sq.m.)"
                value={formData.yardArea}
                onChange={(e) => handleInputChange('yardArea', e.target.value)}
                placeholder="Enter yard area in square meters"
              />
              
              <Input
                label="Total Floor Area (sq.m.)"
                value={formData.totalFloorArea}
                onChange={(e) => handleInputChange('totalFloorArea', e.target.value)}
                placeholder="Enter total floor area in square meters"
              />
            </div>
            
            {/* Business Area - appears when Business checkbox is selected */}
            {formData.isBusiness && (
              <div className="mt-4">
                <Input
                  label="Business Area (sq.m.)"
                  value={formData.businessArea}
                  onChange={(e) => handleInputChange('businessArea', e.target.value)}
                  placeholder="Enter business area in square meters"
                />
              </div>
            )}
            
            {/* Industrial zone specific fields */}
            {formData.proposedZone === 'Industrial' && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextArea
                  label="Products to be manufactured or stored"
                  value={formData.productsManufactured}
                  onChange={(e) => handleInputChange('productsManufactured', e.target.value)}
                  rows={3}
                  placeholder="Describe products to be manufactured or stored"
                />
                
                <Input
                  label="Size of Employment (estimate)"
                  value={formData.sizeOfEmployment}
                  onChange={(e) => handleInputChange('sizeOfEmployment', e.target.value)}
                  placeholder="Estimated number of employees"
                />
              </div>
            )}
            
            <div className="mt-4">
              <TextArea
                label="Is there any pending, litigation, criminal, administrative case or otherwise, relative to the subject activity/project?"
                value={formData.pendingLitigation}
                onChange={(e) => handleInputChange('pendingLitigation', e.target.value)}
                rows={3}
                placeholder="Please provide details of any pending cases or litigation"
              />
            </div>
          </div>
        );

      case 5: // Document Upload
        // Determine if application is for Business or Building
        const isBusinessApplication = formData.isBusiness;
        const isBuildingApplication = formData.isBuilding;
        
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Upload className="text-primary" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Required Documents</h2>
              </div>
              
              {/* Application Type Display */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Your application is for:</span>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isBusinessApplication 
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}>
                    {isBusinessApplication ? '✓ Business' : 'Business'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isBuildingApplication 
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}>
                    {isBuildingApplication ? '✓ Building' : 'Building'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Basic Requirements */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">BASIC REQUIREMENTS:</h3>
              
              <div className="space-y-3">
                {isBusinessApplication && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 bg-green-100 p-2 rounded border border-green-300">BUSINESS</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Lot plan with vicinity map certified by Geodetic Engineer</div>
                      <div>• Lease contract/consent from property owner</div>
                      <div>• Certified true copy of TCT (land title)</div>
                      <div>• Photocopy of Tax Declaration (land/bldg)</div>
                      <div>• Photocopy of Real property tax receipts</div>
                      <div>• Barangay Clearance/Barangay Resolution</div>
                      <div>• Additional Requirements (to be notified after preliminary evaluation)</div>
                    </div>
                  </div>
                )}
                
                {isBuildingApplication && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 bg-green-100 p-2 rounded border border-green-300">BUILDING</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Lot plan with vicinity map certified by Geodetic Engineer</div>
                      <div>• Certified true copy of TCT (land title)</div>
                      <div>• Photocopy of Tax Declaration (land/bldg)</div>
                      <div>• Photocopy of Real property tax receipts</div>
                      <div>• Barangay Construction Permit/Clearance</div>
                      <div>• Architectural Plan/Site Development Plan (1 set)</div>
                    </div>
                  </div>
                )}
                
                {!isBusinessApplication && !isBuildingApplication && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Please select either Business or Building above to see the required documents.</p>
                  </div>
                )}
              </div>
              
            </div>
            
            {/* File Upload Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Documents:</h3>
              
              {/* Upload Guidelines */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">Document Upload Guidelines</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Upload clear, legible documents</li>
                  <li>• Documents should be on a white background</li>
                  <li>• File formats: JPG, PNG, or PDF</li>
                  <li>• Maximum file size: 5MB per document</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Common Documents */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Lot plan with vicinity map certified by Geodetic Engineer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentUpload('lotPlanVicinityMap', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                  {formData.documents.lotPlanVicinityMap && (
                    <p className="text-xs text-green-600">✓ {formData.documents.lotPlanVicinityMap.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Certified true copy of TCT (land title) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentUpload('tctLandTitle', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                  {formData.documents.tctLandTitle && (
                    <p className="text-xs text-green-600">✓ {formData.documents.tctLandTitle.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Photocopy of Tax Declaration (land/bldg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentUpload('taxDeclaration', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                  {formData.documents.taxDeclaration && (
                    <p className="text-xs text-green-600">✓ {formData.documents.taxDeclaration.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Photocopy of Real property tax receipts <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentUpload('realPropertyTaxReceipts', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                  {formData.documents.realPropertyTaxReceipts && (
                    <p className="text-xs text-green-600">✓ {formData.documents.realPropertyTaxReceipts.name}</p>
                  )}
                </div>

                {/* Business-specific Documents */}
                {isBusinessApplication && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Lease contract/consent from property owner <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleDocumentUpload('leaseContractConsent', e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    />
                    {formData.documents.leaseContractConsent && (
                      <p className="text-xs text-green-600">✓ {formData.documents.leaseContractConsent.name}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {isBusinessApplication ? 'Barangay Clearance/Barangay Resolution' : 'Barangay Construction Permit/Clearance'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentUpload(isBusinessApplication ? 'barangayClearanceResolution' : 'barangayConstructionPermit', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                  {(formData.documents.barangayClearanceResolution || formData.documents.barangayConstructionPermit) && (
                    <p className="text-xs text-green-600">✓ {(formData.documents.barangayClearanceResolution || formData.documents.barangayConstructionPermit)?.name}</p>
                  )}
                </div>

                {/* Building-specific Documents */}
                {isBuildingApplication && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">• Additional Requirements (to be notified after preliminary evaluation)
                      Architectural Plan/Site Development Plan (1 set) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleDocumentUpload('architecturalPlan', e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    />
                    {formData.documents.architecturalPlan && (
                      <p className="text-xs text-green-600">✓ {formData.documents.architecturalPlan.name}</p>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        );

      case 6: // Signature Upload
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Signature className="text-primary" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Digital Signature</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Signature Requirements</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Upload a clear image of your handwritten signature</li>
                  <li>• Signature should be on a white background</li>
                  <li>• File formats: JPG, PNG, or PDF</li>
                  <li>• Maximum file size: 5MB</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Signature <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleSignatureUpload(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
                {formData.signature && (
                  <p className="text-xs text-green-600">✓ {formData.signature.name}</p>
                )}
                {errors.signature && <p className="text-red-600 text-xs">{String(errors.signature)}</p>}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Legal Notice:</strong> By uploading your signature, you acknowledge that this digital signature 
                  has the same legal effect as a handwritten signature and you agree to be bound by the terms and conditions 
                  of this application.
                </p>
              </div>
            </div>
          </div>
        );

      case 7: // Declaration
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-primary" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Final Declaration</h2>
            </div>
            
            <div className="space-y-6">
              <TextArea
                label="Additional Remarks (Optional)"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows={4}
                placeholder="Any additional information or special requests"
              />
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Declaration Statement</h3>
                <div className="text-sm text-gray-700 space-y-3">
                  <p>
                    I hereby declare that the information provided in this application is true and correct to the best of my knowledge. 
                    I understand that any false information may result in the rejection of this application and may subject me to legal action.
                  </p>
                  <p>
                    I acknowledge that I have read and understood all the requirements and guidelines for this zoning clearance application. 
                    I agree to comply with all applicable laws and regulations.
                  </p>
                  <p>
                    I understand that this digital signature has the same legal effect as a handwritten signature and I agree to be bound 
                    by the terms and conditions of this application.
                  </p>
                </div>
                
                <div className="mt-6 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="declaration"
                    checked={formData.declaration}
                    onChange={(e) => handleInputChange('declaration', e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="declaration" className="text-sm text-gray-700">
                    <strong>I agree to the above declaration</strong> and understand that by submitting this form, 
                    I am providing my digital signature and agreeing to all terms and conditions.
                  </label>
                </div>
                {errors.declaration && <p className="text-red-600 text-xs mt-2">{errors.declaration}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-background shadow-md p-6 rounded-xl size-full">
      <div className="flex flex-row justify-between items-center pb-6">
        <Header 
          title="Zoning Clearance Application Form" 
          subtext={`Step ${currentStep} of ${timelineSteps.length}: ${timelineSteps[currentStep - 1]?.title}`}
        />
        <Button variant="red" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      {/* Timeline */}
      <Timeline 
        steps={timelineSteps} 
        currentStep={currentStep} 
        completedSteps={completedSteps} 
      />

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto pr-2">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
        <Button 
          type="button" 
          variant="red" 
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentStep === timelineSteps.length ? (
            <Button 
              type="button" 
              variant="green" 
              onClick={() => handleSubmit({} as React.FormEvent)}
              disabled={isSubmitting}
              className="min-w-[140px] flex items-center gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          ) : (
            <Button 
              type="button" 
              variant="blue" 
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZoningApplicationForm;