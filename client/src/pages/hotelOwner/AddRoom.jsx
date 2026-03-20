import React, { useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/Title";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const AddRoom = () => {
  const { axios, getToken } = useAppContext();

  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    roomType: "",
    name: "",
    address: "",
    city: "",
    description: "",
    pricePerNight: 0,
    amenities: {
      WiFi: false,
      Breakfast: false,
      "Room Service": false,
      "Free Parking": false,
      "Pool Access": false,
      Gyser: false,
      "DSTV/Netflix": false,
      "Shuttle Service": false,
      Security: false,
    },
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Check if all inputs are filled
    if (
      !inputs.roomType ||
      !inputs.pricePerNight ||
      !inputs.amenities ||
      // !inputs.name ||
      // !inputs.address ||
      // !inputs.city ||
      // !inputs.description ||
      !Object.values(images).some((image) => image)
    ) {
      toast.error("Please fill in all the details");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("roomType", inputs.roomType);
      formData.append("pricePerNight", inputs.pricePerNight);
      formData.append("name", inputs.name);
      formData.append("address", inputs.address);
      formData.append("city", inputs.city);
      formData.append("description", inputs.description);
      // Converting Amenities to Array & keeping only enabled Amenities
      const amenities = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key],
      );
      formData.append("amenities", JSON.stringify(amenities));

      // Adding Images to FormData
      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key]);
      });

      const { data } = await axios.post("/api/rooms/", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success(data.message);
        setInputs({
          roomType: "",
          name: "",
          address: "",
          city: "",
          description: "",
          pricePerNight: 0,
          amenities: {
            WiFi: false,
            Breakfast: false,
            "Room Service": false,
            "Free Parking": false,
            "Pool Access": false,
            Gyser: false,
            "DSTV/Netflix": false,
            "Shuttle Service": false,
            Security: false,
          },
        });
        setImages({ 1: null, 2: null, 3: null, 4: null });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <Title
        align="left"
        font="outfit"
        title="Add Place"
        subTitle="Fill in the details carefully, pricing, and amenities, to enhance the user booking experience."
      />
      {/* Upload Area For Images */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label key={key} htmlFor={`roomImage${key}`}>
            <img
              className="max-h-13 cursor-pointer opacity-80"
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.uploadArea
              }
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
              onChange={(e) =>
                setImages({ ...images, [key]: e.target.files[0] })
              }
            />
          </label>
        ))}
      </div>
      <div>
        <div className="w-full mt-4">
          <label htmlFor="name" className="font-medium text-gray-500">
            Place Name
          </label>
          <input
            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            value={inputs.name}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            type="text"
            required
          />
        </div>
        <div className="w-full mt-4">
          <label htmlFor="address" className="font-medium text-gray-500">
            Address
          </label>
          <textarea
            id="address"
            rows="2"
            onChange={(e) => setInputs({ ...inputs, address: e.target.value })}
            value={inputs.address}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light resize-none"
            type="text"
            required
          />
        </div>
        <div className="w-full mt-4">
          <label htmlFor="city" className="font-medium text-gray-500">
            City
          </label>
          <input
            id="city"
            onChange={(e) => setInputs({ ...inputs, city: e.target.value })}
            value={inputs.city}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light "
            type="text"
            required
          />
        </div>
        <div className="w-full mt-4">
          <label htmlFor="address" className="font-medium text-gray-500">
            Description
          </label>
          <textarea
            id="description"
            rows="3"
            onChange={(e) =>
              setInputs({ ...inputs, description: e.target.value })
            }
            value={inputs.description}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light resize-none"
            type="text"
            required
          />
        </div>
        <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
          <div className="flex-1 max-w-48">
            <p className="text-gray-800 mt-4">Number of Beds</p>
            <select
              className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
              value={inputs.roomType}
              onChange={(e) =>
                setInputs({ ...inputs, roomType: e.target.value })
              }
            >
              <option value="">Select Beds</option>
              <option value="Single Bed">Single Bed</option>
              <option value="Double Bed">Double Bed</option>
              <option value="Luxury Room">3 Beds</option>
              <option value="Luxury Room">4 Beds</option>
              <option value="Family Suite">Family Suite</option>
            </select>
          </div>

          <div>
            <p className="mt-4 text-gray-800">
              Price <span className="text-xs">/night</span>
            </p>
            <input
              type="number"
              placeholder="0"
              className="border border-gray-300 mt-1 rounded p-2 w-24"
              value={inputs.pricePerNight}
              onChange={(e) =>
                setInputs({ ...inputs, pricePerNight: e.target.value })
              }
            />
          </div>
        </div>

        <p className="text-gray-800 mt-4">Amenities</p>
        <div className="flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm">
          {Object.keys(inputs.amenities).map((amenity, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={`amenities${index + 1}`}
                checked={inputs.amenities[amenity]}
                onChange={() =>
                  setInputs({
                    ...inputs,
                    amenities: {
                      ...inputs.amenities,
                      [amenity]: !inputs.amenities[amenity],
                    },
                  })
                }
              />
              <label htmlFor={`amenities${index + 1}`}> {amenity} </label>
            </div>
          ))}
        </div>

        <button
          className="bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Listing"}
        </button>
      </div>
    </form>
  );
};

export default AddRoom;
