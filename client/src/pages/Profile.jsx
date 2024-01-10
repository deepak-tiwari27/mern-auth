import React from "react";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {useDispatch} from "react-redux"
import { updateUserFailure,updateUserStart,updateUserSuccess} from "../redux/user/userSlice";
// const [updateSuccess,setUpdateSuccess] = useState(false)

export default function Profile() {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess] = useState(false)

  console.log(formData);
  const dispatch = useDispatch()

  const { currentUser,loading,error } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    try {

      const storage = getStorage(app);
      const fileName = new Date().getTime() + image.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImagePercent(Math.round(progress));
        },
        (error) => {
          setImageError(true);
          console.error("Error during file upload:", error);
        },
        async () => {
          try {
            // This block will be executed when the upload is complete
            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            // Update your form data with the download URL
            setFormData({
              ...formData,
              profilePicture: downloadURL,
            });
          } catch (error) {
            console.error("Error getting download URL:", error);
            // Handle the error if necessary
          }
        }
      );
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
      // Handle the error if necessary
    }
  };

  // const handleFileUpload =async (image) => {
  //   const storage = getStorage(app);
  //   const fileName = new Date().getTime() + image.name;
  //   const storageRef = ref(storage, fileName);
  //   const uploadTask = uploadBytesResumable(storageRef, image);

  //   uploadTask.on(
  //     'state_changed',
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       setImagePercent(Math.round(progress));
  //     },
  //     (error) => {
  //       setImageError(true);
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
  //       setFormData({ ...formData, profilePicture: downloadURL })
  //     );
  //     }
  //   );
  // };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error))

    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="profile Picture"
          className=" h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="bg-red-500">Error uploading image</span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="bg-slate-700">{`uploading: ${imagePercent}%`}</span>
          ) : imagePercent === 100 ? (
            <span className="bg-green-700">Image uploaded Successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          defaultValue={currentUser.username}
          id="username"
          placeholder="username"
          className="bg-slate-200 rounded-lg p-3 "
          onChange={handleChange}
        />
        <input
          type="email"
          defaultValue={currentUser.email}
          id="email"
          placeholder="email"
          className="bg-slate-200 rounded-lg p-3 "
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="bg-slate-200 rounded-lg p-3 "
          onChange={handleChange}
        />
        <button className="bg-slate-700 rounded-lg p-3 text-white uppercase cursor-pointer disabled:opacity-40 hover:opacity-85">
          {loading ? "Loading...":"update"}
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className = "text-red-500 mt-5">{error && "something went wrong"}</p>
      <p className = "text-green-500 mt-5">{updateSuccess && "user is updated"}</p>
    </div>
  );
}
