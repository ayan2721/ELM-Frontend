import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveAPI } from '../services/api';
import { 
  PlusIcon,
  XMarkIcon,
  DocumentArrowUpIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leave_type: 'sick',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload PDF, JPG, PNG, DOC, or DOCX files only.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size allowed is 5MB.');
        return;
      }
      setAttachment(file);
      setError('');
    }
  };

  const removeFile = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const submitData = new FormData();

    submitData.append('leave_type', formData.leave_type);
    submitData.append('start_date', formData.start_date);
    submitData.append('end_date', formData.end_date);
    submitData.append('reason', formData.reason);

    // ✅ IMPORTANT: must match backend "file"
    if (attachment) {
      submitData.append('file', attachment);
    }

    await leaveAPI.applyLeave(submitData);

    setSuccess('🎉 Leave request submitted successfully!');

    setFormData({
      leave_type: 'sick',
      start_date: '',
      end_date: '',
      reason: ''
    });

    setAttachment(null);
    fileInputRef.current.value = '';

    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);

  } catch (error) {
    setError(
      error.response?.data?.message ||
      'Failed to submit leave request'
    );
  } finally {
    setLoading(false);
  }
};
  const leaveTypes = [
    { value: 'sick', label: 'Sick Leave', icon: '😷', color: 'from-rose-500 to-red-600' },
    { value: 'vacation', label: 'Vacation Leave', icon: '🏖️', color: 'from-emerald-500 to-teal-600' },
    { value: 'personal', label: 'Personal Leave', icon: '👤', color: 'from-indigo-500 to-purple-600' },
    { value: 'maternity', label: 'Maternity Leave', icon: '👩‍🍼', color: 'from-pink-500 to-rose-600' },
    { value: 'paternity', label: 'Paternity Leave', icon: '👨‍👧', color: 'from-blue-500 to-indigo-600' }
  ];

  const getDaysBetween = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
            <PlusIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-emerald-900 bg-clip-text text-transparent mb-4">
            Apply for Leave
          </h1>
          <p className="text-xl text-slate-600 max-w-md mx-auto leading-relaxed">
            Submit your leave request with optional supporting documents
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-500 p-10 lg:p-12">
          {/* Messages */}
          {error && (
            <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-3xl shadow-lg animate-pulse">
              <div className="flex items-start gap-3">
                <XMarkIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-semibold text-red-900">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-3xl shadow-lg">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-semibold text-emerald-900">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Leave Type */}
            <div>
              <label className="block text-xl font-bold text-slate-900 mb-4">
                Leave Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaveTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-opacity-100 ${
                      formData.leave_type === type.value
                        ? `bg-gradient-to-r ${type.color} border-transparent shadow-2xl -translate-y-1 scale-[1.02]`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="leave_type"
                      value={type.value}
                      checked={formData.leave_type === type.value}
                      onChange={handleChange}
                      className="sr-only"
                      required
                    />
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0 ${
                        formData.leave_type === type.value ? 'bg-white/20 backdrop-blur-sm shadow-white/20' : 'bg-slate-100 shadow-md'
                      }`}>
                        {type.icon}
                      </div>
                      <div>
                        <div className={`font-bold text-lg transition-colors ${
                          formData.leave_type === type.value ? 'text-white' : 'text-slate-900'
                        }`}>
                          {type.label}
                        </div>
                      </div>
                    </div>
                    {formData.leave_type === type.value && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-3xl blur animate-ping"></div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div>
              <label className="block text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <CalendarIcon className="w-7 h-7 text-indigo-600" />
                Leave Dates
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-3xl border border-slate-200 shadow-inner">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 text-lg font-semibold hover:shadow-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 text-lg font-semibold hover:shadow-md"
                    required
                  />
                </div>
                {formData.start_date && formData.end_date && (
                  <div className="md:col-span-2 pt-4 px-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl shadow-lg text-center font-bold text-lg">
                      📅 {getDaysBetween()} day{getDaysBetween() !== 1 ? 's' : ''} total
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <ChatBubbleLeftIcon className="w-7 h-7 text-indigo-600" />
                Reason for Leave
              </label>
              <textarea
                name="reason"
                rows={5}
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please provide a detailed explanation for your leave request. Include any relevant details that will help your manager make an informed decision..."
                className="w-full px-6 py-6 rounded-3xl border-2 border-slate-200 bg-white text-slate-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 md:text-lg text-base font-medium resize-vertical min-h-[160px] hover:shadow-xl placeholder-slate-400"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <DocumentArrowUpIcon className="w-7 h-7 text-indigo-600" />
                Supporting Document (Optional)
              </label>
              <div className={`group relative p-10 rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-300 ${
                attachment 
                  ? 'border-emerald-300 bg-emerald-50/50 shadow-lg' 
                  : 'border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-indigo-50'
              }`}>
                {attachment ? (
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-md">
                    <div className="flex items-center gap-4 truncate">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <DocumentArrowUpIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 truncate">{attachment.name}</p>
                        <p className="text-sm text-slate-500">5MB max • Ready to upload</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-2 hover:bg-red-100 rounded-2xl text-red-500 hover:text-red-700 transition-all group-hover:scale-110"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <DocumentArrowUpIcon className="w-20 h-20 mx-auto text-slate-400 mb-6 group-hover:scale-110 transition-transform" />
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">Drop your document here</h3>
                        <p className="text-slate-600">or click to browse</p>
                        <div className="flex justify-center">
                          <label
                            htmlFor="document"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <PlusIcon className="w-4 h-4" />
                            Choose File
                          </label>
                          <input
                            id="document"
                            name="document"
                            type="file"
                            ref={fileInputRef}
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileChange}
                          />
                        </div>
                        <p className="text-xs text-slate-500">PDF, JPG, PNG, DOC, DOCX up to 5MB</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-8 border-t border-slate-200 justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 text-base font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.reason.trim()}
                className="px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Leave Request
                    <CheckCircleIcon className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;