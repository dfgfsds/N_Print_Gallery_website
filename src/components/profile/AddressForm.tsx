// import { useState, useEffect } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { Loader, X } from 'lucide-react';
// import { postAddressCreateApi, updateAddressApi } from '../../api-endpoints/CartsApi';
// import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';


// interface AddressFormProps {
//   openModal: boolean;
//   handleClose: () => void;
//   editData: any;
// }

// export default function AddressForm({ openModal, handleClose, editData }: AddressFormProps) {
//   const [userId, setUserId] = useState<string | null>(null);
//   const [userName, setUserName] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     const storedUserName = localStorage.getItem('userName');

//     setUserId(storedUserId);
//     setUserName(storedUserName);
//   }, []);

//   const { control, handleSubmit, setValue, reset } = useForm<any>({
//     defaultValues: {
//       address_line1: editData?.address_line1 || '',
//       address_line2: editData?.address_line2 || '',
//       address_type: editData?.address_type || '',
//       city: editData?.city || '',
//       state: editData?.state || '',
//       postal_code: editData?.postal_code || '',
//       country: editData?.country || '',
//       landmark: editData?.landmark || '',
//     }
//   });

//   // Use useEffect to update form values when `editData` changes
//   useEffect(() => {
//     if (editData) {
//       setValue('address_line1', editData?.address_line1 || '');
//       setValue('address_line2', editData?.address_line2 || '');
//       setValue('address_type', editData?.address_type || '');
//       setValue('city', editData?.city || '');
//       setValue('state', editData?.state || '');
//       setValue('postal_code', editData?.postal_code || '');
//       setValue('country', editData?.country || '');
//       setValue('landmark', editData?.landmark || '');
//       setValue('contact_number', editData?.contact_number || '');
//       setValue('email_address', editData?.email_address || '');
//     }
//   }, [editData, setValue]);

//   // Return null if the modal is not open
//   if (!openModal) return null;

//   // Form submission handler
//   const onFormSubmit = async (data: any) => {
//     setLoading(true);
//     const formattedData = {
//       user: userId,
//       customer_name: userName,
//       address_line1: data.address_line1,
//       address_line2: data.address_line2,
//       contact_number: data.contact_number,
//       email_address: data.email_address,
//       address_type: data.address_type,
//       city: data.city,
//       state: data.state,
//       postal_code: data.postal_code,
//       country: data.country,
//       landmark: data.landmark,
//       ...(editData
//         ? { updated_by: userName || 'user' }
//         : { created_by: userName || 'user' }),
//       // selected_address: true,
//       // is_primary: true,
//     };
//     if (editData) {
//       try {
//         const response = await updateAddressApi(`${editData?.id}`, formattedData);
//         if (response) {
//           queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
//           reset()
//           handleClose();
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     } else {
//       try {
//         const response = await postAddressCreateApi('', formattedData);
//         if (response) {
//           queryClient.invalidateQueries(['postGoalType'] as InvalidateQueryFilters);
//           reset()
//           handleClose();
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     }

//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 !bg-opacity-75 flex justify-center items-center z-50">
//       <div
//         className="bg-white p-6 rounded-lg shadow-lg w-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between">
//           <h2 className="text-xl font-semibold mb-4">{editData ? 'Edit Address':'Add Your Address'}</h2>
//           <span onClick={()=>{
//             handleClose();
//             reset();
//             }} className="cursor-pointer">
//             <X className='cursor-pointer' />
//           </span>
//         </div>

//         <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//              <div>
//               <label htmlFor="email_address" className="block text-sm font-medium text-black">Email</label>
//               <Controller
//                 control={control}
//                 name="email_address"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="email_address"
//                     required
//                     className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                   />
//                 )}
//               />
//             </div>
//             <div>
//               <label htmlFor="contact_number" className="block text-sm font-medium text-black">Contact</label>
//               <Controller
//                 control={control}
//                 name="contact_number"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="contact_number"
//                     required
//                     className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                   />
//                 )}
//               />
//             </div>
//             <div>
//               <label htmlFor="address_line1" className="block text-sm font-medium text-black">Address Line 1</label>
//               <Controller
//                 control={control}
//                 name="address_line1"
//                 render={({ field }) => (
//                   <textarea
//                     {...field}
//                     id="address_line1"
//                     required
//                     className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                   />
//                 )}
//               />
//             </div>

