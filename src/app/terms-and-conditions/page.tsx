
// "use client";

// export default function TermsAndConditions() {
//   return (
//     <div className="bg-gray-50 min-h-screen py-12 px-6 md:px-20">
//       <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-12">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">
//           Terms & Conditions
//         </h1>

//         <p className="text-gray-600 mb-8">
//           <strong>Company Name:</strong> Hardware Dynamic <br />
//           <strong>Address:</strong> No. 45/46, 1st Floor, Giri Road, T. Nagar,
//           Chennai – 600 017 <br />
//           <strong>Phone:</strong> 8248225310 <br />
//           <strong>Email:</strong> hardwaredynamic1@gmail.com
//         </p>

//         <p className="text-sm text-gray-500 mb-10">
//           <strong>Effective Date:</strong> 10 June 2025
//         </p>

//         <section className="space-y-6">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               1. General
//             </h2>
//             <p className="text-gray-600">
//               These Terms govern your use of our website and services. By
//               placing an order, you confirm that you are legally capable of
//               entering into binding contracts. We reserve the right to update or
//               change these Terms at any time without prior notice.
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               2. Orders & Payments
//             </h2>
//             <p className="text-gray-600">
//               All orders are subject to acceptance and availability. Prices are
//               subject to change without notice. Payment must be made in full
//               before dispatch of goods or completion of service.
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               3. Shipping & Delivery
//             </h2>
//             <p className="text-gray-600">
//               Delivery times are estimates only and may vary. We are not
//               responsible for delays beyond our control such as courier issues
//               or natural events.
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               4. Returns, Refunds & Cancellations
//             </h2>
//             <p className="text-gray-600">
//               Orders can be canceled within 12 hours of placement if not yet
//               shipped. Refunds are processed as per our Refund & Cancellation
//               Policy.
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               5. Warranty & Liability
//             </h2>
//             <p className="text-gray-600">
//               Products come with a limited warranty as specified by the
//               manufacturer. We are not liable for damages caused by misuse,
//               improper installation, or third-party services.
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               6. Privacy Policy
//             </h2>
//             <p className="text-gray-600">
//               Your personal information is handled in accordance with our
//               Privacy Policy. We do not share your data with third parties
//               except where required by law.
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               7. Governing Law
//             </h2>
//             <p className="text-gray-600">
//               These Terms shall be governed by and construed in accordance with
//               the laws of India. Any disputes shall be subject to the exclusive
//               jurisdiction of the courts in Chennai, Tamil Nadu.
//             </p>
//           </div>
//         </section>

//         <div className="mt-10 border-t pt-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-2">
//             📩 Contact Us
//           </h2>
//           <p className="text-gray-600">
//             Hardware Dynamic <br />
//             No. 45/46, 1st Floor, Giri Road, T. Nagar, Chennai – 600 017 <br />
//             Phone: 8248225310 <br />
//             Email: hardwaredynamic1@gmail.com
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { usePolicy } from "@/context/PolicyContext";

function TermsAndConditions() {
  const { policy, isLoading }: any = usePolicy();

  if (isLoading) {
    // Show skeleton loader when loading
    return (
      <div className="bg-white p-5 shadow-md rounded-lg lg:p-20 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>

        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/4"></div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="bg-white lg:p-20 p-5 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Terms and Conditions</h1>
        <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: policy?.data?.terms_and_conditions }} />
      </div>
    </>
  );
}

export default TermsAndConditions;
