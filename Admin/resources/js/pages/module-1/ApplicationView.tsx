import { useState, useEffect, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import { ArrowLeft, MapPin, User, Building, Calendar, CheckCircle, XCircle, Clock, AlertCircle, Edit, FileText, Upload, History, Download, Eye, FileIcon, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Header from "../../components/Header";
import Modal from "../../components/Modal";
import Card from "../../components/Card";
import { allApplications } from "./mock/Application";

const ApplicationView = () => {
  // Get the ID from Inertia props
  const { props } = usePage();
  const id = (props as any).applicationId;
  
  // Debug logging
  console.log('ApplicationView - ID from props:', id);
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
    applicantAddress: ''
  });
  
  const [locationData, setLocationData] = useState({
    propertyAddress: '',
    barangay: '',
    lotNumber: '',
    blockNumber: '',
    pcsPsdPcnBsdCad: ''
  });
  
  const [projectData, setProjectData] = useState({
    isBusiness: false,
    isBuilding: false,
    proposedZone: '',
    natureOfApplication: '',
    projectDescription: '',
    lotOwner: '',
    tctNumber: '',
    taxDecNumber: '',
    lotArea: '',
    yardArea: '',
    totalFloorArea: '',
    businessArea: '',
    productsManufactured: '',
    sizeOfEmployment: '',
    pendingLitigation: ''
  });
  
  // Find the application by ID
  const application = allApplications.find(app => app.id === id);
  
  // Debug logging
  console.log('Available application IDs:', allApplications.map(app => app.id));
  console.log('Looking for ID:', id);
  console.log('Found application:', application);
  
  // If application not found, show error message
  if (!application) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Not Found</h1>
          <p className="text-gray-600 mb-4">
            The application with ID "{id}" could not be found.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Available IDs: {allApplications.map(app => app.id).join(', ')}
          </p>
          <Button
            variant="blue"
            onClick={() => router.get('/zoning/applications')}
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
        applicantAddress: application.applicantAddress || ''
      });
      
      setLocationData({
        propertyAddress: application.propertyAddress || '',
        barangay: application.barangay || '',
        lotNumber: application.lotNumber || '',
        blockNumber: application.blockNumber || '',
        pcsPsdPcnBsdCad: application.pcsPsdPcnBsdCad || ''
      });
      
      setProjectData({
        isBusiness: application.isBusiness || false,
        isBuilding: application.isBuilding || false,
        proposedZone: application.proposedZone || '',
        natureOfApplication: application.natureOfApplication || '',
        projectDescription: application.projectDescription || '',
        lotOwner: application.lotOwner || '',
        tctNumber: application.tctNumber || '',
        taxDecNumber: application.taxDecNumber || '',
        lotArea: application.lotArea || '',
        yardArea: application.yardArea || '',
        totalFloorArea: application.totalFloorArea || '',
        businessArea: application.businessArea || '',
        productsManufactured: application.productsManufactured || '',
        sizeOfEmployment: application.sizeOfEmployment || '',
        pendingLitigation: application.pendingLitigation || ''
      });
    }
  }, [application]);
  
  const handleApplicantChange = (field: string, value: string) => {
    setApplicantData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleLocationChange = (field: string, value: string) => {
    setLocationData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleProjectChange = (field: string, value: string | boolean) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
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
    // Here you would typically update the application data
    // For now, we'll just close the modal and show a success message
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


  const getUnverifiedCount = () => {
    return getUnverifiedItems().length;
  };
  
  if (!application) {
    return (
      <div className="flex flex-col bg-background shadow-md p-6 rounded-xl size-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Application Not Found</h2>
            <p className="text-gray-600 mb-4">The application with ID "{id}" could not be found.</p>
            <Button variant="blue" onClick={() => router.visit('/zoning/applications')}>
              Back to Applications
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col bg-background shadow-md p-6 rounded-xl size-full">
      {/* Header */}
      <div className="flex flex-row justify-between items-center pb-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Button 
              variant="red" 
              onClick={() => router.visit('/zoning/applications')}
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
            application.status === 'Approved' ? 'bg-green-50 text-green-800 border-green-300' :
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

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
        {/* Applicant Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="text-primary" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Applicant Information</h2>
            </div>
            <Button 
              variant="blue" 
              onClick={() => setActiveModal('applicant')}
              className="flex items-center gap-2"
            >
              <Edit size={16} />
              Edit
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name of Applicant/Owner/Firm/Corporation</label>
              <p className="text-gray-900">{application.applicantName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <p className="text-gray-900">{application.contactNumber}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <p className="text-gray-900">{application.emailAddress}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
              <p className="text-gray-900">{application.idType}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
              <p className="text-gray-900">{application.idNumber}</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Home/Office Address</label>
              <p className="text-gray-900">{application.applicantAddress}</p>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="text-primary" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Location Information</h2>
            </div>
            <Button 
              variant="blue" 
              onClick={() => setActiveModal('location')}
              className="flex items-center gap-2"
            >
              <Edit size={16} />
              Edit
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
              <p className="text-gray-900">{application.propertyAddress}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
              <p className="text-gray-900">{application.barangay}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
              <p className="text-gray-900">{application.lotNumber}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Block Number</label>
              <p className="text-gray-900">{application.blockNumber}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PCS/PSD/PCN/BSD/CAD#</label>
              <p className="text-gray-900">{application.pcsPsdPcnBsdCad}</p>
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building className="text-primary" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Project Information</h2>
            </div>
            <Button 
              variant="blue" 
              onClick={() => setActiveModal('project')}
              className="flex items-center gap-2"
            >
              <Edit size={16} />
              Edit
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <div className="flex gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application.isBusiness ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {application.isBusiness ? '✓ Business' : 'Business'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application.isBuilding ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {application.isBuilding ? '✓ Building' : 'Building'}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Zone</label>
              <p className="text-gray-900">{application.proposedZone}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nature of Application</label>
              <p className="text-gray-900 capitalize">{application.natureOfApplication.replace(/-/g, ' ')}</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
              <p className="text-gray-900">{application.projectDescription}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lot Owner</label>
              <p className="text-gray-900">{application.lotOwner}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TCT No.</label>
              <p className="text-gray-900">{application.tctNumber}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Dec No.</label>
              <p className="text-gray-900">{application.taxDecNumber}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lot Area (sq.m.)</label>
              <p className="text-gray-900">{application.lotArea}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yard Area (sq.m.)</label>
              <p className="text-gray-900">{application.yardArea}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Floor Area (sq.m.)</label>
              <p className="text-gray-900">{application.totalFloorArea}</p>
            </div>
            
            {application.isBusiness && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Area (sq.m.)</label>
                <p className="text-gray-900">{application.businessArea}</p>
              </div>
            )}
            
            {application.proposedZone === 'Industrial' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Products to be manufactured or stored</label>
                  <p className="text-gray-900">{application.productsManufactured}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size of Employment (estimate)</label>
                  <p className="text-gray-900">{application.sizeOfEmployment}</p>
                </div>
              </>
            )}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pending Litigation</label>
              <p className="text-gray-900">{application.pendingLitigation}</p>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Application Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
              <p className="text-gray-900 font-mono">{application.id}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Submitted</label>
              <p className="text-gray-900">{new Date(application.dateSubmitted).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <p className="text-gray-900">{application.remarks}</p>
            </div>
          </div>
        </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Documents Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Uploaded Documents</h2>
              <div className="flex items-center gap-3">
                <Button 
                  variant="green" 
                  className="flex items-center gap-2"
                  onClick={() => router.get('/review-evaluation')}
                >
                  <CheckCircle size={16} />
                  Review & Evaluation
                </Button>
                <Button variant="blue" className="flex items-center gap-2">
                  <Download size={16} />
                  Download All
                </Button>
              </div>
            </div>

            {/* Document Status Filter */}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium">
                All Documents
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                Approved
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                Pending
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                Rejected
              </button>
            </div>

            {/* Documents Grid */}
            {application.documents && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(application.documents).map(([key, doc]: [string, any]) => (
                  <div key={key} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileIcon className="text-primary" size={24} />
                        <div>
                          <h3 className="font-medium text-gray-800 text-sm">
                            {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                          </h3>
                          <p className="text-xs text-gray-500">{doc.size}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                        doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 truncate">{doc.filename}</p>
                    <p className="text-xs text-gray-500 mb-3">Uploaded: {doc.uploadedAt}</p>
                    
                    <div className="flex gap-2">
                      <Button variant="blue" className="flex-1 flex items-center justify-center gap-1 text-xs py-1">
                        <Eye size={14} />
                        View
                      </Button>
                      <Button variant="green" className="flex-1 flex items-center justify-center gap-1 text-xs py-1">
                        <Download size={14} />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!application.documents && (
              <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Documents Uploaded</h3>
                <p className="text-gray-600">No documents have been uploaded for this application yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Compliance Tab - Moved to Review & Evaluation page */}
        {false && (
          <div className="space-y-6">
            {/* Sticky Quick Actions Bar */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>
                      {Object.values(application?.compliance?.documentChecklist || {}).filter((doc: any) => doc.verified).length} verified
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-yellow-600" />
                    <span>{getUnverifiedCount()} pending</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <XCircle size={16} className="text-red-600" />
                    <span>
                      {Object.values(application?.compliance?.documentChecklist || {}).filter((doc: any) => doc.status === 'rejected').length} rejected
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="green" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      // Handle approve application
                      console.log('Approve application');
                    }}
                  >
                    <ThumbsUp size={16} />
                    Approve Application
                  </Button>
                  
                  <Button 
                    variant="red" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      // Handle reject application
                      console.log('Reject application');
                    }}
                  >
                    <ThumbsDown size={16} />
                    Reject Application
                  </Button>
                </div>
              </div>
            </div>
            {/* Compliance Progress */}
            {application?.compliance && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Compliance Overview</h2>
                <div className="space-y-6">
                  {/* Overall Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                      <span className="text-sm font-semibold text-primary">{application?.compliance?.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${application?.compliance?.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="text-green-600" size={20} />
                        <span className="text-sm font-medium text-green-800">Verified</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {Object.values(application?.compliance?.documentChecklist || {}).filter((doc: any) => doc.verified).length}
                      </p>
                      <p className="text-xs text-green-600 mt-1">Documents</p>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="text-yellow-600" size={20} />
                        <span className="text-sm font-medium text-yellow-800">Pending</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">
                        {Object.values(application?.compliance?.documentChecklist || {}).filter((doc: any) => !doc.verified).length}
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">Pending</p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-1">
                        <XCircle className="text-red-600" size={20} />
                        <span className="text-sm font-medium text-red-800">Rejected</span>
                      </div>
                      <p className="text-2xl font-bold text-red-600">
                        {Object.values(application?.compliance?.documentChecklist || {}).filter((doc: any) => doc.status === 'rejected').length}
                      </p>
                      <p className="text-xs text-red-600 mt-1">Documents</p>
                    </div>
                    
                  </div>

                  {/* What's Left Section */}
                  {((Object.values(application?.compliance?.documentChecklist || {}).filter((doc: any) => !doc.verified).length > 0) || 
                    (Object.values(application?.compliance?.documentChecklist || {}).filter((doc: any) => doc.status === 'rejected').length > 0)) && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h3 className="text-sm font-medium text-yellow-800 mb-2">What's Left to Verify</h3>
                      <div className="space-y-1">
                        {Object.entries(application?.compliance?.documentChecklist || {}).map(([key, doc]: [string, any]) => (
                          !doc.verified && (
                            <div key={key} className="text-xs text-yellow-700 flex items-center gap-2">
                              <Clock size={12} />
                              {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                            </div>
                          )
                        ))}
                        {Object.entries(application?.compliance?.documentChecklist || {}).map(([key, doc]: [string, any]) => (
                          doc.status === 'rejected' && (
                            <div key={key} className="text-xs text-red-700 flex items-center gap-2">
                              <XCircle size={12} />
                              {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())} (Rejected)
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Information Verification */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Information Verification</h2>
              
              {/* Location Information */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <MapPin size={18} />
                    Location Information
                  </h3>
                  <div className="flex items-center gap-2">
                    {!application?.compliance?.informationChecklist?.locationInfo?.verified ? (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="green" 
                          className="flex items-center gap-1 text-xs py-1 px-2"
                          onClick={() => handleDocumentVerification('locationInfo', 'verify')}
                        >
                          <ThumbsUp size={12} />
                          Verify
                        </Button>
                        <Button 
                          variant="red" 
                          className="flex items-center gap-1 text-xs py-1 px-2"
                          onClick={() => handleDocumentVerification('locationInfo', 'reject')}
                        >
                          <ThumbsDown size={12} />
                          Reject
                        </Button>
                      </div>
                    ) : application?.compliance?.informationChecklist.locationInfo.remarks ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle size={16} />
                        <span className="text-sm font-medium">Rejected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Property Address</label>
                      <p className="text-gray-800 font-medium">{application?.propertyAddress}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Barangay</label>
                      <p className="text-gray-800">{application?.barangay}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Lot Number</label>
                      <p className="text-gray-800">{application?.lotNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Block Number</label>
                      <p className="text-gray-800">{application?.blockNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">PCS/PSD/PCN/BSD/CAD</label>
                      <p className="text-gray-800">{application?.pcsPsdPcnBsdCad}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Lot Area (sq.m)</label>
                      <p className="text-gray-800">{application?.lotArea}</p>
                    </div>
                  </div>
                  {/* Verification Status */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {!application?.compliance?.informationChecklist?.locationInfo?.verified ? (
                      <div className="flex items-center gap-2 text-yellow-600 mb-2">
                        <Clock size={16} />
                        <span className="text-sm font-medium">Pending Verification</span>
                      </div>
                    ) : application?.compliance?.informationChecklist.locationInfo.remarks ? (
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <XCircle size={16} />
                        <span className="text-sm font-medium">Rejected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                    
                    {application?.compliance?.informationChecklist?.locationInfo?.verified && (
                      <div className="text-sm text-gray-600">
                        <div className="mb-1">
                          <span className="font-medium">Reviewed by:</span> {application?.compliance?.informationChecklist.locationInfo.verifiedBy} on {application?.compliance?.informationChecklist.locationInfo.verifiedAt}
                        </div>
                        {application?.compliance?.informationChecklist.locationInfo.remarks && (
                          <div>
                            <span className="font-medium">Remarks:</span> {application?.compliance?.informationChecklist.locationInfo.remarks}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Building size={18} />
                    Project Information
                  </h3>
                  <div className="flex items-center gap-2">
                    {!application?.compliance?.informationChecklist?.projectInfo?.verified ? (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="green" 
                          className="flex items-center gap-1 text-xs py-1 px-2"
                          onClick={() => handleDocumentVerification('projectInfo', 'verify')}
                        >
                          <ThumbsUp size={12} />
                          Verify
                        </Button>
                        <Button 
                          variant="red" 
                          className="flex items-center gap-1 text-xs py-1 px-2"
                          onClick={() => handleDocumentVerification('projectInfo', 'reject')}
                        >
                          <ThumbsDown size={12} />
                          Reject
                        </Button>
                      </div>
                    ) : application?.compliance?.informationChecklist.projectInfo.remarks ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle size={16} />
                        <span className="text-sm font-medium">Rejected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nature of Application</label>
                      <p className="text-gray-800 font-medium">{application?.natureOfApplication}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Proposed Zone</label>
                      <p className="text-gray-800">{application?.proposedZone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Lot Owner</label>
                      <p className="text-gray-800">{application?.lotOwner}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">TCT Number</label>
                      <p className="text-gray-800">{application?.tctNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tax Declaration Number</label>
                      <p className="text-gray-800">{application?.taxDecNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Yard Area (sq.m)</label>
                      <p className="text-gray-800">{application?.yardArea}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Total Floor Area (sq.m)</label>
                      <p className="text-gray-800">{application?.totalFloorArea}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Pending Litigation</label>
                      <p className="text-gray-800">{application?.pendingLitigation}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Project Description</label>
                      <p className="text-gray-800">{application?.projectDescription}</p>
                    </div>
                  </div>
                  {/* Verification Status */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {!application?.compliance?.informationChecklist?.projectInfo?.verified ? (
                      <div className="flex items-center gap-2 text-yellow-600 mb-2">
                        <Clock size={16} />
                        <span className="text-sm font-medium">Pending Verification</span>
                      </div>
                    ) : application?.compliance?.informationChecklist.projectInfo.remarks ? (
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <XCircle size={16} />
                        <span className="text-sm font-medium">Rejected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                    
                    {application?.compliance?.informationChecklist?.projectInfo?.verified && (
                      <div className="text-sm text-gray-600">
                        <div className="mb-1">
                          <span className="font-medium">Reviewed by:</span> {application?.compliance?.informationChecklist.projectInfo.verifiedBy} on {application?.compliance?.informationChecklist.projectInfo.verifiedAt}
                        </div>
                        {application?.compliance?.informationChecklist.projectInfo.remarks && (
                          <div>
                            <span className="font-medium">Remarks:</span> {application?.compliance?.informationChecklist.projectInfo.remarks}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Document Verification Checklist */}
            {application?.compliance && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Document Verification</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(application?.compliance?.documentChecklist || {}).map(([key, doc]: [string, any]) => (
                    <div 
                      key={key} 
                      ref={(el) => { documentRefs.current[key] = el; }}
                      className={`flex items-start justify-between p-4 rounded-lg border ${
                        !doc.verified 
                          ? 'bg-yellow-50 border-yellow-300 border-2'
                          : doc.remarks && (doc.remarks.toLowerCase().includes('not') || doc.remarks.toLowerCase().includes('incomplete') || doc.remarks.toLowerCase().includes('missing') || doc.remarks.toLowerCase().includes('does not') || doc.remarks.toLowerCase().includes('need') || doc.remarks.toLowerCase().includes('reject') || doc.remarks.toLowerCase().includes('error'))
                            ? 'bg-red-50 border-red-300 border-2'
                            : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {!doc.verified ? (
                            <Clock className="text-yellow-600" size={20} />
                          ) : doc.remarks && (doc.remarks.toLowerCase().includes('not') || doc.remarks.toLowerCase().includes('incomplete') || doc.remarks.toLowerCase().includes('missing') || doc.remarks.toLowerCase().includes('does not') || doc.remarks.toLowerCase().includes('need') || doc.remarks.toLowerCase().includes('reject') || doc.remarks.toLowerCase().includes('error')) ? (
                            <XCircle className="text-red-600" size={20} />
                          ) : (
                            <CheckCircle className="text-green-600" size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 text-sm mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                          </h3>
                          {doc.verified && (
                            <p className="text-xs text-gray-600">
                              {doc.remarks && (doc.remarks.toLowerCase().includes('not') || doc.remarks.toLowerCase().includes('incomplete') || doc.remarks.toLowerCase().includes('missing') || doc.remarks.toLowerCase().includes('does not') || doc.remarks.toLowerCase().includes('need') || doc.remarks.toLowerCase().includes('reject') || doc.remarks.toLowerCase().includes('error')) ? 'Rejected' : 'Verified'} by {doc.verifiedBy} on {doc.verifiedAt}
                            </p>
                          )}
                          {doc.remarks && (
                            <p className={`text-xs mt-1 italic font-medium ${
                              doc.remarks.toLowerCase().includes('not') || doc.remarks.toLowerCase().includes('incomplete') || doc.remarks.toLowerCase().includes('missing') || doc.remarks.toLowerCase().includes('does not') || doc.remarks.toLowerCase().includes('need') || doc.remarks.toLowerCase().includes('reject') || doc.remarks.toLowerCase().includes('error')
                                ? 'text-red-600' 
                                : 'text-green-600'
                            }`}>"{doc.remarks}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button 
                          variant="blue" 
                          className="flex items-center gap-1 text-xs py-1 px-2"
                          onClick={() => {
                            // Open document in new tab or modal for viewing
                            const document = application?.documents?.[key as keyof typeof application.documents];
                            if (document && document.filename) {
                              // In a real app, this would open the actual document
                              // For now, we'll show an alert with document info
                              alert(`Viewing document: ${document.filename}\nSize: ${document.size}\nUploaded: ${document.uploadedAt}`);
                            }
                          }}
                        >
                          <Eye size={12} />
                          View
                        </Button>
                        {!doc.verified && (
                          <>
                            <Button 
                              variant="green" 
                              className="flex items-center gap-1 text-xs py-1 px-2"
                              onClick={() => handleDocumentVerification(key, 'verify')}
                            >
                              <ThumbsUp size={12} />
                              Verify
                            </Button>
                            <Button 
                              variant="red" 
                              className="flex items-center gap-1 text-xs py-1 px-2"
                              onClick={() => handleDocumentVerification(key, 'reject')}
                            >
                              <ThumbsDown size={12} />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Remarks Section */}
            {application?.compliance?.remarks && (application?.compliance?.remarks?.length || 0) > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Remarks & Comments</h2>
                <div className="space-y-3">
                  {application?.compliance?.remarks.map((remark: any) => (
                    <div key={remark.id} className={`p-4 rounded-lg border ${
                      remark.type === 'success' ? 'bg-green-50 border-green-200' :
                      remark.type === 'error' ? 'bg-red-50 border-red-200' :
                      remark.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={16} className={
                            remark.type === 'success' ? 'text-green-600' :
                            remark.type === 'error' ? 'text-red-600' :
                            remark.type === 'warning' ? 'text-yellow-600' :
                            'text-blue-600'
                          } />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            remark.type === 'success' ? 'bg-green-100 text-green-800' :
                            remark.type === 'error' ? 'bg-red-100 text-red-800' :
                            remark.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {remark.type.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-gray-700">{remark.author}</span>
                        </div>
                        <span className="text-xs text-gray-500">{remark.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{remark.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Status History Timeline */}
            {application?.compliance && application?.compliance.statusHistory && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Status Change History</h2>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline Items */}
                  <div className="space-y-6">
                    {application?.compliance.statusHistory.map((item: any, index: number) => (
                      <div key={index} className="relative flex items-start gap-4">
                        {/* Timeline Dot */}
                        <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          item.status === 'Approved' ? 'bg-green-100 border-green-500' :
                          item.status === 'Rejected' ? 'bg-red-100 border-red-500' :
                          item.status === 'Under Review' ? 'bg-blue-100 border-blue-500' :
                          'bg-yellow-100 border-yellow-500'
                        }`}>
                          {item.status === 'Approved' ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : item.status === 'Rejected' ? (
                            <XCircle size={16} className="text-red-600" />
                          ) : (
                            <Clock size={16} className={
                              item.status === 'Under Review' ? 'text-blue-600' : 'text-yellow-600'
                            } />
                          )}
                        </div>
                        
                        {/* Timeline Content */}
                        <div className="flex-1 pb-6">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-800">{item.status}</h3>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">{item.date}</p>
                                <p className="text-xs text-gray-500">{item.time}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">Changed by: <span className="font-medium">{item.changedBy}</span></p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Document Upload History */}
            {application.documents && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Document Upload History</h2>
                <div className="space-y-3">
                  {Object.entries(application.documents).map(([key, doc]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <FileIcon className="text-primary" size={20} />
                        <div>
                          <h3 className="font-medium text-gray-800 text-sm">
                            {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                          </h3>
                          <p className="text-xs text-gray-500">{doc.filename}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Uploaded: {doc.uploadedAt}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Remarks History */}
            {application?.compliance && application?.compliance?.remarks && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Remarks History</h2>
                <div className="space-y-3">
                  {application?.compliance?.remarks.map((remark: any) => (
                    <div key={remark.id} className={`p-4 rounded-lg border ${
                      remark.type === 'success' ? 'bg-green-50 border-green-200' :
                      remark.type === 'error' ? 'bg-red-50 border-red-200' :
                      remark.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={16} className={
                            remark.type === 'success' ? 'text-green-600' :
                            remark.type === 'error' ? 'text-red-600' :
                            remark.type === 'warning' ? 'text-yellow-600' :
                            'text-blue-600'
                          } />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            remark.type === 'success' ? 'bg-green-100 text-green-800' :
                            remark.type === 'error' ? 'bg-red-100 text-red-800' :
                            remark.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {remark.type.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{remark.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{remark.text}</p>
                      <p className="text-xs text-gray-600">By: {remark.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Summary */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Application ID</p>
                  <p className="text-lg font-semibold text-gray-800">{application.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Date Submitted</p>
                  <p className="text-lg font-semibold text-gray-800">{application.dateSubmitted}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Current Status</p>
                  <p className="text-lg font-semibold text-gray-800">{application.status}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Applicant</p>
                  <p className="text-lg font-semibold text-gray-800">{application.applicantName}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modals */}
      {activeModal === 'applicant' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Edit Applicant Information"
          size="xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Name of Applicant/Owner/Firm/Corporation"
                value={applicantData.applicantName}
                onChange={(e) => handleApplicantChange('applicantName', e.target.value)}
                placeholder="Enter name of applicant/owner/firm/corporation"
              />
              
              <Input
                label="Contact Number"
                value={applicantData.contactNumber}
                onChange={(e) => handleApplicantChange('contactNumber', e.target.value)}
                placeholder="e.g., +63 912 345 6789"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                value={applicantData.emailAddress}
                onChange={(e) => handleApplicantChange('emailAddress', e.target.value)}
                placeholder="your.email@example.com"
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">ID Type</label>
                <select
                  value={applicantData.idType}
                  onChange={(e) => handleApplicantChange('idType', e.target.value)}
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
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ID Number"
                value={applicantData.idNumber}
                onChange={(e) => handleApplicantChange('idNumber', e.target.value)}
                placeholder="Enter your ID number"
              />
            </div>
            
            <TextArea
              label="Home/Office Address"
              value={applicantData.applicantAddress}
              onChange={(e) => handleApplicantChange('applicantAddress', e.target.value)}
              rows={3}
              placeholder="Enter home/office address"
            />
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
              onClick={() => setActiveModal(null)}
            >
              Save Changes
            </Button>
          </div>
        </Modal>
      )}

      {activeModal === 'location' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Edit Location Information"
          size="xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Property Address"
                value={locationData.propertyAddress}
                onChange={(e) => handleLocationChange('propertyAddress', e.target.value)}
                placeholder="Enter property address"
              />
              
              <Input
                label="Barangay"
                value={locationData.barangay}
                onChange={(e) => handleLocationChange('barangay', e.target.value)}
                placeholder="Enter barangay"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Lot Number"
                value={locationData.lotNumber}
                onChange={(e) => handleLocationChange('lotNumber', e.target.value)}
                placeholder="Enter lot number"
              />
              
              <Input
                label="Block Number"
                value={locationData.blockNumber}
                onChange={(e) => handleLocationChange('blockNumber', e.target.value)}
                placeholder="Enter block number"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="PCS/PSD/PCN/BSD/CAD# (Optional)"
                value={locationData.pcsPsdPcnBsdCad}
                onChange={(e) => handleLocationChange('pcsPsdPcnBsdCad', e.target.value)}
                placeholder="Leave blank if submitting new application"
              />
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
              onClick={() => setActiveModal(null)}
            >
              Save Changes
            </Button>
          </div>
        </Modal>
      )}

      {activeModal === 'project' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Edit Project Information"
          size="xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Proposed Zone</label>
                <select
                  value={projectData.proposedZone}
                  onChange={(e) => handleProjectChange('proposedZone', e.target.value)}
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
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nature of Application</label>
                <select
                  value={projectData.natureOfApplication}
                  onChange={(e) => handleProjectChange('natureOfApplication', e.target.value)}
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
              </div>
            </div>
            
            <TextArea
              label="Project Description"
              value={projectData.projectDescription}
              onChange={(e) => handleProjectChange('projectDescription', e.target.value)}
              rows={3}
              placeholder="Describe your project in detail"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Lot Owner"
                value={projectData.lotOwner}
                onChange={(e) => handleProjectChange('lotOwner', e.target.value)}
                placeholder="Enter lot owner name"
              />
              
              <Input
                label="TCT No."
                value={projectData.tctNumber}
                onChange={(e) => handleProjectChange('tctNumber', e.target.value)}
                placeholder="Enter TCT number"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tax Dec No."
                value={projectData.taxDecNumber}
                onChange={(e) => handleProjectChange('taxDecNumber', e.target.value)}
                placeholder="Enter tax declaration number"
              />
              
              <Input
                label="Lot Area (sq.m.)"
                value={projectData.lotArea}
                onChange={(e) => handleProjectChange('lotArea', e.target.value)}
                placeholder="Enter lot area in square meters"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Yard Area (sq.m.)"
                value={projectData.yardArea}
                onChange={(e) => handleProjectChange('yardArea', e.target.value)}
                placeholder="Enter yard area in square meters"
              />
              
              <Input
                label="Total Floor Area (sq.m.)"
                value={projectData.totalFloorArea}
                onChange={(e) => handleProjectChange('totalFloorArea', e.target.value)}
                placeholder="Enter total floor area in square meters"
              />
            </div>
            
            {projectData.isBusiness && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Business Area (sq.m.)"
                  value={projectData.businessArea}
                  onChange={(e) => handleProjectChange('businessArea', e.target.value)}
                  placeholder="Enter business area in square meters"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Products to be manufactured or stored</label>
              <textarea
                value={projectData.productsManufactured}
                onChange={(e) => handleProjectChange('productsManufactured', e.target.value)}
                rows={2}
                placeholder="Describe products to be manufactured or stored"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
            
            <Input
              label="Size of Employment (estimate)"
              value={projectData.sizeOfEmployment}
              onChange={(e) => handleProjectChange('sizeOfEmployment', e.target.value)}
              placeholder="Estimated number of employees"
            />
            
            <TextArea
              label="Is there any pending, litigation, criminal, administrative case or otherwise, relative to the subject activity/project?"
              value={projectData.pendingLitigation}
              onChange={(e) => handleProjectChange('pendingLitigation', e.target.value)}
              rows={3}
              placeholder="Please provide details of any pending cases or litigation"
            />
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
              onClick={() => setActiveModal(null)}
            >
              Save Changes
            </Button>
          </div>
        </Modal>
      )}

      {/* Document Verification Modal */}
      {documentVerificationModal.isOpen && (
        <Modal
          isOpen={true}
          onClose={handleVerificationCancel}
          title={`${documentVerificationModal.action === 'verify' ? 'Verify' : 'Reject'} Document`}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">
                {documentVerificationModal.documentType.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
              </h3>
              <p className="text-sm text-gray-600">
                You are about to <span className={`font-medium ${
                  documentVerificationModal.action === 'verify' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {documentVerificationModal.action}
                </span> this document.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks {documentVerificationModal.action === 'reject' && <span className="text-red-500">*</span>}
              </label>
              <textarea
                rows={4}
                value={verificationRemarks}
                onChange={(e) => setVerificationRemarks(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                placeholder={`Enter remarks for ${documentVerificationModal.action === 'verify' ? 'verification' : 'rejection'}...`}
                required={documentVerificationModal.action === 'reject'}
              />
              {documentVerificationModal.action === 'reject' && (
                <p className="text-xs text-red-600 mt-1">
                  Remarks are required when rejecting a document.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="red" 
                onClick={handleVerificationCancel}
              >
                Cancel
              </Button>
              <Button 
                variant={documentVerificationModal.action === 'verify' ? 'green' : 'red'}
                onClick={handleVerificationSubmit}
                disabled={documentVerificationModal.action === 'reject' && !verificationRemarks.trim()}
              >
                {documentVerificationModal.action === 'verify' ? 'Verify Document' : 'Reject Document'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ApplicationView;
