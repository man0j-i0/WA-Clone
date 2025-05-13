import { ArrowLeft, CheckIcon, Edit2Icon, Loader2Icon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function Profile(props) {
  const navigate = useNavigate();
  const {
    userData,
    logout,
    updateName,
    updateStatus,
    isUploading,
    error,
    updatePhoto,
  } = useAuth();
  const [name, setName] = useState(userData?.name || "");
  const [status, setStatus] = useState(userData?.status || "");
  const [preview, setPreview] = useState(
    userData?.profile_pic || "/default-user.png"
  );

  useEffect(() => {
    setPreview(userData?.profile_pic || "/default-user.png");
    setName(userData?.name || "");
    setStatus(userData?.status || "");
  }, [userData]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview the selected file
      const filePreview = URL.createObjectURL(file);
      setPreview(filePreview); // Show the preview
  
      // Upload the file and update the profile
      updatePhoto(file).then(() => {
        // Handle successful upload (optional)
        console.log("File uploaded and profile updated.");
      }).catch((error) => {
        setError("Unable to Upload!");
        console.error("Upload failed", error);
      });
    }
  };
  

  const handleNameChange = () => {
    if (name !== userData.name) {
      updateName(name);
    }
  };

  const handleStatusChange = () => {
    if (status !== userData.status) {
      updateStatus(status);
    }
  };

  return (
    <div className="w-full sm:w-[30vw] min-w-[350px] h-full bg-background">
      {/* Top Bar */}
      <div className="bg-green-400 text-white py-4 text-lg px-4 flex items-center gap-6">
        <button onClick={props.onBack}>
          <ArrowLeft />
        </button>
        <div>Profile</div>
      </div>

      {/* Profile Content */}
      <div className="w-full flex flex-col items-center justify-center py-16 gap-8 mt-8">
        {/* Profile Picture Section */}
        <label
          className={`group relative rounded-full overflow-hidden cursor-pointer border border-gray-300 shadow-lg ${
            isUploading ? "pointer-events-none" : ""
          }`}
        >
          <div className="w-[160px] h-[160px] flex items-center justify-center bg-gray-200 rounded-full">
            <img
              src={preview}
              alt="Profile Picture"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
          {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
              <Loader2Icon className="w-6 h-6 text-primary-dense animate-spin z-10" />
            </div>
          ) : (
            <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/30 z-10">
              <Edit2Icon className="w-6 h-6 text-white" />
            </div>
          )}
        </label>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm text-center mt-2 px-4">
            {error}
          </div>
        )}

        {/* User Name Update Section */}
        <div className="flex flex-col bg-white w-full py-4 px-8 rounded-md shadow-sm">
          <label className="text-sm text-gray-600 mb-2">Your Name</label>
          <div className="flex items-center w-full border-b border-gray-300 focus-within:border-green-400">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent py-2 text-gray-800 outline-none"
            />
            <button onClick={handleNameChange} aria-label="Save name">
              <CheckIcon className="w-5 h-5 text-green-500 hover:text-green-600" />
            </button>
          </div>
        </div>

        {/* User Status Update Section */}
        <div className="flex flex-col bg-white w-full py-4 px-8 rounded-md shadow-sm mt-4">
          <label className="text-sm text-gray-600 mb-2">Status</label>
          <div className="flex items-center w-full border-b border-gray-300 focus-within:border-green-400">
            <input
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Update your status..."
              className="w-full bg-transparent py-2 text-gray-800 outline-none"
            />
            <button onClick={handleStatusChange} aria-label="Save status">
              <CheckIcon className="w-5 h-5 text-green-500 hover:text-green-600" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="mt-8 px-4 py-3 rounded-md bg-green-400 hover:bg-green-500 text-white font-semibold shadow-lg transition-all duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
