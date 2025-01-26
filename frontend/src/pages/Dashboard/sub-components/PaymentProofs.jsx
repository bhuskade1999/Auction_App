import {
  deletePaymentProof,
  getSinglePaymentProofDetail,
  updatePaymentProof,
} from "@/store/slices/superAdminSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import axios from "axios";

const PaymentProofs = () => {
  const { paymentProofs, singlePaymentProof } = useSelector(
    (state) => state.superAdmin
  );
  let [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();
  const handlePaymentProofDelete = (id) => {
    dispatch(deletePaymentProof(id));
  };

  const handleUpdatePayemntProof = (id) => {
    setIsOpen(true);
    setSelectedId(id);
    // dispatch(getSinglePaymentProofDetail(id));
  };
  console.log("isOpen2", isOpen);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white mt-5">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 py-2">User ID</th>
              <th className="w-1/3 py-2">Status</th>
              <th className="w-1/3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {paymentProofs.length > 0 ? (
              paymentProofs.map((element, index) => {
                return (
                  <tr key={index}>
                    <td className="py-2 px-4 text-center">{element.userId}</td>
                    <td className="py-2 px-4 text-center">{element.status}</td>
                    <td className="flex items-center py-4 justify-center gap-3">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition-all duration-300"
                        onClick={() => {
                          handleUpdatePayemntProof(element._id);
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition-all duration-300"
                        onClick={() => handlePaymentProofDelete(element._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-center text-xl text-sky-600 py-3">
                <td>No payment proofs are found.</td>
                <td>
                  {" "}
                  <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                  >
                    Open dialog
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal setIsOpen={setIsOpen} isOpen={isOpen} selectedId={selectedId} />
    </>
  );
};

export default PaymentProofs;

export function Modal({ isOpen, setIsOpen, selectedId }) {
  const { loading } = useSelector((state) => state.superAdmin);
  const [singlePaymentProof, setSinglePaymentProof] = useState(null);
  const [status, setStatus] = useState(singlePaymentProof?.status || "");
  const dispatch = useDispatch();
  const handlePaymentProofUpdate = () => {
    dispatch(
      updatePaymentProof(
        singlePaymentProof?._id,
        status,
        singlePaymentProof?.amount
      )
    );
  };

  const fetchSinglePaymentProof = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/superadmin/paymentproof/${id}`,
        { withCredentials: true }
      );
      const result = response?.data?.paymentProofDetail;
      setSinglePaymentProof(result);
      console.log("repsonce from model", response?.data?.paymentProofDetail);
    } catch (err) {
      console.log(err);
      setSinglePaymentProof(null);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchSinglePaymentProof(selectedId);
    }
  }, [selectedId]);

  return (
    <>
      {singlePaymentProof && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsOpen(false)}
          >
            <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1/3 border">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="create-room-dialog-box p-2 max-h-[500px]  rounded-md bg-background overflow-scroll">
                  <>
                    <div className="bg-white h-full transition-all duration-300 w-full  ">
                      <div className="w-full px-5 sm:max-w-[640px] sm:m-auto">
                        <h3 className="text-[#D6482B]  text-3xl font-semibold text-center mb-1">
                          Update Payment Proof
                        </h3>
                        <p className="text-stone-600">
                          You can update payment status and amount.
                        </p>
                        <form className="flex flex-col gap-2 py-2 px-2 h-full">
                          <div className="flex flex-col gap-1">
                            <label className="text-[16px] text-stone-600 ">
                              User ID
                            </label>
                            <input
                              type="text"
                              value={singlePaymentProof?.userId || ""}
                              disabled
                              className="text-md p-0.5 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none  text-stone-600"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[16px] text-stone-600">
                              UnPaid Amount
                            </label>
                            <input
                              type="number"
                              disabled
                              value={singlePaymentProof?.unPaidAmount || ""}
                              className="text-md p-0.5 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[16px] text-stone-600">
                              Amount
                            </label>
                            <input
                              type="number"
                              disabled
                              value={singlePaymentProof?.amount || ""}
                              className="text-md p-0.5 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[16px] text-stone-600">
                              Status
                            </label>
                            <select
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                              className="text-md p-0.5 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Settled">Settled</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="text-[16px] text-stone-600">
                              Comment
                            </label>
                            <textarea
                              rows={5}
                              value={singlePaymentProof?.comment || ""}
                              disabled
                              className="text-md p-0.5 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none text-stone-600"
                            />
                          </div>
                          <div className="flex justify-center align-center text-blue-500">
                            <Link
                              to={singlePaymentProof.proof?.url || ""}
                              // className="bg-[#D6482B] flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-[#b8381e]"
                              target="_blank"
                            >
                              View Payment Proof (SS)
                            </Link>
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              className="bg-blue-500 flex justify-center w-full py-1 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-blue-700"
                              onClick={handlePaymentProofUpdate}
                            >
                              {loading ? "Updating" : "Update"}
                            </button>
                            {/* </div> */}
                            {/* <div className="border border-red-500"> */}
                            <button
                              type="button"
                              className="bg-yellow-500 flex justify-center w-full py-1 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-yellow-700"
                              onClick={() => setIsOpen(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
}
