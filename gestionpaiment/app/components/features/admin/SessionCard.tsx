import React from "react";
import { Session } from "@/app/types";

interface SessionCardProps {
  session: Session;
  onAssign: () => void;                // ✅ AJOUT ICI
  onDelete: (id: number) => void;
}

export function SessionCard({ session, onAssign, onDelete }: SessionCardProps) {
 return (
  <div className="bg-gradient-to-br from-gray-900/80 to-blue-900/70 
                  border border-white/10 rounded-2xl p-5 shadow-lg 
                  hover:shadow-blue-500/20 transition duration-300">

    {/* TITRE */}
    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-blue-300 
                   bg-clip-text text-transparent">
      {session.classe} — {session.specialite}
      <span className="text-white/60"> ({session.promotion})</span>
    </h3>

    {/* INFO */}
    <div className="space-y-1 text-white/80 text-sm">
      <p>🎓 <b>Niveau :</b> {session.niveau}</p>
      <p>📘 <b>Semestre :</b> {session.semestre}</p>
      <p className="mt-2">
        📅 <b>{session.dateDebut}</b> → <b>{session.dateFin}</b>
      </p>
    </div>

    {/* ACTIONS */}
    <div className="mt-5 flex flex-col gap-3">

      {/* BTN AFFECTER */}
      <button
        onClick={onAssign}
        className="w-full py-2 rounded-xl text-white font-medium
                   bg-blue-600/40 border border-blue-400/30 
                   hover:bg-blue-600/60 hover:border-blue-300 
                   transition duration-200"
      >
        🎯 Affecter formateur / coordinateur
      </button>

      {/* BTN SUPPRIMER */}
      <button
        onClick={() => onDelete(session.id)}
        className="w-full py-2 rounded-xl text-white font-medium
                   bg-red-600/40 border border-red-400/30 
                   hover:bg-red-600/60 hover:border-red-300 
                   transition duration-200"
      >
        🗑️ Supprimer
      </button>

    </div>

  </div>
);
}