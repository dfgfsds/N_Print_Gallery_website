"use client";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import ApiUrls from "@/api-endpoints/ApiUrls";
import { useVendor } from "@/context/VendorContext";

export default function QuoteModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [form, setForm] = useState({
        name: "",
        contact_number: "",
        email: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { vendorId } = useVendor();

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await axios.post(ApiUrls?.sendQuoteRequest, { ...form, vendor_id: vendorId });
            if (res) {
                setForm({
                    name: "",
                    contact_number: "",
                    email: "",
                    description: "",
                });
                toast.success("Quote request sent successfully ✅");
                setError("");
                setSuccess("");
                setLoading(false);
                onClose();
            }
        } catch (err: any) {
            // console.log(err)
            setError(err?.response?.data?.message || "Something went wrong,Please try again later");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            ></div>

            {/* Modal Box */}
            <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6 z-10">
                <h2 className="text-lg font-bold mb-4">Get a Quote</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleFormChange}
                            className="w-full border rounded-md px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Contact Number
                        </label>
                        <input
                            type="text"
                            name="contact_number"
                            placeholder="+91 9876543210"
                            value={form.contact_number}
                            onChange={handleFormChange}
                            className="w-full border rounded-md px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="example@email.com"
                            value={form.email}
                            onChange={handleFormChange}
                            className="w-full border rounded-md px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter your requirements"
                            value={form.description}
                            onChange={handleFormChange}
                            className="w-full border rounded-md px-3 py-2 text-sm"
                            rows={3}
                            required
                        />
                    </div>

                    {/* Error / Success */}
                    {error && <p className="text-red-500 text-sm text-end">{error}</p>}
                    {success && <p className="text-green-600 text-sm text-end">{success}</p>}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm border rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-[#13cea1] text-white rounded-md hover:bg-[#0fb38b] disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
