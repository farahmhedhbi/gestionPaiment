'use client'

import React, { useState, useEffect } from 'react'
import { FaUserTie, FaChalkboardTeacher, FaTrash, FaEdit } from 'react-icons/fa'

type User = {
  id: number
  name: string
  email: string
  role: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isAdmin, setIsAdmin] = useState(true) // simule un admin

  useEffect(() => {
    const mockUsers: User[] = [
      { id: 1, name: 'Alice', email: 'alice@mail.com', role: 'formateur' },
      { id: 2, name: 'Bob', email: 'bob@mail.com', role: 'coordinateur' },
      { id: 3, name: 'Charlie', email: 'charlie@mail.com', role: 'formateur' },
    ]
    setUsers(mockUsers)
  }, [])

  if (!isAdmin) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold">Accès refusé</h2>
        <p>Cette page est réservée aux administrateurs.</p>
      </div>
    )
  }

  const handleDelete = (id: number) => {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.id !== id))
    }
  }

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">Gestion des utilisateurs</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map(user => (
          <div
            key={user.id}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between transition transform hover:scale-105 hover:shadow-2xl duration-300"
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-full mr-4 text-white ${user.role === 'formateur' ? 'bg-blue-500' : 'bg-purple-600'}`}>
                {user.role === 'formateur' ? <FaChalkboardTeacher /> : <FaUserTie />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className={`px-3 py-1 rounded-full text-white text-sm ${user.role === 'formateur' ? 'bg-blue-500' : 'bg-purple-600'}`}>
                {user.role.toUpperCase()}
              </span>
              <div className="flex space-x-2">
                <button className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition">
                  <FaEdit className="mr-1" /> Éditer
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="flex items-center bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  <FaTrash className="mr-1" /> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
