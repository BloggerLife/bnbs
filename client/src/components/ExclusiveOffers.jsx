import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import EventCard from "./EventCard";
import { exclusiveOffers } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ExclusiveOffers = () => {
  const { rooms, navigate } = useAppContext();
  return (
    rooms.length > 0 && (
      <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-30">
        <div className="flex flex-col md:flex-row items-center justify-between w-full ">
          <Title
            align="left"
            title="Exclusive Events"
            subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories."
          />
          <button
            onClick={() => {
              navigate("/rooms");
              scrollTo(0, 0);
            }}
            className="group flex items-center gap-2 font-medium cursor-pointer max-md:mt-12"
          >
            View All Events
            <img
              className="group-hover:translate-x-1 transition-all"
              src={assets.arrowIcon}
              alt="arrow-icon"
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {exclusiveOffers.map((item) => (
            <div
              key={item._id}
              className="group relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full">
                {item.priceOff}% OFF
              </p>
              <div>
                <p className="text-2xl font-medium font-playfair">
                  {item.title}
                </p>
                <p>{item.description}</p>
                <p className="text-xs text-white/70 mt-3">
                  Expires {item.expiryDate}
                </p>
              </div>
              <button className="flex items-center gap-2 font-medium cursor-pointer mt-4 mb-5">
                View Events
                <img
                  className="invert group-hover:translate-x-1 transition-all"
                  src={assets.arrowIcon}
                  alt="arrow-icon"
                />
              </button>
            </div>
          ))}
        </div>
        {/* <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {rooms.slice(0, 3).map((room, index) => (
            <EventCard key={room._id} room={room} index={index} />
          ))}
        </div> */}
      </div>
    )
  );
};

export default ExclusiveOffers;
