import React from "react";

function DebitorForm({ newDebitor, handleInputChange, handleSaveDebitor, handleCloseForm }) {
  return (
    <div className="bg-black/40 flex items-center justify-center min-h-screen overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 mx-auto">
      <div className="absolute p-4 w-full max-w-lg max-h-full">
        <div className="relative bg-white rounded-lg ">
          <div className="flex items-center justify-between p-4 md:p-5 rounded-t ">
            <h3 className="text-2xl font-semibold text-gray-900 max-w-sm">
              Add the transactions here! Kindly refresh to see the data.
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-red-500 hover:text-white rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={handleCloseForm}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close </span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={newDebitor.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="debit"
                className="block text-sm font-semibold text-gray-700"
              >
                Debit
              </label>
              <input
                type="text"
                name="debit"
                value={newDebitor.debit}
                onChange={handleInputChange}
                placeholder="Transaction"
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <button
              onClick={handleSaveDebitor}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebitorForm;


