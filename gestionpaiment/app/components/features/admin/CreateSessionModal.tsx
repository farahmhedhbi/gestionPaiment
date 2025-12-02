"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Session } from "@/app/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Partial<Session>) => void;
}

export function CreateSessionModal({ open, onClose, onCreate }: Props) {
  const [form, setForm] = useState({
    classe: "",
    specialite: "",
    promotion: "",
    niveau: "",
    semestre: "",
    dateDebut: "",
    dateFin: ""
  });

  const update = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  if (!open) return null;
return (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50">
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-blue-900 
                    border border-white/10 p-7 rounded-2xl shadow-2xl w-full max-w-lg text-white relative">

      {/* TITRE */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 flex items-center justify-center 
                        bg-purple-600/20 border border-purple-400/30 rounded-xl">
          📘
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-300 
                       bg-clip-text text-transparent">
          Créer une session
        </h2>
      </div>

      {/* FORMULAIRE */}
      <div className="space-y-4">
        {Object.keys(form).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm mb-1 text-white/70 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>

            <input
              type={key.includes("date") ? "date" : "text"}
              name={key}
              value={(form as any)[key]}
              onChange={update}
              placeholder={key}
              className="w-full p-3 rounded-lg bg-gray-900/70 border border-white/10 
                         text-white placeholder-white/40 
                         focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40
                         transition"
            />
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="secondary" onClick={onClose}
                className="px-4 py-2 text-sm rounded-xl">
          Annuler
        </Button>

        <Button variant="primary" onClick={() => onCreate(form)}
                className="px-5 py-2 text-sm rounded-xl shadow-md hover:shadow-purple-500/30">
          Créer
        </Button>
      </div>

    </div>
  </div>
);
}