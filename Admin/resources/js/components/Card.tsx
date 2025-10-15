import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, FileText, MapPin, User, Building, Calendar } from 'lucide-react';

interface CardProps {
  title: string;
  description?: string;
  status: 'verified' | 'pending' | 'rejected' | 'warning';
  type: 'document' | 'information' | 'location' | 'project' | 'applicant';
  data?: Record<string, any>;
  onVerify?: () => void;
  onReject?: () => void;
  onView?: () => void;
  remarks?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  status,
  type,
  data = {},
  onVerify,
  onReject,
  onView,
  remarks,
  verifiedBy,
  verifiedAt,
  className = ''
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          statusText: 'Verified'
        };
      case 'rejected':
        return {
          icon: XCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          statusText: 'Rejected'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          statusText: 'Warning'
        };
      default: // pending
        return {
          icon: Clock,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          statusText: 'Pending'
        };
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'document':
        return FileText;
      case 'information':
        return User;
      case 'location':
        return MapPin;
      case 'project':
        return Building;
      case 'applicant':
        return User;
      default:
        return FileText;
    }
  };

  const statusConfig = getStatusConfig();
  const TypeIcon = getTypeIcon();
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`bg-white rounded-lg border ${statusConfig.borderColor} shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      {/* Header */}
      <div className={`p-4 ${statusConfig.bgColor} rounded-t-lg border-b ${statusConfig.borderColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TypeIcon size={20} className={statusConfig.iconColor} />
            <div>
              <h3 className={`font-semibold ${statusConfig.textColor}`}>{title}</h3>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon size={18} className={statusConfig.iconColor} />
            <span className={`text-sm font-medium ${statusConfig.textColor}`}>
              {statusConfig.statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Data Display */}
        {Object.keys(data).length > 0 && (
          <div className="space-y-2 mb-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {value || 'N/A'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Remarks */}
        {remarks && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Remarks:</span> {remarks}
            </p>
          </div>
        )}

        {/* Verification Info */}
        {verifiedBy && verifiedAt && status === 'verified' && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-700">
              <span className="font-medium">Verified by:</span> {verifiedBy}
            </p>
            <p className="text-xs text-green-700">
              <span className="font-medium">Verified at:</span> {new Date(verifiedAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {onView && (
              <button
                onClick={onView}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details
              </button>
            )}
          </div>
          
          {status !== 'verified' && (onVerify || onReject) && (
            <div className="flex items-center gap-2">
              {onVerify && (
                <button
                  onClick={onVerify}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                >
                  Verify
                </button>
              )}
              {onReject && (
                <button
                  onClick={onReject}
                  className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
