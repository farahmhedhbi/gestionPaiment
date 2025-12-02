"use client";

import React, { useEffect, useState } from "react";
import { Session, User } from "@/app/types";
import { apiService } from "@/app/services/api";
import { Button } from "@/app/components/ui/Button";

interface AssignModalProps {
  open: boolean;
  session: Session | null;
  onClose: () => void;
  onUpdated: () => void; // appelé pour rafraîchir la liste dans le dashboard
  sessions: Session[]; // nécessaire pour filtrer les formateurs/coordinateurs déjà pris
}

export function AssignSessionModal({
  open,
  session,
  onClose,
  onUpdated,
  sessions
}: AssignModalProps) {
  const [formateurs, setFormateurs] = useState<User[]>([]);
  const [coordinateurs, setCoordinateurs] = useState<User[]>([]);

  const [selectedFormateur, setSelectedFormateur] = useState<number | null>(null);
  const [selectedCoord, setSelectedCoord] = useState<number | null>(null);

  useEffect(() => {
    if (open) loadData();
  }, [open]);

  const loadData = async () => {
    const f = await apiService.getFormateurs();
    const c = await apiService.getCoordinateurs();

    setFormateurs(f);
    setCoordinateurs(c);

   
  };

  // 🔥 Filtrage professionnel : ne pas afficher formateur déjà affecté ailleurs
  
const handleSave = async () => {
  try {
    if (!selectedFormateur || !selectedCoord) {
      alert("Veuillez sélectionner un formateur et un coordinateur.");
      return;
    }

    await apiService.addAffectation(
      session!.id,
      selectedFormateur,
      selectedCoord
    );

    alert("Affectation réussie !");
    await onUpdated();
    onClose();

  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Erreur inconnue";

    alert(message);
  }
};





  if (!open || !session) return null;
return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="relative w-[540px] rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-gray-950 to-blue-900 p-6 shadow-2xl text-white">

      {/* Bouton fermer (X) */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-white/60 hover:text-white transition"
        aria-label="Fermer"
      >
        ✕
      </button>

      {/* Titre */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-400/30">
          <span className="text-lg">🎓</span>
        </div>
        <div>
          <h2 className="bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-2xl font-bold text-transparent">
            Affecter formateur / coordinateur
          </h2>
          
        </div>
      </div>

      {/* Infos session */}
      <div className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-white/80">
          <span className="rounded-lg bg-blue-500/20 px-3 py-1 text-blue-200 font-semibold">
            {session.classe}
          </span>
          <span className="rounded-lg bg-purple-500/20 px-3 py-1 text-purple-200">
            {session.specialite}
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80">
            Promo {session.promotion}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-white/70">
          <p>
            <span className="font-semibold">Niveau :</span> {session.niveau}
          </p>
          <p>
            <span className="font-semibold">Semestre :</span> {session.semestre}
          </p>
        </div>
      </div>

      {/* FORMATEUR */}
      <div className="mb-4">
        <label className="mb-1 flex items-center gap-2 text-sm font-medium text-white/80">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 text-sm">
            F
          </span>
          Formateur
        </label>
        <select
          className="w-full rounded-lg border border-white/15 bg-gray-900/70 px-3 py-2.5 text-sm text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
          value={selectedFormateur ?? ""}
          onChange={(e) => setSelectedFormateur(Number(e.target.value))}
        >
          <option value="">— Choisir un formateur —</option>
          {formateurs.map((f: any) => (
            <option key={f.id} value={f.id}>
              {f.firstName} {f.lastName}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-white/50">
        </p>
      </div>

      {/* COORDINATEUR */}
      <div className="mb-6">
        <label className="mb-1 flex items-center gap-2 text-sm font-medium text-white/80">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 text-sm">
            C
          </span>
          Coordinateur
        </label>
        <select
          className="w-full rounded-lg border border-white/15 bg-gray-900/70 px-3 py-2.5 text-sm text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
          value={selectedCoord ?? ""}
          onChange={(e) => setSelectedCoord(Number(e.target.value))}
        >
          <option value="">— Choisir un coordinateur —</option>
          {coordinateurs.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-white/50">
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="danger"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-sm"
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          className="px-5 py-2 rounded-xl text-sm shadow-md hover:shadow-purple-500/40"
        >
          Enregistrer
        </Button>
      </div>
    </div>
  </div>
);
}