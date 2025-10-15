import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// Login page types
export interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export interface RegistrationFormData {
    firstName: string;
    lastName: string;
    middleName?: string;
    suffix?: string;
    birthDate: string;
    email: string;
    mobile: string;
    address: string;
    houseNumber: string;
    street: string;
    barangay: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
}

export interface OTPModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (otp: string) => void;
    onResend: () => void;
    timeRemaining: number;
}

export interface ServiceCardProps {
    title: string;
    description: string;
    icon: string;
    href: string;
    color: 'primary' | 'secondary' | 'accent';
}

export interface LandingPageProps {
    services: ServiceCardProps[];
}
