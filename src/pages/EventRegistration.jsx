import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, registerForEvent } = useEvents();
  
  const event = events.find(e => e.id.toString() === id);
  
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    phone: '',
    department: '',
    type: 'attendee'
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const today = new Date().toISOString().split('T')[0];

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Event Not Found</h2>
        <button onClick={() => navigate('/')} className="ums-btn-primary bg-[#FCA24E] text-white px-6 py-2 rounded-lg font-bold">
          Back to Events
        </button>
      </div>
    );
  }

  if (event.date < today) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Registration Closed</h2>
        <p className="text-gray-600">This event has already passed.</p>
        <button onClick={() => navigate('/')} className="ums-btn-primary bg-[#FCA24E] text-white px-6 py-2 rounded-lg font-bold">
          Back to Events
        </button>
      </div>
    );
  }

  if (event.duty === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800">Waiting for the approval by higher authorities</h2>
        <p className="text-gray-600">You cannot register for this event yet.</p>
        <button onClick={() => navigate('/')} className="ums-btn-primary bg-[#FCA24E] text-white px-6 py-2 rounded-lg font-bold">
          Back to Events
        </button>
      </div>
    );
  }

  if (event.duty !== 'yes') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800">Not Approved</h2>
        <p className="text-gray-600">This event has not been approved for registration.</p>
        <button onClick={() => navigate('/')} className="ums-btn-primary bg-[#FCA24E] text-white px-6 py-2 rounded-lg font-bold">
          Back to Events
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const result = registerForEvent(event.id, formData.regNo, formData.type);
    
    if (result && !result.success) {
      setErrorMsg(result.message);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
        <p className="text-gray-600 mb-6">
          You have successfully registered for <strong>{event.title}</strong>.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="w-full py-3 bg-[#FCA24E] hover:bg-[#E5872E] text-white font-bold rounded-lg transition-colors"
        >
          Return to Events
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] flex justify-center py-8">
      <div className="max-w-5xl w-full space-y-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={24} />
          <span className="font-semibold text-lg">Back to Events</span>
        </button>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 font-medium">
            {errorMsg}
          </div>
        )}

        <div className="overflow-hidden rounded-xl">
        <div className="bg-[#FCA24E] p-8 text-white">
          <span className="text-sm font-bold uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded inline-block mb-3">
            {event.cat}
          </span>
          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          <p className="opacity-90 text-lg">By {event.org}</p>
          <div className="mt-4 inline-block px-4 py-1.5 bg-white/20 rounded-full text-base font-medium">
            Duty Leaves: {event.duty === 'yes' ? 'Provided' : event.duty === 'no' ? 'Not Provided' : 'Pending Approval'}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">Student Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">Full Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="ums-input py-3 text-base"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">Registration Number *</label>
              <input 
                type="text" 
                name="regNo"
                value={formData.regNo}
                onChange={handleChange}
                className="ums-input py-3 text-base"
                placeholder="12000000"
                required
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="ums-input py-3 text-base"
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">Department/Branch</label>
              <input 
                type="text" 
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="ums-input py-3 text-base"
                placeholder="B.Tech CSE"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-3">Registration Type</label>
              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    value="attendee"
                    checked={formData.type === 'attendee'}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#FCA24E] focus:ring-[#FCA24E] border-gray-300"
                  />
                  <span className="text-gray-700 font-medium text-lg">Attendee</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    value="volunteer"
                    checked={formData.type === 'volunteer'}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#FCA24E] focus:ring-[#FCA24E] border-gray-300"
                  />
                  <span className="text-gray-700 font-medium text-lg">Volunteer</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-2">Selfie Picture *</label>
              <input 
                type="file" 
                accept="image/*"
                required
                className="w-full text-base text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-base file:font-semibold file:bg-[#FCA24E]/10 file:text-[#FCA24E] hover:file:bg-[#FCA24E]/20"
              />
              <p className="text-sm text-gray-500 mt-2">Please upload a clear picture of your face.</p>
            </div>

            {formData.type === 'volunteer' && (
              <div className="md:col-span-2">
                <label className="block text-base font-semibold text-gray-700 mb-2">Signature *</label>
                <input 
                  type="file" 
                  accept="image/*"
                  required
                  className="w-full text-base text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-base file:font-semibold file:bg-[#FCA24E]/10 file:text-[#FCA24E] hover:file:bg-[#FCA24E]/20"
                />
                <p className="text-sm text-gray-500 mt-2">Required for volunteer registration.</p>
              </div>
            )}
          </div>

          <div className="pt-8">
            <button 
              type="submit" 
              className="w-full py-4 bg-[#FCA24E] hover:bg-[#E5872E] text-white font-bold text-xl rounded-lg transition-colors shadow-sm"
            >
              Confirm Registration
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
