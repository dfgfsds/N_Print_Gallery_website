// // app/privacy-policy/page.tsx
// "use client";

// export default function PrivacyPolicy() {
//   return (
//     <div className="bg-gray-50 min-h-screen py-12 px-6 md:px-20">
//       <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-12">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">
//           Privacy & Security Policy
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
//               1. Information We Collect
//             </h2>
//             <p className="text-gray-600">
//               We collect personal details (name, email, phone number, address),
//               payment information, and website usage data (IP address, browser,
//               device information).
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               2. How We Use Your Information
//             </h2>
//             <p className="text-gray-600">
//               To process orders, provide customer support, improve services, and
//               send important updates or promotions.
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               3. Data Security
//             </h2>
//             <p className="text-gray-600">
//               We use encryption, restricted access, and regular system updates
//               to secure your personal and payment data.
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               4. Sharing of Information
//             </h2>
//             <p className="text-gray-600">
//               We do not sell your data. We only share information with trusted
//               partners (couriers, payment providers) or as required by law.
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               5. Cookies & Tracking
//             </h2>
//             <p className="text-gray-600">
//               Our website may use cookies to enhance user experience. You may
//               disable cookies, but some features may not function properly.
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               6. Your Rights
//             </h2>
//             <p className="text-gray-600">
//               You may request access, correction, or deletion of your data. You
//               can opt-out of promotional emails anytime.
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               7. Policy Updates
//             </h2>
//             <p className="text-gray-600">
//               This policy may be updated occasionally. Continued use of our
//               services means you accept the updated terms.
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

function PrivacyPilicy(){
  const { policy,isLoading }: any = usePolicy();

  if (isLoading) {
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
    <div className="bg-white p-5 shadow-md rounded-lg lg:p-20">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Privacy Policy</h1>
      <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: policy?.data?.privacy_policy }} />
        
    </div>
  );
}

export default PrivacyPilicy;