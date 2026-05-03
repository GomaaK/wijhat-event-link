'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking } from '@/lib/db';
import type { Tour, TourSlot } from '@/lib/types';

interface CheckoutFormProps {
  tour: Tour;
  slot: TourSlot;
  guests: number;
  total: number;
}

type Step = 'details' | 'account' | 'confirm';

export default function CheckoutForm({ tour, slot, guests, total }: CheckoutFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    nationality: 'Saudi',
    specialRequests: '',
    createAccount: false,
    password: '',
    confirmPassword: '',
  });

  const updateForm = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateDetails = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.trim() || !form.email.includes('@')) return 'Valid email is required';
    if (!form.phone.trim()) return 'Phone number is required';
    return null;
  };

  const validateAccount = () => {
    if (!form.createAccount) return null;
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleNext = () => {
    const err = step === 'details' ? validateDetails() : validateAccount();
    if (err) { setError(err); return; }
    setError('');
    if (step === 'details') setStep('account');
    else if (step === 'account') setStep('confirm');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const booking = await createBooking({
        tourId: tour.id,
        slotId: slot.id,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        customerNationality: form.nationality,
        numGuests: guests,
        totalPrice: total,
        specialRequests: form.specialRequests,
      });

      setVoucherCode(booking.voucher_code);
      setShowSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center animate-slide-up">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Reservation Confirmed!</h2>
        <p className="text-stone-500 mb-6">
          Your spot has been reserved. Save your voucher code below.
        </p>

        <div className="bg-stone-50 rounded-xl p-6 mb-6">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Voucher Code</p>
          <p className="text-3xl font-mono font-bold text-emerald-800 tracking-widest">{voucherCode}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`/voucher/${voucherCode}`}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl transition-colors"
          >
            View Voucher
          </a>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors"
          >
            Browse More
          </button>
        </div>

        <p className="text-xs text-stone-400 mt-6">
          A confirmation has been sent to {form.email}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {(['details', 'account', 'confirm'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === s ? 'bg-emerald-800 text-white' :
              ['details', 'account', 'confirm'].indexOf(step) > i ? 'bg-emerald-200 text-emerald-800' :
              'bg-stone-200 text-stone-500'
            }`}>
              {['details', 'account', 'confirm'].indexOf(step) > i ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${
              step === s ? 'text-stone-900' : 'text-stone-400'
            }`}>
              {s === 'details' ? 'Your Details' : s === 'account' ? 'Account (Optional)' : 'Confirm'}
            </span>
            {i < 2 && <div className={`flex-1 h-0.5 ${['details', 'account', 'confirm'].indexOf(step) > i ? 'bg-emerald-200' : 'bg-stone-200'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Details */}
      {step === 'details' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => updateForm('name', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => updateForm('email', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => updateForm('phone', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900"
              placeholder="+966 5XX XXX XXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Nationality</label>
            <select
              value={form.nationality}
              onChange={e => updateForm('nationality', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 bg-white"
            >
              {['Saudi', 'UAE', 'Kuwait', 'Bahrain', 'Qatar', 'Oman', 'Egypt', 'Jordan', 'Lebanon', 'USA', 'UK', 'Germany', 'France', 'India', 'Pakistan', 'Other'].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Special Requests</label>
            <textarea
              value={form.specialRequests}
              onChange={e => updateForm('specialRequests', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900 resize-none"
              placeholder="Any dietary requirements, accessibility needs, etc."
            />
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Optional Account */}
      {step === 'account' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl">
            <svg className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-stone-700 font-medium">Create an account? (Optional)</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Skip this to check out as a guest. Creating an account lets you view past bookings and rebook faster.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.createAccount}
              onChange={e => updateForm('createAccount', e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-stone-700">Yes, create my account</span>
          </label>

          {form.createAccount && (
            <div className="space-y-4 pl-1 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => updateForm('password', e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900"
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => updateForm('confirmPassword', e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-900"
                  placeholder="Re-enter password"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setStep('details'); setError(''); }}
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl transition-colors"
            >
              {form.createAccount ? 'Create & Continue' : 'Continue as Guest'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 'confirm' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-stone-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Name</span>
              <span className="text-stone-900 font-medium">{form.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Email</span>
              <span className="text-stone-900 font-medium">{form.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Phone</span>
              <span className="text-stone-900 font-medium">{form.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Account</span>
              <span className="text-stone-900 font-medium">{form.createAccount ? 'Yes (new account)' : 'Guest checkout'}</span>
            </div>
            {form.specialRequests && (
              <div className="flex justify-between">
                <span className="text-stone-500">Special Requests</span>
                <span className="text-stone-900 font-medium text-right max-w-[200px]">{form.specialRequests}</span>
              </div>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 mt-0.5"
            />
            <span className="text-xs text-stone-500">
              I agree that this is a reservation and no payment is required now. I understand the admin team will confirm availability and payment details.
            </span>
          </label>

          <div className="flex gap-3">
            <button
              onClick={() => { setStep('account'); setError(''); }}
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Confirm Reservation'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
