import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    Heart, 
    Shield, 
    Briefcase, 
    MessageCircle, 
    X, 
    Send, 
    Phone, 
    Mail, 
    MapPin,
    Clock,
    CheckCircle,
    ArrowRight,
    Menu,
    X as CloseIcon
} from 'lucide-react';
import { ServiceCardProps } from '@/types';

interface LandingPageProps {
    services?: ServiceCardProps[];
}

export default function LandingPage({ services = [] }: LandingPageProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            type: 'bot',
            message: 'Hello! I\'m your virtual assistant. How can I help you with government services today?',
            timestamp: new Date()
        }
    ]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const defaultServices: ServiceCardProps[] = [
        {
            title: 'AICS - Assistance to Individuals in Crisis Situation',
            description: 'Financial assistance for individuals and families facing crisis situations such as medical emergencies, natural disasters, and other unforeseen circumstances.',
            icon: 'heart',
            href: '/services/aics',
            color: 'primary'
        },
        {
            title: 'OSCA - Office of Senior Citizens Affairs',
            description: 'Comprehensive services and programs for senior citizens including social pension, health services, and recreational activities.',
            icon: 'users',
            href: '/services/osca',
            color: 'secondary'
        },
        {
            title: 'PDAO - Persons with Disability Affairs Office',
            description: 'Support services and programs for persons with disabilities including livelihood assistance, health services, and accessibility programs.',
            icon: 'shield',
            href: '/services/pdao',
            color: 'accent'
        },
        {
            title: 'CCSWDD - City Council for the Welfare of Disabled Persons',
            description: 'Advocacy and support programs for persons with disabilities, including policy development and community integration initiatives.',
            icon: 'briefcase',
            href: '/services/ccswdd',
            color: 'primary'
        },
        {
            title: 'Livelihood Programs',
            description: 'Various livelihood and skills training programs to help residents start their own businesses and improve their economic status.',
            icon: 'briefcase',
            href: '/services/livelihood',
            color: 'secondary'
        }
    ];

    const displayServices = services.length > 0 ? services : defaultServices;

    const getServiceIcon = (iconName: string) => {
        switch (iconName) {
            case 'heart': return <Heart className="h-8 w-8" />;
            case 'users': return <Users className="h-8 w-8" />;
            case 'shield': return <Shield className="h-8 w-8" />;
            case 'briefcase': return <Briefcase className="h-8 w-8" />;
            default: return <Users className="h-8 w-8" />;
        }
    };

    const getServiceColorClasses = (color: string) => {
        switch (color) {
            case 'primary':
                return 'from-green-500 to-green-600 text-white';
            case 'secondary':
                return 'from-blue-500 to-blue-600 text-white';
            case 'accent':
                return 'from-orange-500 to-orange-600 text-white';
            default:
                return 'from-gray-500 to-gray-600 text-white';
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        const newMessage = {
            id: chatMessages.length + 1,
            type: 'user' as const,
            message: chatMessage,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, newMessage]);
        setChatMessage('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: chatMessages.length + 2,
                type: 'bot' as const,
                message: 'Thank you for your message. Our team will get back to you soon. For immediate assistance, please call our hotline at 122.',
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <>
            <Head title="GoServePH - Government Services Portal" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <nav className="bg-white shadow-lg sticky top-0 z-40">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-4">
                                <img src="/images/caloocan-seal.png" alt="Caloocan Seal" className="h-12 w-12" />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">Caloocan City</h1>
                                    <p className="text-sm text-gray-600">Government Services Portal</p>
                                </div>
                            </div>
                            
                            {/* Desktop Menu */}
                            <div className="hidden md:flex items-center space-x-6">
                                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                                    Home
                                </Link>
                                <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
                                    Services
                                </Link>
                                <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                                    About
                                </Link>
                                <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                                    Contact
                                </Link>
                                <div className="flex space-x-3">
                                    <Link
                                        href="/login"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>

                        {/* Mobile Menu */}
                        {isMobileMenuOpen && (
                            <div className="md:hidden py-4 border-t border-gray-200">
                                <div className="flex flex-col space-y-4">
                                    <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Home
                                    </Link>
                                    <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Services
                                    </Link>
                                    <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        About
                                    </Link>
                                    <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Contact
                                    </Link>
                                    <div className="flex flex-col space-y-2 pt-4">
                                        <Link
                                            href="/login"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                                    Welcome to{' '}
                                    <span className="text-yellow-400">GoServePH</span>
                                </h1>
                                <p className="text-xl lg:text-2xl mb-8 text-blue-100">
                                    Your one-stop portal for all government services in Caloocan City
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/services"
                                        className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-center"
                                    >
                                        Explore Services
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                            <div className="relative">
                                <img
                                    src="/images/banner.jpg"
                                    alt="Caloocan City Banner"
                                    className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">
                                Our Services
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                We provide comprehensive government services to help you with your needs. 
                                Choose from our wide range of programs and assistance.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayServices.map((service, index) => (
                                <div
                                    key={index}
                                    className="service-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${getServiceColorClasses(service.color)} flex items-center justify-center mb-6`}>
                                        {getServiceIcon(service.icon)}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <Link
                                        href={service.href}
                                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
                                    >
                                        Learn More
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">
                                Why Choose GoServePH?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                We make government services accessible, efficient, and user-friendly for all residents.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Clock className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    24/7 Online Access
                                </h3>
                                <p className="text-gray-600">
                                    Access government services anytime, anywhere with our online portal.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    Fast Processing
                                </h3>
                                <p className="text-gray-600">
                                    Streamlined processes ensure quick and efficient service delivery.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Shield className="h-8 w-8 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    Secure & Reliable
                                </h3>
                                <p className="text-gray-600">
                                    Your data is protected with enterprise-grade security measures.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-20 bg-blue-600 text-white">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold mb-6">
                                    Need Help?
                                </h2>
                                <p className="text-xl mb-8 text-blue-100">
                                    Our support team is here to help you with any questions or concerns.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <Phone className="h-6 w-6 text-yellow-400" />
                                        <span className="text-lg">122 (Emergency Hotline)</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Mail className="h-6 w-6 text-yellow-400" />
                                        <span className="text-lg">helpdesk@caloocan.gov.ph</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <MapPin className="h-6 w-6 text-yellow-400" />
                                        <span className="text-lg">Caloocan City Hall, Caloocan City</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                                <h3 className="text-2xl font-semibold mb-6">Quick Contact Form</h3>
                                <form className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            placeholder="Your Message"
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-12">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <img src="/images/caloocan-seal.png" alt="Caloocan Seal" className="h-10 w-10" />
                                    <div>
                                        <h3 className="text-lg font-bold">Caloocan City</h3>
                                        <p className="text-sm text-gray-400">Government Services</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Providing efficient and accessible government services to all residents.
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Services</h4>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><Link href="/services/aics" className="hover:text-white transition-colors">AICS</Link></li>
                                    <li><Link href="/services/osca" className="hover:text-white transition-colors">OSCA</Link></li>
                                    <li><Link href="/services/pdao" className="hover:text-white transition-colors">PDAO</Link></li>
                                    <li><Link href="/services/livelihood" className="hover:text-white transition-colors">Livelihood</Link></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                    <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                                    <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p>📞 122 (Emergency)</p>
                                    <p>📧 helpdesk@caloocan.gov.ph</p>
                                    <p>📍 Caloocan City Hall</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                            <p>&copy; 2024 Caloocan City Government. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Chat Widget */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isChatOpen ? (
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="chat-widget bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                    >
                        <MessageCircle className="h-6 w-6" />
                    </button>
                ) : (
                    <div className="bg-white rounded-2xl shadow-2xl w-80 h-96 flex flex-col">
                        <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <MessageCircle className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Virtual Assistant</h3>
                                    <p className="text-xs text-blue-100">Online now</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="text-white hover:text-gray-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg ${
                                            msg.type === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        <p className="text-sm">{msg.message}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                            {msg.timestamp.toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}
