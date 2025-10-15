import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">UPZ</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Urban Planning, Zoning & Housing Management System
          </p>
        </div>
        
        {/* Demo Account Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Accounts</h3>
          <div className="space-y-2 text-xs text-blue-700">
            <div className="flex justify-between">
              <span className="font-medium">Admin:</span>
              <span>admin@upzhms.com / admin123</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Zoning Officer:</span>
              <span>zoning@upzhms.com / password123</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Building Officer:</span>
              <span>building@upzhms.com / password123</span>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="Enter email address"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email}
              required
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              placeholder="Enter password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password}
              required
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="blue"
              className="w-full py-3 px-6 font-semibold"
              disabled={processing}
            >
              {processing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;