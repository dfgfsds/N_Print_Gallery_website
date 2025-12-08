'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, Smartphone, KeyRound, X, Loader } from 'lucide-react';
import { getCartApi } from '../../api-endpoints/CartsApi';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { postSendSmsOtpUserApi, postVerifySmsOtpApi } from '../../api-endpoints/authendication';
import { baseUrl } from '../../api-endpoints/ApiUrls';

interface FormData {
  email?: string;
  password?: string;
  mobile?: string;
  otp?: string;
}

function LoginModal({ open, handleClose, vendorId }: any) {
  const [mounted, setMounted] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormData>();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [open]);

  // ✅ OTP LOGIN FLOW
  const handleSendOtp = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await postSendSmsOtpUserApi({
        contact_number: data.mobile,
        vendor_id: vendorId,
      });
      if (res?.data?.token) {
        toast.success('OTP sent!');
        setOtpSent(true);
        setToken(res.data.token);
        setLoading(false);

      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.error || 'Failed to send OTP');
    }
  };

  // useEffect to handle resend timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer, otpSent]);


  const handleVerifyOtp = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const res = await postVerifySmsOtpApi({
        otp: data.otp,
        token: token,
        login_type: "user",
        vendor_id: vendorId,
      });

      const userId = res?.data?.user_id;
      if (userId) {
        localStorage.setItem('userId', userId);
        const cartRes = await getCartApi(`user/${userId}`);
        if (cartRes) {
          localStorage.setItem('cartId', cartRes.data[0]?.id);
          handleClose();
          setLoading(false);
          window.location.reload();
        }
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.error || 'Invalid OTP');
    }
  };

  // ✅ EMAIL LOGIN FLOW
  const handleEmailLogin = async (data: FormData) => {
    try {
      const response: any = await axios.post(`${baseUrl}/user_login/`, {
        ...data,
        vendor_id: vendorId,
      });

      if (response?.data?.user_id) {
        toast.success('Login successful!');
        localStorage.setItem('userId', response?.data?.user_id);

        const updateApi = await getCartApi(`user/${response?.data?.user_id}`);
        localStorage.setItem('cartId', updateApi?.data[0]?.id);

        handleClose();
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Login failed')
      setError(err?.response?.data?.error || 'Login failed');
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Login</h2>
          <X className="cursor-pointer" onClick={handleClose} />
        </div>

        {/* Toggle Login Mode */}

        <div className="relative flex mb-6 bg-gray-100 p-1 rounded-full">
          {/* Sliding background */}
          <div
            className={`absolute top-1 left-1 w-1/2 h-[calc(100%-0.5rem)] rounded-full bg-[#13cea1] transition-all duration-300 ease-in-out ${isOtpMode ? 'translate-x-0' : 'translate-x-full'
              }`}
          ></div>

          <button
            onClick={() => {
              setIsOtpMode(true);
              setError('');
              reset();
            }}
            className={`w-1/2 py-2 rounded-full text-sm font-medium z-10 transition-all duration-300 ${isOtpMode ? 'text-white' : 'text-gray-700'
              }`}
          >
            Mobile Login
          </button>

          <button
            onClick={() => {
              setIsOtpMode(false);
              setOtpSent(false);
              setError('');
              reset();
            }}
            className={`w-1/2 py-2 rounded-full text-sm font-medium z-10 transition-all duration-300 ${!isOtpMode ? 'text-white' : 'text-gray-700'
              }`}
          >
            Email Login
          </button>
        </div>


        <form
          onSubmit={handleSubmit(isOtpMode ? (otpSent ? handleVerifyOtp : handleSendOtp) : handleEmailLogin)}
          className="space-y-6"
        >
          {isOtpMode ? (
            <>
              {/* Mobile Input */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <div className="mt-1 relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="mobile"
                    type="number"
                    {...register('mobile', {
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter valid mobile number',
                      },
                    })}
                    className="pl-10 block w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-red-700 focus:ring-red-600"
                  />
                </div>
                {errors.mobile && <p className="text-red-600 text-sm">{errors.mobile.message}</p>}
              </div>

              {/* OTP Field (only after sent) */}
              {otpSent && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
                  <div className="mt-1 relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="otp"
                      type="text"
                      maxLength={6}
                      {...register('otp', {
                        required: 'OTP is required',
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'Enter a 6-digit OTP',
                        },
                      })}
                      className="pl-10 block w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-red-600 focus:ring-red-500"
                    />
                  </div>
                  {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}


                  {otpSent && (
                    <button
                      type="button"
                      onClick={() => {
                        if (resendTimer === 0) {
                          handleSendOtp({ mobile: watch('mobile') });
                          setResendTimer(60);
                          setOtpDigits(Array(6).fill(''));
                        }
                      }}
                      disabled={resendTimer > 0}
                      className="mt-2 text-sm text-red-600 hover:underline disabled:opacity-50"
                    >
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  )}
                  <br />

                  {otpSent && (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setValue('otp', '');
                      }}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Change number
                    </button>
                  )}

                </div>
              )}
            </>
          ) : (
            <>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="pl-10 block w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-red-00 focus:ring-red-600"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    type={passwordShow ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required' })}
                    className="pl-10 pr-10 block w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-red-600 focus:ring-red-600"
                  />
                  {passwordShow ? (
                    <EyeOff onClick={() => setPasswordShow(false)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" />
                  ) : (
                    <Eye onClick={() => setPasswordShow(true)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" />
                  )}
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-red-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </>
          )}

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex gap-2 justify-center py-2 px-4 rounded-md text-white bg-[#13cea1] hover:bg-[#00aa81]"
          >
            {isOtpMode ? (otpSent ? 'Verify OTP & Login' : 'Send OTP') : 'Sign in'}
            {loading && <Loader className="animate-spin" />}
          </button>

          {!isOtpMode && (
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-red-600 font-medium hover:underline">
                Register
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
}

export default LoginModal;