//             <div>
//               <label htmlFor="address_line2" className="block text-sm font-medium text-black">Address Line 2</label>
//               <Controller
//                 control={control}
//                 name="address_line2"
//                 render={({ field }) => (
//                   <textarea
//                     {...field}
//                     id="address_line2"
//                     required
//                     className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                   />
//                 )}
//               />
//             </div>
           
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="address_type" className="block text-sm font-medium text-black">Address Type</label>
//               <Controller
//                 control={control}
//                 name="address_type"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="address_type"
//                     required
//                     className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                   />
//                 )}
//               />
//             </div>
//             <div>
//               <label htmlFor="city" className="block text-sm font-medium text-black">City</label>
//               <Controller
//                 control={control}
//                 name="city"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="city"
//                     required
//                     className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                   />
//                 )}
//               />
//             </div>

//             <div>
//               <label htmlFor="state" className="block text-sm font-medium text-black">State</label>
//               <Controller
//                 control={control}
//                 name="state"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="state"
//                     required
//                     className="mt-1 block p-1 w-full border rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                   />
//                 )}
//               />
//             </div>
//             <div>
//               <label htmlFor="postal_code" className="block text-sm font-medium text-black">Pin Code</label>
//               <Controller
//                 control={control}
//                 name="postal_code"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     type='number'
//                     id="postal_code"
//                     maxLength={6}
//                     required
//                     className="mt-1 block p-1 w-full border rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                   />
//                 )}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="country" className="block text-sm font-medium text-black">Country</label>
//               <Controller
//                 control={control}
//                 name="country"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="country"
//                     required
//                     className="mt-1 block p-1 w-full border rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                   />
//                 )}
//               />
//             </div>

//             <div>
//               <label htmlFor="landmark" className="block text-sm font-medium text-black">Landmark</label>
//               <Controller
//                 control={control}
//                 name="landmark"
//                 render={({ field }) => (
//                   <textarea
//                     {...field}
//                     id="landmark"
//                     // required
//                     className="mt-1 block p-1 border w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                   />
//                 )}
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-4 pt-4">
//             <button
//               type="button"
//               onClick={()=>{
//                 handleClose()
//                 reset()
//               }}
//               className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="cursor-pointer px-4 py-2 bg-[#13cea1] text-white font-bold rounded-md text-sm hover:bg-[#4db49c] disabled:opacity-50 flex gap-2"
//             >
//               Save {loading ? (<Loader className="animate-spin" size={20} />) : ''}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { Loader, X } from 'lucide-react';
// import { postAddressCreateApi, updateAddressApi } from '../../api-endpoints/CartsApi';
// import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import { useUser } from '../../context/UserContext';

// interface AddressFormProps {
//   openModal: boolean;
//   handleClose: () => void;
//   editData: any;
// }

// export function AddressForm({ openModal, handleClose, editData }: AddressFormProps) {
//   const userId = localStorage.getItem('userId');
//   const userName = localStorage.getItem('userName');
//   const [loading, setLoading] = useState(false);
//   const queryClient = useQueryClient();
//   const { user }: any = useUser();

//   const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<any>({
//     defaultValues: {
//       address_line1: editData?.address_line1 || '',
//       address_line2: editData?.address_line2 || '',
//       address_type: editData?.address_type || '',
//       city: editData?.city || '',
//       state: editData?.state || '',
//       postal_code: editData?.postal_code || '',
//       country: editData?.country || '',
//       landmark: editData?.landmark || '',
//     }
//   });

//   // Use useEffect to update form values when `editData` changes
//   useEffect(() => {
//     if (editData) {
//       setValue('address_line1', editData?.address_line1 || '');
//       setValue('address_line2', editData?.address_line2 || '');
//       setValue('address_type', editData?.address_type || '');
//       setValue('city', editData?.city || '');
//       setValue('state', editData?.state || '');
//       setValue('postal_code', editData?.postal_code || '');
//       setValue('country', editData?.country || '');
//       setValue('landmark', editData?.landmark || '');
//       setValue('email_address', editData?.email_address || '');
//       setValue('contact_number', editData?.contact_number || '');
//     }
//   }, [editData, setValue]);

//   // Return null if the modal is not open
//   if (!openModal) return null;

