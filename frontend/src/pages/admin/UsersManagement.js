import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', phone_number: '', role: 'customer' });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Vérifier l'authentification admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        navigate('/login');
      }
    } catch (err) {
      navigate('/login');
    }
  }, [navigate]);

  // Charger les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/users');
        setUsers(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs');
        console.error('Erreur fetchUsers:', err.response?.data || err.message);
      }
    };
    fetchUsers();
  }, []);

  // Ajouter un utilisateur
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users', newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: '', email: '', password: '', phone_number: '', role: 'customer' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l’ajout de l’utilisateur');
      console.error('Erreur handleAddUser:', err.response?.data || err.message);
    }
  };

  // Modifier un utilisateur
  const handleEditUser = async (user) => {
    try {
      const updatedUser = { name: user.name, email: user.email, phone_number: user.phone_number, role: user.role };
      const response = await api.put(`/api/users/${user.id}`, updatedUser);
      setUsers(users.map((u) => (u.id === user.id ? response.data : u)));
      setEditingUser(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la modification de l’utilisateur');
      console.error('Erreur handleEditUser:', err.response?.data || err.message);
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la suppression de l’utilisateur');
      console.error('Erreur handleDeleteUser:', err.response?.data || err.message);
    }
  };

  return (
    <section className="section bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Gestion des Utilisateurs</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Formulaire d'ajout */}
        <form onSubmit={handleAddUser} className="mb-12 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Ajouter un Utilisateur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="p-3 border rounded-lg w-full"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="p-3 border rounded-lg w-full"
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="p-3 border rounded-lg w-full"
              required
            />
            <input
              type="tel"
              placeholder="Numéro de téléphone"
              value={newUser.phone_number}
              onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
              className="p-3 border rounded-lg w-full"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="p-3 border rounded-lg w-full"
            >
              <option value="customer">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary mt-4">Ajouter</button>
        </form>

        {/* Liste des utilisateurs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Liste des Utilisateurs</h3>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Téléphone</th>
                <th className="p-3 text-left">Rôle</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone_number || 'N/A'}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-blue-500 hover:underline mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:underline"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formulaire de modification (modal) */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Modifier l’Utilisateur</h3>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="p-3 border rounded-lg w-full mb-4"
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="p-3 border rounded-lg w-full mb-4"
              />
              <input
                type="tel"
                value={editingUser.phone_number || ''}
                onChange={(e) => setEditingUser({ ...editingUser, phone_number: e.target.value })}
                className="p-3 border rounded-lg w-full mb-4"
                placeholder="+33 1 23 45 67 89"
              />
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                className="p-3 border rounded-lg w-full mb-4"
              >
                <option value="customer">Client</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setEditingUser(null)}
                  className="btn bg-gray-300 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleEditUser(editingUser)}
                  className="btn btn-primary"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UsersManagement;