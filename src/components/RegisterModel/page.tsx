"use client";
import { postCreateUserAPi } from "../../api-endpoints/authendication";
import { postCartCreateApi } from "../../api-endpoints/CartsApi";
import { useAuthRedirect } from "../../context/useAuthRedirect";
import { useVendor } from "../../context/VendorContext";
import { Eye, EyeOff, Loader, Lock, Mail, Phone, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";


function RegisterModel({open,handleClose}:any) {
    const [mounted, setMounted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('')
    const [error, setError] = useState('');
    const { vendorId } = useVendor();
    const router = useRouter();
    const [passwordShow, setPasswordShow] = useState(false);
    const imageUrl = 'https://img.freepik.com/free-vector/smiling-young-man-hoodie_1308-176157.jpg?t=st=1742883789~exp=1742887389~hmac=276a954f79d559893475b0e8f8b90da7f45a713cad804b0a8a3e57668378105b&w=740';
    const [loading, setLoading] = useState(false);
    useAuthRedirect({ redirectIfAuthenticated: true });
    // Safe to use hooks here
    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'auto';
            };
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        const payload = {
            name: name,
            email: email,
            password: password,
            contact_number: mobile,
            vendor: vendorId,
            created_by: name,
            profile_image: imageUrl
        }
        try {
            const response = await postCreateUserAPi(payload);
            if (response) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('userId', response?.data?.user?.id)
                    localStorage.setItem('userName', response?.data?.user?.name)
                }
                const updateApi = await postCartCreateApi('', { user: response?.data?.user?.id, vendor: vendorId, created_by: response?.data?.user?.name });
                if (updateApi) {
                    setLoading(false);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('cartId', updateApi?.data?.id);
                    }
                    router.push('/shop');
                    window.location.reload();
                }
            }

        } catch (err: any) {
            setLoading(false);
            setError(err?.response?.data?.error || ' Something went wrong, please try again later.');
        }
    };

    // Don't render on server or if not open
    if (!mounted || !open) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/10 flex justify-center items-center z-[999]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                     <span onClick={handleClose}><X className="cursor-pointer" /></span>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-4 px-4 shadow sm:rounded-lg sm:px-10">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1 relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1 relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">
                                    Mobile
                                </label>
                                <div className="mt-1 relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        id="contact_number"
                                        type="number"
                                        required
                                        value={mobile}
                                        maxLength={10}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500"
                                    />
                                </div>
                            </div>


                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        id="password"
                                        type={`${passwordShow ? 'text' : 'password'}`}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500"
                                    />
                                    {passwordShow ? (
                                        <EyeOff onClick={() => setPasswordShow(false)} className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />

                                    ) : (
                                        <Eye onClick={() => setPasswordShow(true)} className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    )}
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex gap-2 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#13cea1] hover:bg-[#4db49c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Create Account {loading && <Loader className='animate-spin' />}
                            </button>

                            <p className="text-sm text-gray-600 text-center">
                                Already have an account?{' '}
                                <Link href="/" className="font-medium text-red-600 hover:text-red-600">
                                    Sign in
                                </Link>
                            </p>
                        </form>

                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default RegisterModel;
