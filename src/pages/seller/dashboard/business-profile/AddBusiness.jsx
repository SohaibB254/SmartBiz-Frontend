import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SellerSidebar from "../components/SellerSideBar";
import { useBusiness } from "../../../../context/BusinessContext";
import Toast from "../../../../components/common/Toast";

const AddBusiness = () => {
  const navigate = useNavigate();
  const { createProfile } = useBusiness();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState("initial"); // 'initial' or 'form'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    success: false,
    message: "",
  });

  // Form State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    businessType: "",
    ownerName: "",
    description: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Local preview!
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Package data into FormData for Multer
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("businessType", formData.businessType);
    submitData.append("ownerName", formData.ownerName);
    submitData.append("description", formData.description);
    if (imageFile) {
      submitData.append("image", imageFile);
    }

    try {
      const result = await createProfile(submitData);
      setToastConfig({
        isVisible: true,
        success: true,
        message: result.message,
      });

      // Give toast time to show, then route to the dashboard
      setTimeout(() => {
        navigate("/seller/dashboard/business-profile");
      }, 2000);
    } catch (error) {
      setToastConfig({
        isVisible: true,
        success: false,
        message: error.response?.data?.message || "Failed to create profile",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="text-2xl font-bold text-[#e29525]">SmartBiz</div>
      </header>

      {toastConfig.isVisible && (
        <Toast
          success={toastConfig.success}
          message={toastConfig.message}
          onClose={() => setToastConfig({ ...toastConfig, isVisible: false })}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
         {/* Empty div to make align horizontal elements  */}
        <div className='w-64'></div>
        {/* Pass isLocked=true so it's grayed out */}
        <SellerSidebar activeTab="" isLocked={true} />

        <main className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50/30 overflow-y-auto">
          {step === "initial" ? (
            <button
              onClick={() => setStep("form")}
              className="bg-[#e29525] hover:bg-[#c9831f] text-white font-medium py-3 px-8 rounded-full shadow-sm transition-colors"
            >
              Create Business Profile
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-2xl bg-white p-8"
            >
              {/* Image Upload Area */}
              <div className="w-full h-64 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 mb-8 relative overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-[#e29525] hover:bg-[#c9831f] text-white font-medium py-2 px-6 rounded-full shadow-sm relative z-10"
                  >
                    Upload Image
                  </button>
                )}
                {/* Hidden File Input */}
                <input
                  type="file"
                  name="image"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                {/* Re-upload capability if image exists */}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute top-4 right-4 bg-white text-gray-800 text-xs font-bold py-1 px-3 rounded shadow-md"
                  >
                    Change
                  </button>
                )}
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Enter Business Name
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Eg, Harry PCs"
                    className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Choose Business Type
                  </label>
                  <select
                    name="businessType"
                    required
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525] bg-white"
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Product Based">1. Product Based</option>
                    <option value="Service Based">2. Service Based</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    required
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    placeholder="Sara Jones"
                    className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525]"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Write a detailed description about your business"
                  className="w-full border border-gray-300 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525] h-32 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#e29525] hover:bg-[#c9831f] text-white font-medium py-3 px-8 rounded-full shadow-sm transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Creating..." : "Create Business Profile"}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default AddBusiness;
