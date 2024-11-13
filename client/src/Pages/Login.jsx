import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://100.64.238.95:8080/api/login`, {
        email,
        password,
      });
      setSuccess('Login successful');
      setError('');
      console.log(response.data);
      login(response.data.name, response.data.email);
      navigate('/listBookings', {
        state: { name: response.data.name, email: response.data.email },
      });
    } catch (err) {
      setError('Login failed');
      setSuccess('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gray-900 text-white flex-col items-center justify-center p-8">
          <img
            src="https://via.placeholder.com/200"
            alt="Card"
            className="mb-4"
          />
          <h3 className="text-2xl font-semibold mb-2">Welcome Back!</h3>
          <p className="text-sm text-gray-300">
            Login to access your account and continue booking with us.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
            Login
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>
          </form>

          <div className="flex justify-between items-center mt-6">
            <Link
              to="/register"
              className="text-sm text-blue-500 hover:underline"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
