import React, { useState, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "components/supabaseClient";
import styles from "./DMSend.module.css";
import SearchUserModal from "./SearchUserModal";

const fetchOtherUsers = async (userEmail) => {
  const { data, error } = await supabase
    .from("User")
    .select("userid, username, profileimage")
    .neq("email", userEmail);

  if (error) throw new Error(error.message);
  return data;
};

function DMSend({ setIsSending, setSelectedUser }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelectedUser, setLocalSelectedUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("user_add_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "User" },
        () => queryClient.invalidateQueries({ queryKey: ["otherUsers"] })
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, queryClient]);

  const { data: filteredUsers, isLoading } = useQuery({
    queryKey: ["otherUsers", user?.email],
    queryFn: () => fetchOtherUsers(user.email),
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
  });

  if (!user) return null;

  const handleUserClick = (user) => {
    setLocalSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (localSelectedUser) {
      setSelectedUser(localSelectedUser);
      setIsSending(false);
    }
  };

  return (
    <div className={styles.sendModal}>
      <SearchUserModal
        setIsSending={setIsSending}
        filteredUsers={filteredUsers}
        handleUserClick={handleUserClick}
        selectedUser={localSelectedUser}
        handleSearchChange={(e) => setSearchTerm(e.target.value)}
        searchTerm={searchTerm}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default DMSend;