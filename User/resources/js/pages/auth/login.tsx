import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Eye, EyeOff, Clock, CheckCircle, XCircle, AlertCircle, Mail, Lock, User, Phone, MapPin, Calendar, FileText, Shield, ExternalLink } from 'lucide-react';
import { showSuccess, showError, showWarning, showInfo } from '@/components/swal';
import { LoginProps, RegistrationFormData, OTPModalProps } from '@/types';

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [otpTimeRemaining, setOtpTimeRemaining] = useState(180);
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');

    // Login form
    const { data: loginData, setData: setLoginData, post: loginPost, processing: loginProcessing, errors: loginErrors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Registration form
    const { data: regData, setData: setRegData, post: regPost, processing: regProcessing, errors: regErrors, reset: resetReg } = useForm<RegistrationFormData>({
        firstName: '',
        lastName: '',
        middleName: '',
        suffix: '',
        birthDate: '',
        email: '',
        mobile: '',
        address: '',
        houseNumber: '',
        street: '',
        barangay: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
        agreePrivacy: false,
    });

    // Update current date and time
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            setCurrentDateTime(now.toLocaleDateString('en-US', options).toUpperCase());
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // OTP timer
    useEffect(() => {
        if (showOTPModal && otpTimeRemaining > 0) {
            const timer = setTimeout(() => {
                setOtpTimeRemaining(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [showOTPModal, otpTimeRemaining]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginPost('/login', {
            onSuccess: () => {
                showSuccess('Login successful! Sending OTP...');
                setShowOTPModal(true);
            },
            onError: () => {
                showError('Invalid credentials. Please try again.');
            }
        });
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (regData.password !== regData.confirmPassword) {
            showError('Passwords do not match.');
            return;
        }

        if (!regData.agreeTerms || !regData.agreePrivacy) {
            showError('Please agree to the Terms of Service and Privacy Policy.');
            return;
        }

        regPost('/register', {
            onSuccess: () => {
                showSuccess('Registration successful! Please check your email for login credentials.');
                setShowRegisterModal(false);
                resetReg();
            },
            onError: () => {
                showError('Registration failed. Please try again.');
            }
        });
    };

    const handleOTPVerify = () => {
        const code = otpCode.join('');
        if (code.length !== 6) {
            setOtpError('Please enter the 6-digit OTP.');
            return;
        }

        if (otpTimeRemaining <= 0) {
            setOtpError('OTP expired. Please resend a new OTP.');
            return;
        }

        // Mock OTP verification - replace with actual API call
        if (code === '123456') {
            showSuccess('OTP verified! Redirecting...');
            setShowOTPModal(false);
            // Redirect to dashboard
            router.visit('/dashboard');
        } else {
            setOtpError('Invalid OTP. Please try again.');
        }
    };

    const handleOTPResend = () => {
        setOtpTimeRemaining(180);
        setOtpCode(['', '', '', '', '', '']);
        setOtpError('');
        showInfo('A new OTP has been sent to your email.');
    };

    const handleOTPInputChange = (index: number, value: string) => {
        if (value.length > 1) return;
        
        const newOtpCode = [...otpCode];
        newOtpCode[index] = value;
        setOtpCode(newOtpCode);
        setOtpError('');

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const validatePassword = (password: string) => {
        return {
            length: password.length >= 10,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };
    };

    const passwordValidation = validatePassword(regData.password);

    return (
        <>
            <Head title="Login - GoServePH" />
            
            {/* Background */}
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 relative overflow-hidden">
                {/* Background image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                    style={{ backgroundImage: 'url(/images/gsmbg.png)' }}
                />
                {/* Animated background particles */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-green-50/20 animate-pulse" />
                
                {/* Header */}
                <header className="relative z-10 py-2 bg-white/90 backdrop-blur-sm border-b-4 border-orange-400 shadow-lg">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg logo-float">
                                    <img src="/images/GSM_logo.png" alt="GSM Logo" className="h-10 w-auto" />
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                                    <span className="text-blue-600">Go</span>
                                    <span className="text-green-600">Serve</span>
                                    <span className="text-blue-600">PH</span>
                                </h1>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-700">
                                    {currentDateTime}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-6 pt-4 pb-12 flex-1 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
                        {/* Left Section - Tagline */}
                        <div className="text-center lg:text-left mt-2">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-800">
                                <span className="animated-gradient">Abot-Kamay mo ang Serbisyong Publiko!</span>
                            </h2>
                        </div>

                        {/* Right Section - Login Form */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-sm mx-auto w-full glass-card text-gray-900">
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <input
                                        type="email"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData('email', e.target.value)}
                                        placeholder="Enter e-mail address"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 input-focus placeholder-animate text-gray-900 placeholder-gray-500"
                                        required
                                    />
                                    {loginErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">{loginErrors.email}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={loginData.password}
                                            onChange={(e) => setLoginData('password', e.target.value)}
                                            placeholder="Enter password"
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 input-focus placeholder-animate"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {loginErrors.password && (
                                        <p className="text-red-500 text-sm mt-1">{loginErrors.password}</p>
                                    )}
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={loginProcessing}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold btn-shimmer relative overflow-hidden disabled:opacity-50"
                                >
                                    {loginProcessing ? (
                                        <span className="flex items-center justify-center">
                                            <div className="loading mr-2" />
                                            Processing...
                                        </span>
                                    ) : (
                                        'Login'
                                    )}
                                </button>
                                
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">OR</span>
                                    </div>
                                </div>
                                
                                <button
                                    type="button"
                                    className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
                                >
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                    <span>Continue with Google</span>
                                </button>
                                
                                <div className="text-center">
                                    <p className="text-gray-600">
                                        No account yet?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setShowRegisterModal(true)}
                                            className="text-blue-600 hover:underline font-semibold"
                                        >
                                            Register here
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-green-600 text-white py-4 mt-8 relative z-10">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row justify-between items-center">
                            <div className="text-center lg:text-left mb-2 lg:mb-0">
                                <h3 className="text-lg font-bold mb-1">Government Services Management System</h3>
                                <p className="text-xs opacity-90">
                                    For any inquiries, please call 122 or email helpdesk@gov.ph
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowTermsModal(true)}
                                        className="text-xs hover:underline"
                                    >
                                        TERMS OF SERVICE
                                    </button>
                                    <span>|</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowPrivacyModal(true)}
                                        className="text-xs hover:underline"
                                    >
                                        PRIVACY POLICY
                                    </button>
                                </div>
                                <div className="flex space-x-2">
                                    <a href="#" className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                        <span className="text-white text-xs">f</span>
                                    </a>
                                    <a href="#" className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                                        <span className="text-white text-xs">t</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Registration Modal */}
            {showRegisterModal && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 px-4 z-50 overflow-y-auto"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowRegisterModal(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto modal-enter text-gray-900">
                        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 -mx-6 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl md:text-2xl font-semibold text-blue-600">Create your GoServePH account</h2>
                            <button
                                type="button"
                                onClick={() => setShowRegisterModal(false)}
                                className="text-gray-500 hover:text-gray-700 p-2"
                            >
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleRegister} className="space-y-5 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">
                                        First Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={regData.firstName}
                                        onChange={(e) => setRegData('firstName', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                                    {regErrors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">{regErrors.firstName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">
                                        Last Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={regData.lastName}
                                        onChange={(e) => setRegData('lastName', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                                    {regErrors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">{regErrors.lastName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">
                                        Middle Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={regData.middleName}
                                        onChange={(e) => setRegData('middleName', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                                    <label className="inline-flex items-center mt-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setRegData('middleName', '');
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        No middle name
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">Suffix</label>
                                    <input
                                        type="text"
                                        value={regData.suffix}
                                        onChange={(e) => setRegData('suffix', e.target.value)}
                                        placeholder="Jr., Sr., III (optional)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">
                                        Birthdate<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={regData.birthDate}
                                        onChange={(e) => setRegData('birthDate', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">
                                        Email Address<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={regData.email}
                                        onChange={(e) => setRegData('email', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">
                                        Mobile Number<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={regData.mobile}
                                        onChange={(e) => setRegData('mobile', e.target.value)}
                                        required
                                        placeholder="09XXXXXXXXX"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm mb-1 text-gray-700">
                                        Address<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={regData.address}
                                        onChange={(e) => setRegData('address', e.target.value)}
                                        required
                                        placeholder="Lot/Unit, Building, Subdivision"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">
                                        House #<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={regData.houseNumber}
                                        onChange={(e) => setRegData('houseNumber', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">
                                        Street<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={regData.street}
                                        onChange={(e) => setRegData('street', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm mb-1 text-gray-700">
                                        Barangay<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={regData.barangay}
                                        onChange={(e) => setRegData('barangay', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">
                                        Password<span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showRegPassword ? 'text' : 'password'}
                                            value={regData.password}
                                            onChange={(e) => setRegData('password', e.target.value)}
                                            minLength={10}
                                            required
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegPassword(!showRegPassword)}
                                            className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                                        >
                                            {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <ul className="text-xs text-gray-700 mt-2 space-y-1">
                                        <li className={`req-item flex items-center ${passwordValidation.length ? 'met' : ''}`}>
                                            <span className="req-dot"></span> At least 10 characters
                                        </li>
                                        <li className={`req-item flex items-center ${passwordValidation.upper ? 'met' : ''}`}>
                                            <span className="req-dot"></span> Has uppercase letter
                                        </li>
                                        <li className={`req-item flex items-center ${passwordValidation.lower ? 'met' : ''}`}>
                                            <span className="req-dot"></span> Has lowercase letter
                                        </li>
                                        <li className={`req-item flex items-center ${passwordValidation.number ? 'met' : ''}`}>
                                            <span className="req-dot"></span> Has a number
                                        </li>
                                        <li className={`req-item flex items-center ${passwordValidation.special ? 'met' : ''}`}>
                                            <span className="req-dot"></span> Has a special character
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">
                                        Confirm Password<span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showRegPassword ? 'text' : 'password'}
                                            value={regData.confirmPassword}
                                            onChange={(e) => setRegData('confirmPassword', e.target.value)}
                                            minLength={10}
                                    required
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegPassword(!showRegPassword)}
                                            className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                                        >
                                            {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                    <label className="inline-flex items-center text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={regData.agreeTerms}
                                            onChange={(e) => setRegData('agreeTerms', e.target.checked)}
                                            className="mr-2"
                                            required
                                        />
                                        <span>I have read, understood, and agreed to the</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowTermsModal(true)}
                                        className="ml-2 text-blue-600 hover:underline"
                                    >
                                        Terms of Use
                                    </button>
                                </div>
                                <div className="flex items-center text-sm">
                                    <label className="inline-flex items-center text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={regData.agreePrivacy}
                                            onChange={(e) => setRegData('agreePrivacy', e.target.checked)}
                                            className="mr-2"
                                            required
                                        />
                                        <span>I have read, understood, and agreed to the</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPrivacyModal(true)}
                                        className="ml-2 text-blue-600 hover:underline"
                                    >
                                        Data Privacy Policy
                                    </button>
                                </div>
                                <p className="text-xs text-gray-700">
                                    By clicking on the register button below, I hereby agree to both the Terms of Use and Data Privacy Policy
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRegisterModal(false)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                type="submit"
                                    disabled={regProcessing}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {regProcessing ? 'Registering...' : 'Register'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* OTP Modal */}
            {showOTPModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 modal-enter text-gray-900">
                        <h3 className="text-xl font-semibold mb-2 text-center">Two-Factor Verification</h3>
                        <p className="text-sm text-gray-600 mb-4 text-center">
                            Please check your registered email for your OTP. You have{' '}
                            <span className="font-semibold text-blue-600">
                                {Math.floor(otpTimeRemaining / 60)}:{(otpTimeRemaining % 60).toString().padStart(2, '0')}
                            </span>{' '}
                            to enter it.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-2 text-center">Enter OTP</label>
                                <div className="flex justify-center space-x-2" id="otpInputs">
                                    {otpCode.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            className="otp-input"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOTPInputChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                            aria-label={`Digit ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            {otpError && (
                                <div className="text-red-500 text-sm text-center">{otpError}</div>
                            )}
                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => setShowOTPModal(false)}
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <div className="space-x-2">
                                    <button
                                        type="button"
                                        onClick={handleOTPResend}
                                        disabled={otpTimeRemaining > 0}
                                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                                    >
                                        Resend OTP
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleOTPVerify}
                                        disabled={otpTimeRemaining <= 0}
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                    >
                                        Verify
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Terms of Service Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto text-gray-900">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">GoServePH Terms of Service Agreement</h3>
                            <button
                                type="button"
                                onClick={() => setShowTermsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="px-6 py-4 space-y-4 text-sm leading-6">
                            <p><strong>Welcome to GoServePH!</strong></p>
                            <p>This GoServePH Services Agreement ("Agreement") is a binding legal contract for the use of our software systems—which handle data input, monitoring, processing, and analytics—("Services") between GoServePH ("us," "our," or "we") and you, the registered user ("you" or "user").</p>
                            <p>This Agreement details the terms and conditions for using our Services. By accessing or using any GoServePH Services, you agree to these terms. If you don't understand any part of this Agreement, please contact us at info@goserveph.com.</p>
                            
                            <h4 className="font-semibold">OVERVIEW OF THIS AGREEMENT</h4>
                            <p>This document outlines the terms for your use of the GoServePH system:</p>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr><th className="py-1 pr-4">Section</th><th className="py-1">Topic</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="py-1 pr-4">Section A</td><td className="py-1">General Account Setup and Use</td></tr>
                                        <tr><td className="py-1 pr-4">Section B</td><td className="py-1">Technology, Intellectual Property, and Licensing</td></tr>
                                        <tr><td className="py-1 pr-4">Section C</td><td className="py-1">Payment Terms, Fees, and Billing</td></tr>
                                        <tr><td className="py-1 pr-4">Section D</td><td className="py-1">Data Usage, Privacy, and Security</td></tr>
                                        <tr><td className="py-1 pr-4">Section E</td><td className="py-1">Additional Legal Terms and Disclaimers</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <h4 className="font-semibold">SECTION A: GENERAL TERMS</h4>
                            <p><strong>1. Your Account and Registration</strong></p>
                            <p>a. Account Creation: To use our Services, you must create an Account. Your representative (Representative) must provide us with required details, including your entity's name, address, contact person, email, phone number, relevant ID/tax number, and the nature of your business/activities.</p>
                            <p>b. Review and Approval: We reserve the right to review and approve your application, which typically takes at least two (2) business days. We can deny or reject any application at our discretion.</p>
                            <p>c. Eligibility: Only businesses, institutions, and other entities based in the Philippines are eligible to apply for a GoServePH Account.</p>
                            
                            <p><strong>2. Services and Support</strong></p>
                            <p>We provide support for general account inquiries and issues that prevent the proper use of the system ("System Errors"). Support includes resources available through our in-app Ticketing System and website documentation ("Documentation"). For further questions, contact us at support@goserveph.com.</p>
                            
                            <p><strong>3. Service Rules and Restrictions</strong></p>
                            <p>a. Lawful Use: You must use the Services lawfully and comply with all applicable Philippine laws, rules, and regulations ("Laws") regarding your use of the Services and the transactions you facilitate ("Transactions").</p>
                            <p>b. Prohibited Activities: You may not use the Services to facilitate illegal transactions, or for personal/household use. Specifically, you must not, nor allow others to:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Access non-public systems or data.</li>
                                <li>Copy, resell, or distribute the Services, Documentation, or system content.</li>
                                <li>Use, transfer, or access data you do not own or have no documented rights to use.</li>
                                <li>Act as a service agent for the Services.</li>
                                <li>Transfer your rights under this Agreement.</li>
                                <li>Bypass technical limitations or enable disabled features.</li>
                                <li>Reverse engineer the Services (except where legally permitted).</li>
                                <li>Interfere with the normal operation of the Services or impose an unreasonably large load on the system.</li>
                            </ul>
                        </div>
                        <div className="border-t px-6 py-3 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowTermsModal(false)}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Privacy Policy Modal */}
            {showPrivacyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto text-gray-900">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">GoServePH Data Privacy Policy</h3>
                            <button
                                type="button"
                                onClick={() => setShowPrivacyModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="px-6 py-4 space-y-4 text-sm leading-6">
                            <p><strong>Protecting the information you and your users handle through our system is our highest priority.</strong> This policy outlines how GoServePH manages, secures, and uses your data.</p>
                            
                            <h4 className="font-semibold">1. How We Define and Use Data</h4>
                            <p>In this policy, we define the types of data that flow through the GoServePH system:</p>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr><th className="py-1 pr-4">Term</th><th className="py-1">Definition</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="py-1 pr-4">Personal Data</td><td className="py-1">Any information that can identify a specific person, whether directly or indirectly, shared or accessible through the Services.</td></tr>
                                        <tr><td className="py-1 pr-4">User Data</td><td className="py-1">Information that describes your business operations, services, or internal activities.</td></tr>
                                        <tr><td className="py-1 pr-4">GoServePH Data</td><td className="py-1">Details about transactions and activity on our platform, information used for fraud detection, aggregated data, and any non-personal information generated by our system.</td></tr>
                                        <tr><td className="py-1 pr-4">DATA</td><td className="py-1">Used broadly to refer to all the above: Personal Data, User Data, and GoServePH Data.</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <h4 className="font-semibold">Our Commitment to Data Use</h4>
                            <p>We analyze and manage data only for the following critical purposes:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>To provide, maintain, and improve the GoServePH Services for you and all other users.</li>
                                <li>To detect and mitigate fraud, financial loss, or other harm to you or other users.</li>
                                <li>To develop and enhance our products, systems, and tools.</li>
                            </ul>
                            <p>We will not sell or share Personal Data with unaffiliated parties for their marketing purposes. By using our system, you consent to our use of your Data in this manner.</p>
                            
                            <h4 className="font-semibold">2. Data Protection and Compliance</h4>
                            <p><strong>Confidentiality</strong></p>
                            <p>We commit to using Data only as permitted by our agreement or as specifically directed by you. You, in turn, must protect all Data you access through GoServePH and use it only in connection with our Services. Neither party may use Personal Data to market to third parties without explicit consent.</p>
                            <p>We will only disclose Data when legally required to do so, such as through a subpoena, court order, or search warrant.</p>
                            
                            <p><strong>Privacy Compliance and Responsibilities</strong></p>
                            <p><em>Your Legal Duty:</em> You affirm that you are, and will remain, compliant with all applicable Philippine laws (including the Data Privacy Act of 2012) governing the collection, protection, and use of the Data you provide to us.</p>
                            <p><em>Consent:</em> You are responsible for obtaining all necessary rights and consents from your End-Users to allow us to collect, use, and store their Personal Data.</p>
                            <p><em>End-User Disclosure:</em> You must clearly inform your End-Users that GoServePH processes transactions for you and may receive their Personal Data as part of that process.</p>
                        </div>
                        <div className="border-t px-6 py-3 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowPrivacyModal(false)}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status message */}
            {status && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50">
                    {status}
                </div>
            )}
        </>
    );
}