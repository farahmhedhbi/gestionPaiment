"use client";

import React from "react";
import { SessionAffectation } from "@/app/types";

interface Props {
  affectation: SessionAffectation;
  sessionName: string;
}

export default function SessionDetailsCard({ affectation, sessionName }: Props) {
 return (
  <div className="bg-gradient-to-br from-gray-900/80 to-blue-900/60 
                  p-5 rounded-2xl border border-white/10 shadow-lg
                  hover:shadow-blue-500/20 transition duration-300">

    {/* TITRE */}
    <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-purple-300 to-blue-300 
                   bg-clip-text text-transparent">
      📘 Détails — {sessionName}
    </h3>

    {/* FORMATEUR */}
    <div className="text-white/85 flex items-center gap-2 mb-2">
      <span className="text-blue-300">👨‍🏫</span>
      <p>
        <b>Formateur :</b>{" "}
        {affectation.formateur
          ? `${affectation.formateur.firstName} ${affectation.formateur.lastName}`
          : "—"}
      </p>
    </div>

    {/* COORDINATEUR */}
    <div className="text-white/85 flex items-center gap-2 mb-2">
      <span className="text-purple-300">🧭</span>
      <p>
        <b>Coordinateur :</b>{" "}
        {affectation.coordinateur
          ? `${affectation.coordinateur.firstName} ${affectation.coordinateur.lastName}`
          : "—"}
      </p>
    </div>

    {/* DATE */}
    <p className="text-purple-300 mt-3 text-sm flex items-center gap-1">
      📅 <span>Affecté le :</span> 
      <span className="text-white/80">{affectation.dateAffectation}</span>
    </p>
  </div>
);
}