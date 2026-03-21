import React, { useEffect } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListEvent = () => {
  const { axios, getToken, user } = useAppContext();
  const [events, setEvents] = React.useState([]);

  // Fetch Events of the Hotel Owner
  const fetchEvents = async () => {
    try {
      const { data } = await axios.get("/api/events/owner", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setEvents(data.events);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Toggle Availability of the Event
  const toggleAvailability = async (eventId) => {
    const { data } = await axios.post(
      "/api/events/toggle-availability",
      { eventId },
      { headers: { Authorization: `Bearer ${await getToken()}` } },
    );
    if (data.success) {
      toast.success(data.message);
      fetchEvents();
    } else {
      toast.error(data.message);
    }
  };

  // Fetch Rooms when user is logged in
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Event Listings"
        subTitle="View, edit, or manage all listed Events. Keep the information up-to-date to provide the best experience for users."
      />
      <p className="text-gray-500 mt-8">Total Events</p>
      {/* Table with heads User Name, Room Name, Amount Paid, Payment Status */}
      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
        <table className="w-full">
          <thead className="bg-gray-50 ">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Facility
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium">Price</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {events.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {item.name}
                </td>
                <td className="py-3 px-4 text-gray-400 border-t border-gray-300 max-sm:hidden">
                  {item.roomType}
                </td>
                <td className="py-3 px-4 text-gray-400 border-t border-gray-300">
                  {item.pricePerNight}
                </td>
                <td className="py-3 px-4  border-t border-gray-300 text-center text-sm text-red-500">
                  <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={() => toggleAvailability(item._id)}
                      checked={item.isAvailable}
                    />
                    <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                    <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListEvent;