//   // Form submission handler
//   const onFormSubmit = async (data: any) => {
//     setLoading(true);
//     const formattedData = {
//       user: userId,
//       address_line1: data.address_line1,
//       address_line2: data.address_line2,
//       address_type: data.address_type,
//       city: data.city,
//       state: data.state,
//       postal_code: data.postal_code,
//       country: data.country,
//       landmark: data.landmark,
//       ...(editData
//         ? { updated_by: userName || 'user' }
//         : { created_by: userName || 'user' }),
//       contact_number: data?.contact_number,
//       customer_name: user?.data?.name,
//       email_address: data?.email_address,
//     };
//     if (editData) {
//       try {
//         const response = await updateAddressApi(`${editData?.id}`, formattedData);
//         if (response) {
//           queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
//           handleClose();
//           setLoading(false);
//           reset();
//         }
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     } else {
//       try {
//         const response = await postAddressCreateApi('', formattedData);
//         if (response) {
//           queryClient.invalidateQueries(['postGoalType'] as InvalidateQueryFilters);
//           handleClose();
//           setLoading(false);
//           reset();
//         }
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     }

//     // const payload={

//     //     vendor: 27,
//     //     company_name: "justvy",
//     //     pickup_location: "chennai",
//     //     address_type: "home",
//     //     address_line1: "123 Main Street",
//     //     address_line2: "Apt 101",
//     //     city: "chennai",
//     //     state: "NY",
//     //     postal_code: "600002",
//     //     country: "india",
//     //     landmark: "Near Central Park",
//     //     latitude: 40.712776,
//     //     longitude: -74.005974,
//     //     is_primary: true,
//     //   // created_by: "system",
//     //   updated_by: "Vendor",
//     //      selected_address: false
//     // }
//     // const update=await axios.put('https://ecomapi.ftdigitalsolutions.org/vendor_address/15/',payload)
//     // const update=await axios.patch('https://ecomapi.ftdigitalsolutions.org/update-selected-address/vendor/27/address/15/',
//     //   {



//     //     updated_by: "vendor"
//     //   }
//     // )

//     // const payload ={
//     //     payment_gateway_client_id: "rzp_live_N9L8M3E4qySTlw",
//     //     delivery_partner_client_id: "udayadhanabal@gmail.com",
//     //     payment_gateway_api_key: "t5lQi8Mf7NTpLpgKJRCKncCe",
//     //     delivery_partner_api_key: "Ud@26122001justvy!",
//     //     payment_gateway: "razorpay",
//     //     delivery_partner: "shiprocket",
//     //     delivery_auth_token: "",
//     //     // own_delivery_charge: null,
//     //     own_cod_delivery_charge: "0",
//     //     // own_courier_company_id: null,
//     //     updated_by: "Vendor",
//     //     // id: 21,

//     // }
//     // try {
//     // const upadetApi=await axios.put('https://ecomapi.ftdigitalsolutions.org/vendor-site-details/21/',payload)
//     // if(upadetApi){
//     //   setLoading(false)
//     // }
//     // } catch (error) {
//     //   setLoading(false)

//     // }

//   };

//   return (
//     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//       <div
//         className="bg-white p-6 rounded-lg shadow-lg w-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between">
//           <h2 className="text-xl font-semibold mb-4">Add Your Address</h2>
//           <span onClick={handleClose} className="cursor-pointer">
//             <X />
//           </span>
//         </div>

//         <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
//               <Controller
//                 control={control}
//                 name="address_line1"
//                 render={({ field }) => (
//                   <textarea
//                     {...field}
//                     id="address_line1"
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 )}
//               />
//             </div>

//             <div>
//               <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700">Address Line 2</label>
//               <Controller
//                 control={control}
//                 name="address_line2"
//                 render={({ field }) => (
//                   <textarea
//                     {...field}
//                     id="address_line2"
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 )}
//               />
//             </div>
//             <div>
//               <label htmlFor="email_address" className="block text-sm font-medium text-gray-700">Email</label>
//               <Controller
//                 control={control}
//                 name="email_address"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="email_address"
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 )}
//               />
//             </div>
//             <div>
//               <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">Contact</label>
//               <Controller
//                 control={control}
//                 name="contact_number"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="contact_number"
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 )}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="address_type" className="block text-sm font-medium text-gray-700">Address Type</label>
//               <Controller
//                 control={control}
//                 name="address_type"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="address_type"
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 )}
//               />
//             </div>
//             <div>
//               <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
//               <Controller
//                 control={control}
//                 name="city"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="city"
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 )}
//               />
//             </div>

