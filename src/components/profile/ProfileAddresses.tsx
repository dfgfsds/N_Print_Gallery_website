'use client';

import { Loader, MapPin, Pencil, Plus, Trash } from 'lucide-react';
// import AddressForm from './AddressForm';
import { useEffect, useState } from 'react';
import { deleteAddressApi, getAddressApi } from '@/api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { patchUserSelectAddressAPi } from '@/api-endpoints/authendication';
import { AddressForm } from './AddressForm';

export default function ProfileAddresses() {
  const [openModal, setOpenMoadl] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editData, setEditData] = useState<any>('');
  const [deleteId, setDeleteId] = useState();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [getUserName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');
    setUserName(storedUserName);
    setUserId(storedUserId);
  }, []);

  const { data }: any = useQuery({
    queryKey: ['getAddressData', userId],
    queryFn: () => getAddressApi(`user/${userId}`),
    enabled: !!userId,
  });

  const confirmDelete = async () => {
    if (deleteId) {
      setLoading(true);
      const response = await deleteAddressApi(deleteId, { deleted_by: 'user' });
      if (response) {
        queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
        setDeleteModal(false);
        setLoading(false);
      }
    }
  };

  const handleSelectAddress = async (address: any) => {
    try {
      const updateApi = await patchUserSelectAddressAPi(`user/${userId}/address/${address?.id}`, {
        updated_by: getUserName || "user",
      });
      if (updateApi) {
        queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
      }
    } catch (error) {
      // console.log(error);
      
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Addresses</h2>
        <button
          onClick={() => setOpenMoadl(!openModal)}
          className="bg-[#13cea1] hover:bg-[#4db49c] text-white font-bold px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      {/* Address Cards */}
      {data?.data?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.data?.map((address: any) => (
            <div key={address.id} className="relative bg-white p-4 rounded-lg shadow-md">
              {/* Default tag */}
              {address?.selected_address && (
                <div className="absolute top-2 right-2">
                  <span className="bg-[#4D8B31]/10 !p-2 font-bold text-green-800 text-sm px-2.5 py-0.5 rounded">
                    Default
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-2">
                <h3 className="uppercase font-semibold">{address?.address_type}</h3>
                <p className="text-sm text-gray-500">Shipping Address</p>
              </div>

              {/* Address Content */}
              <div className="text-sm text-gray-600">
                {address?.contact_number}
                <br />
                {address?.email_address}
                <br />
                {address?.address_line1}
                <br />
                {address?.address_line2 && (
                  <>
                    {address?.address_line2}
                    <br />
                  </>
                )}
                {address?.city}, {address?.state} {address?.postal_code}
                <br />
                {address?.country}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => {
                    setOpenMoadl(true);
                    setEditData(address);
                  }}
                  className="border border-gray-300 text-gray-800 px-3 py-1 rounded-md flex items-center gap-1 text-sm"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={() => {
                    setDeleteModal(true);
                    setDeleteId(address?.id);
                  }}
                  className="border border-red-300 text-red-600 px-3 py-1 rounded-md flex items-center gap-1 text-sm"
                >
                  <Trash className="w-4 h-4" />
                  Remove
                </button>

                {!address?.selected_address && (
                  <button
                    onClick={() => handleSelectAddress(address)}
                    className="ml-auto border border-gray-300 px-3 py-1 rounded-md text-sm"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new address.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Delete Address</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this address?
            </p>
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => {
                  setEditData('');
                  setDeleteModal(false);
                  setLoading(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-bold hover:bg-red-600 flex items-center gap-2"
              >
                Confirm Delete {loading && <Loader className="animate-spin w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Form Modal */}
      <AddressForm
        openModal={openModal}
        handleClose={() => {
          setOpenMoadl(false)
          setEditData('')
        }}
        editData={editData}
      />
    </div>
  );
}
