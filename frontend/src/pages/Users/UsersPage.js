import React, { useState, useEffect } from "react";
import classes from "./usersPage.module.css";
import { getAll, toggleBlock } from "../../services/userService";
import Title from "../../components/Title/Title";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../../components/Modal/Modal";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const toggleShowModal = () => {
    setShowModal(!showModal);
  };
  const auth = useAuth();
  const loadUsers = async () => {
    const data = await getAll();
    console.log({ data });

    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBlock = async (userId) => {
    const isBlocked = await toggleBlock(userId);
    setUsers((oldUsers) =>
      oldUsers.map((user) =>
        user.id === userId ? { ...user, isBlocked } : user
      )
    );
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    toggleShowModal();
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.content}>
          <Title title="Manage Users"></Title>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.isAdmin ? "✅" : "❌"}</td>
                    <td className={classes.actions}>
                      <Link onClick={() => handleViewUser(user)}>View</Link>
                      <Link to={"/admin/editUser/" + user.id}>Edit</Link>
                      {auth.user.id !== user.id && (
                        <Link onClick={() => handleToggleBlock(user.id)}>
                          {user.isBlocked ? "Unblock" : "Block"}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={showModal} onCloseButtonClick={toggleShowModal}>
        {selectedUser && (
          <>
            <p>
              <b>Name:</b> {selectedUser.name}
            </p>
            <p>
              <b>Address:</b> {selectedUser.address}
            </p>
            <p>
              <b>Email:</b> {selectedUser.email}
            </p>
          </>
        )}
      </Modal>
    </>
  );
}
