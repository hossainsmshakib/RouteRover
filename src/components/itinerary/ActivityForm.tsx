import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addActivity } from "../../redux/slices/itinerarySlice";
import { AppDispatch } from "../../redux/store";
import { v4 as uuidv4 } from "uuid";

interface ActivityFormProps {
  itineraryId: string;
  destinationId: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  itineraryId,
  destinationId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [type, setType] = useState<"landmark" | "restaurant" | "other">(
    "landmark"
  );
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addActivity({
        itineraryId,
        destinationId,
        activity: {
          id: uuidv4(),
          name,
          type,
          description,
        },
      })
    );
    setName("");
    setType("landmark");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="activityName"
          className="block text-sm font-medium text-gray-700"
        >
          Activity Name
        </label>
        <input
          type="text"
          id="activityName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="activityType"
          className="block text-sm font-medium text-gray-700"
        >
          Activity Type
        </label>
        <select
          id="activityType"
          value={type}
          onChange={(e) =>
            setType(e.target.value as "landmark" | "restaurant" | "other")
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="landmark">Landmark</option>
          <option value="restaurant">Restaurant</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="activityDescription"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="activityDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Activity
      </button>
    </form>
  );
};

export default ActivityForm;