//             <div>
//               <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
//               <Controller
//                 control={control}
//                 name="state"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="state"
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 )}
//               />
//             </div>
//             <div>
//               <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Pin Code</label>
//               <Controller
//                 control={control}
//                 name="postal_code"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="postal_code"
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 )}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
//               <Controller
//                 control={control}
//                 name="country"
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     id="country"
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 )}
//               />
//             </div>

//             <div>
//               <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">Landmark</label>
//               <Controller
//                 control={control}
//                 name="landmark"
//                 render={({ field }) => (
//                   <textarea
//                     {...field}
//                     id="landmark"
//                     // required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 )}
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-4 pt-4">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex gap-2"
//             >
//               Save {loading ? (<Loader className="animate-spin" size={20} />) : ''}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Loader, X } from "lucide-react";
import { postAddressCreateApi, updateAddressApi } from "../../api-endpoints/CartsApi";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../context/UserContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface AddressFormProps {
  openModal: boolean;
  handleClose: () => void;
  editData: any;
}

const schema = yup.object({
  customer_name: yup.string().trim().required("Name is required"),
  email_address: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email (e.g. example@gmail.com)"),
  address_line1: yup.string().trim().required("Address Line 1 is required"),
  address_line2: yup.string().trim().required("Address Line 2 is required"),
  contact_number: yup
    .string()
    .required("Contact number is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
  address_type: yup.string().trim().required("Address type is required"),
  city: yup.string().trim().required("City is required"),
  state: yup.string().trim().required("State is required"),
  postal_code: yup
    .string()
    .required("Pin code is required")
    .matches(/^[0-9]{6}$/, "Enter a valid 6-digit pin code"),
  country: yup.string().trim().required("Country is required"),
  landmark: yup.string().nullable(),
}).required();

export function AddressForm({ openModal, handleClose, editData }: AddressFormProps) {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { user }: any = useUser();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      customer_name: editData?.customer_name || "",
      email_address: editData?.email_address || "",
      address_line1: editData?.address_line1 || "",
      address_line2: editData?.address_line2 || "",
      contact_number: editData?.contact_number || "",
      address_type: editData?.address_type || "",
      city: editData?.city || "",
      state: editData?.state || "",
      postal_code: editData?.postal_code || "",
      country: editData?.country || "",
      landmark: editData?.landmark || "",
    },
  });

  // watchers for live helper messages
  const pinCode = useWatch({ control, name: "postal_code" });
  const email = useWatch({ control, name: "email_address" });
  const contact = useWatch({ control, name: "contact_number" });

  useEffect(() => {
    if (editData) {
      Object.entries(editData).forEach(([key, value]) => {
        setValue(key, value ?? "");
      });
    }
  }, [editData, setValue]);

  if (!openModal) return null;

  const onFormSubmit = async (data: any) => {
    setLoading(true);

    const formattedData = {
      user: userId,
      ...data,
      customer_name: user?.data?.name || data.customer_name,
      ...(editData
        ? { updated_by: userName || "user" }
        : { created_by: userName || "user" }),
    };

    try {
      if (editData) {
        await updateAddressApi(`${editData?.id}`, formattedData);
        queryClient.invalidateQueries(["getAddressData"] as InvalidateQueryFilters);
      } else {
        await postAddressCreateApi("", formattedData);
        queryClient.invalidateQueries(["postGoalType"] as InvalidateQueryFilters);
      }

      handleClose();
      reset();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[9999]">
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold mb-2">
            {editData ? "Edit Address" : "Add Your Address"}
          </h2>
          <span
            className="cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={() => {
              handleClose();
              reset();
            }}
          >
            <X />
          </span>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-3">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium">Name</label>
              <Controller
                control={control}
                name="customer_name"
                render={({ field }) => (
                  <input
                    {...field}
                    className={`mt-1 block w-full p-2 border rounded-md ${
                      errors.customer_name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.customer_name && (
                <p className="text-sm text-red-600 mt-1">
                  {String((errors.customer_name as any)?.message ?? errors.customer_name)}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Controller
                control={control}
                name="email_address"
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    className={`mt-1 block w-full p-2 border rounded-md ${
                      errors.email_address ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.email_address && (
                <p className="text-sm text-red-600 mt-1">
                  {String((errors.email_address as any)?.message ?? errors.email_address)}
                </p>
              )}
              {/* live hint (optional) */}
              {/* {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                <p className="text-sm text-gray-500 mt-1">Looks invalid — example@gmail.com</p>
              )} */}
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-sm font-medium">Address Line 1</label>
              <Controller
                control={control}
                name="address_line1"
                render={({ field }) => (
                  <textarea
                    {...field}
                    className={`mt-1 block w-full p-2 border rounded-md ${
                      errors.address_line1 ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.address_line1 && (
                <p className="text-sm text-red-600 mt-1">{String((errors.address_line1 as any)?.message)}</p>
              )}
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="block text-sm font-medium">Address Line 2</label>
              <Controller
                control={control}
                name="address_line2"
                render={({ field }) => (
                  <textarea
                    {...field}
                    className={`mt-1 block w-full p-2 border rounded-md ${
                      errors.address_line2 ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.address_line2 && (
                <p className="text-sm text-red-600 mt-1">{String((errors.address_line2 as any)?.message)}</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium">Contact</label>
              <Controller
                control={control}
                name="contact_number"
                render={({ field }) => (
                  <input
                    {...field}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) field.onChange(value);
                    }}
                    className={`mt-1 block w-full p-2 border rounded-md ${
                      errors.contact_number ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.contact_number && (
                // <p className="text-sm text-red-600 mt-1">{errors.contact_number.message}</p>
                <p className="text-sm text-red-600 mt-1">{String((errors.contact_number as any)?.message)}</p>

              )}
              {/* {contact && contact.length > 0 && contact.length < 10 && (
                <p className="text-sm text-red-600 mt-1">Enter a valid 10-digit mobile number</p>
              )} */}
            </div>

            {/* Address Type (ADDED + validation) */}
            <div>
              <label className="block text-sm font-medium">Address Type</label>
              <Controller
                control={control}
                name="address_type"
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="e.g. Home, Office"
                    className={`mt-1 block w-full p-2 border rounded-md ${
                      errors.address_type ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.address_type && (
                // <p className="text-sm text-red-600 mt-1">{errors.address_type.message}</p>
                <p className="text-sm text-red-600 mt-1">{String((errors.address_type as any)?.message)}</p>

              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium">City</label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <input
                    {...field}
                    className={`mt-1 block w-full p-2 border rounded-md ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.city && (
                <p className="text-sm text-red-600 mt-1">{String((errors.city as any)?.message)}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium">State</label>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <input
                    {...field}
                    className={`mt-1 block w-full p-2 border rounded-md ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.state && (
                <p className="text-sm text-red-600 mt-1">{String((errors.state as any)?.message)}</p>
              )}
            </div>

            {/* Pin Code */}
            <div>
              <label className="block text-sm font-medium">Pin Code</label>
              <Controller
                control={control}
                name="postal_code"
                render={({ field }) => (
                  <input
                    {...field}
                    maxLength={6}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                    className={`mt-1 block w-full p-2 border rounded-md ${
                      errors.postal_code ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.postal_code && (
                <p className="text-sm text-red-600 mt-1">{String((errors.postal_code as any)?.message)}</p>
              )}
              {pinCode && pinCode.length > 0 && pinCode.length !== 6 && (
                <p className="text-sm text-red-600 mt-1">Enter a valid 6-digit pin code</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium">Country</label>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <input
                    {...field}
                    className={`mt-1 block w-full p-2 border rounded-md ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.country && (
                <p className="text-sm text-red-600 mt-1">{String((errors.country as any)?.message)}</p>
              )}
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-sm font-medium">Landmark</label>
              <Controller
                control={control}
                name="landmark"
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="mt-1 block w-full p-2 border rounded-md border-gray-300"
                  />
                )}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                handleClose();
                reset();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#a8822d] text-white rounded-md hover:bg-[#977526] disabled:opacity-50 flex items-center gap-2"
            >
              Save
              {loading && <Loader size={18} className="animate-spin" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
