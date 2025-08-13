'use client';
import { useState, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

export default function ContactPage() {
  const [form, setForm] = useState({
    topic: 'Please Select ',
    firstName: '',
    lastName: '',
    companyName: '',
    jobTitle: '',
    email: '',
    message: '',
    captchaAnswer: '',
    notRobot: false
  });

  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2 });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(form.captchaAnswer) !== captcha.num1 + captcha.num2) {
      setStatus('❌ Wrong captcha answer.');
      return;
    }
    if (!form.notRobot) {
      setStatus('❌ Please confirm you are not a robot.');
      return;
    }

    setLoading(true);
    setStatus('');

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setStatus('✅ Message sent successfully!');
      setForm({
        topic: 'Please Select ',
        firstName: '',
        lastName: '',
        companyName: '',
        jobTitle: '',
        email: '',
        message: '',
        captchaAnswer: '',
        notRobot: false
      });
      generateCaptcha();
    } else {
      setStatus(`❌ ${data.error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
      {/* Form Container */}
      <div className="w-full max-w-2xl bg-white/80 p-8">
        <h1 className="text-md text-center uppercase text-[#FF6B00] mb-2">- Get in Touch -</h1>
        <h2 className="text-center mb-6 text-3xl">Send your query to PayNXT360</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Please complete the form below and we will be in touch as soon as we can
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Topic Dropdown */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              What would you like to talk to us about? *
            </label>
            <select
              name="topic"
              value={form.topic}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option>Please Select </option>
              <option>Consulting</option>
              <option>Demo and sales</option>
              <option>Media and PR</option>
              <option>Business Development / Content Distribution</option>
              <option>Other</option>
            </select>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
            />
          </div>

          {/* Captcha */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              The answer is ({captcha.num1} + {captcha.num2} = ?)
            </label>
            <input
              type="number"
              name="captchaAnswer"
              value={form.captchaAnswer}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Not a Robot */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="notRobot"
              checked={form.notRobot}
              onChange={handleChange}
              className="w-5 h-5 border-gray-300 rounded focus:ring-blue-400"
            />
            <label className="text-gray-700">I am not a robot</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? 'Sending...' : <>Submit <FaPaperPlane /></>}
          </button>
        </form>

        {status && <p className="mt-4 text-center text-sm font-medium">{status}</p>}
      </div>

      {/* Contact Info Grid */}
      <div className="mt-30 grid grid-rows -1 sm:grid-cols-2 lg:grid-cols-4 gap-40 text-center">
        {/* Office 1 */}
        <div className="flex flex-col items-center">
          <img src="/Images/office1.svg" alt="Head Office" className="w-16 h-16 mb-3" />
          <h3 className="text-lg font-semibold uppercase">England</h3>
          <p className="text-sm text-[#FF6B00]">europe@paynxt360.com</p>
          <p className="text-sm text-gray-500">25 Milcote Drive, Sutton Coldfield West Midlands, B73 6 QJ</p>
        </div>

        {/* Office 2 */}
        <div className="flex flex-col items-center">
          <img src="/Images/office2.svg" alt="Branch Office" className="w-16 h-16 mb-3" />
          <h3 className="text-lg font-semibold uppercase">Oregon</h3>
          <p className="text-sm text-[#FF6B00]">us@paynxt360.com</p>
          <p className="text-sm text-gray-500">Columbia Blvd Suite C15-544670 Portland, Oregon, 97217</p>
        </div>

        {/* Office 3 */}
        <div className="flex flex-col items-center">
          <img src="/Images/office3.svg" alt="Support Center" className="w-16 h-16 mb-3" />
          <h3 className="text-lg font-semibold uppercase">Bangalore</h3>
          <p className="text-sm text-[#FF6B00]">info@paynxt360.com</p>
          <p className="text-sm text-gray-500">Site #13, Reliaable Lifestyle, Kasavanahalli Main Road, Bangalore - 102</p>
        </div>

        {/* Office 4 */}
        <div className="flex flex-col items-center">
          <img src="/Images/office4.svg" alt="Asia Office" className="w-20 h-20 mb-3" />
          <h3 className="text-lg font-semibold uppercase">Mumbai</h3>
          <p className="text-sm text-[#FF6B00]">info@paynxt360.com</p>
          <p className="text-sm text-gray-500">Suite 801, Aster Tower, Gen A.K. Vaidya Marg, Malad East, Mumbai - 400097</p>
        </div>
      </div>
    </div>
  );
}
