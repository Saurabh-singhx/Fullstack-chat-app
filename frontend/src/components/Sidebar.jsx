import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { UserPlus, Search, Plus, X } from "lucide-react";
import profilepic from "../public/avatar.png"; // Default avatar image

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, getSearchedUser, searchedUser, addSearchedContact } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [addContactinput, setaddContactinput] = useState(false);
  const [searchData, setsearchData] = useState('');

  useEffect(() => {
    getUsers();


  }, [getUsers, addSearchedContact, searchedUser]);
  // console.log("users", users);
  const handleSearchClick = () => {
    setaddContactinput(!addContactinput);
    setSelectedUser(null);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchData.trim()) {
      return;
    }
    getSearchedUser(searchData);
    const filteredUsers = users.contacts.filter((user) =>
      user.email.toLowerCase().includes(searchData.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchData.toLowerCase())
    );
    setSelectedUser(filteredUsers[0] || null);
    // setaddContactinput(false);
    setsearchData('');
  }
  // console.log("searchedUser", searchedUser);

  const addContact = () => {
    if (!searchedUser) {
      return;
    }
    const isAlreadyContact = users.contacts.some((user) => user._id === searchedUser._id);
    if (isAlreadyContact) {
      setaddContactinput(false);
      return;
    }
    addSearchedContact(searchedUser.email);

    // setSelectedUser('searchedUser');
    setaddContactinput(false);
  }

  const filteredUsers = showOnlineOnly
    ? users.contacts.filter((user) => onlineUsers.includes(user._id))
    : users.contacts;

  if (isUsersLoading) return <SidebarSkeleton />;


  return (
    <aside className={`h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 ${addContactinput ? "w-72" : ""}`}>
      {
        addContactinput ? (
          <div className="border-b border-base-300 p-4 h-auto hover:bg-base-300 transition-colors flex relative flex-col">
            <div className="flex items-center justify-around">

              <input
                onChangeCapture={(e) => setsearchData(e.target.value)}
                type="text"
                placeholder="Enter email or name"
                className="input input-bordered"
              />
              <button
                onClick={handleSearch}
                className="flex items-center justify-center ml-2 border-base-300 rounded-lg ">
                <Search className="size-6 ml-auto" />
              </button>
              <button onClick={handleSearchClick} className="ml-2">
                <X
                  className=" text-primary absolute top-0 left-[90%]" />
              </button>
            </div>

            {/* searched user div starts here */}

            {
              searchedUser && (
                <div className="lg:w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors  bg-base-100 rounded-lg mt-2">
                  <div className="relative">
                    <img
                      src={searchedUser.profilepic || profilepic}
                      alt={searchedUser.name}
                      className="size-12 object-cover rounded-full"
                    />
                    {/* <span
                      className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"

                    /> */}
                  </div>

                  <div className=" text-left flex justify-self-start">
                    <div className="font-medium truncate">{searchedUser.fullName}</div>
                    {/* <div className="text-sm text-zinc-400">Status</div> */}
                  </div>

                  <button
                    onClick={addContact}
                    className="ml-auto">
                    <Plus className="text-primary"/>
                  </button>
                </div>
              ) 
            }

            {/* searched user div end here */}

          </div>
        ) : (
          <div className="border-b border-base-300 w-full p-5 h-auto hover:bg-base-300 transition-colors">
            <button
              onClick={handleSearchClick}
              className="flex items-center gap-2 justify-center w-full hover:bg-base-300 transition-colors h-full">
              <UserPlus className="size-6" />
              <span className="font-medium hidden lg:block">Add Contacts</span>
              <Search className="size-6 ml-auto hidden lg:block" />
            </button>
          </div>
        )
      }

      <div className="border-b border-base-300 w-full pl-5">
        <span className="font-medium hidden lg:block">Contacts</span>
        <div className="mt-3 hidden lg:flex items-center gap-2 pb-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>

        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {
          filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`
          w-full p-3 flex items-center gap-3
          hover:bg-base-300 transition-colors
          ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
        `}
              >
                <div className="relative lg:mx-0">
                  <img
                    src={user.profilepic || profilepic}
                    alt={user.name}
                    className="size-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span
                      className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"
              
                    />
                  )}
                </div>

                <div className={` lg:block text-left min-w-0 ${addContactinput ? "block" : "hidden"}`}>
                  <div className="font-medium truncate">{user.fullName}</div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No contacts found</div>
          )
        }

      </div>
    </aside>
  );
};
export default Sidebar;