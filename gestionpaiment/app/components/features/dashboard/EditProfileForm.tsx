'use client';

import { useState } from 'react';
import { FaUser, FaUniversity, FaIdCard, FaCreditCard, FaList, FaSave, FaTimes, FaTasks } from 'react-icons/fa';
import { User } from '@/app/types';
import { validateCIN, validateRIB, bankNames } from '@/app/utils/validators';
import { Button } from '@/app/components/ui/Button';

interface EditProfileFormProps {
  userData: User;
  fonctionnalites: {[key: string]: string};
  isCoordinateur: boolean;
  cinModified: boolean;
  nameModified: boolean;
  onSave: (userData: User) => Promise<void>;
  onCancel: () => void;
}

export const EditProfileForm = ({ 
  userData, 
  fonctionnalites, 
  isCoordinateur, 
  cinModified, 
  nameModified, 
  onSave, 
  onCancel 
}: EditProfileFormProps) => {
  const [formData, setFormData] = useState<User>({
    ...userData,
    // Assurer que les valeurs ne sont jamais null
    cin: userData.cin || '',
    rib: userData.rib || '',
    bankName: userData.bankName || '',
    fonctionnalite: userData.fonctionnalite || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof User, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fonctionnalitesDisponibles = Object.keys(fonctionnalites).length > 0 
    ? fonctionnalites 
    : {
        'GESTION_FORMATEURS': 'Gestion des formateurs',
        'SUIVI_FORMATIONS': 'Suivi des formations',
        'VALIDATION_DOSSIERS': 'Validation des dossiers',
        'RAPPORTS_STATISTIQUES': 'Rapports statistiques',
        'GESTION_UTILISATEURS': 'Gestion des utilisateurs'
      };

  console.log('📋 Fonctionnalités disponibles:', fonctionnalitesDisponibles);
  console.log('👤 Est coordinateur:', isCoordinateur);
  console.log('📝 Fonctionnalité actuelle:', formData.fonctionnalite);

  return (
    <div className="mb-6 bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-6 animate-slideDown shadow-2xl shadow-cyan-500/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-cyan-300">Modifier le Profil</h2>
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            loading={loading}
            className="flex items-center gap-2"
          >
            <FaSave />
            Sauvegarder
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <FaTimes />
            Annuler
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations personnelles */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
            <FaUser className="text-cyan-400" />
            Informations Personnelles
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-200 text-sm mb-2 font-medium">
                Prénom {nameModified && <span className="text-green-400 text-xs">(Verrouillé)</span>}
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                  if (!nameModified) {
                    handleChange('firstName', e.target.value);
                  }
                }}
                readOnly={nameModified}
                className={`w-full bg-slate-700/60 border ${
                  nameModified ? 'border-green-500/30' : 'border-cyan-500/30'
                } rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400 ${
                  nameModified ? 'cursor-not-allowed opacity-80' : ''
                }`}
                placeholder="Votre prénom"
              />
            </div>
            <div>
              <label className="block text-cyan-200 text-sm mb-2 font-medium">
                Nom {nameModified && <span className="text-green-400 text-xs">(Verrouillé)</span>}
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => {
                  if (!nameModified) {
                    handleChange('lastName', e.target.value);
                  }
                }}
                readOnly={nameModified}
                className={`w-full bg-slate-700/60 border ${
                  nameModified ? 'border-green-500/30' : 'border-cyan-500/30'
                } rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400 ${
                  nameModified ? 'cursor-not-allowed opacity-80' : ''
                }`}
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="block text-cyan-200 text-sm mb-2 font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400"
                placeholder="votre@email.com"
              />
            </div>
          </div>
        </div>

        {/* Coordonnées bancaires et fonctionnalité */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
            <FaCreditCard className="text-cyan-400" />
            Coordonnées et Fonctionnalité
          </h3>
          
          <div className="space-y-4">
            {/* Champ CIN */}
            <div>
              <label className="block text-cyan-200 text-sm mb-2 font-medium">
                CIN {cinModified && <span className="text-green-400 text-xs">(Verrouillé)</span>}
              </label>
              <input
                type="text"
                value={formData.cin}
                onChange={(e) => {
                  if (!cinModified) {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length <= 8) {
                      handleChange('cin', value);
                    }
                  }
                }}
                readOnly={cinModified}
                maxLength={8}
                className={`w-full bg-slate-700/60 border ${
                  cinModified ? 'border-green-500/30' : 'border-cyan-500/30'
                } rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400 ${
                  cinModified ? 'cursor-not-allowed opacity-80' : ''
                }`}
                placeholder="8 chiffres"
              />
              {formData.cin && !validateCIN(formData.cin) && (
                <p className="text-red-400 text-xs mt-1">Le CIN doit contenir 8 chiffres</p>
              )}
            </div>

            {/* Champ RIB */}
            <div>
              <label className="block text-cyan-200 text-sm mb-2 font-medium">RIB</label>
              <input
                type="text"
                value={formData.rib}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 20) {
                    handleChange('rib', value);
                  }
                }}
                maxLength={20}
                className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400"
                placeholder="20 chiffres"
              />
              {formData.rib && !validateRIB(formData.rib) && (
                <p className="text-red-400 text-xs mt-1">Le RIB doit contenir 20 chiffres</p>
              )}
            </div>

            {/* Champ nom de la banque */}
            <div>
              <label className="block text-cyan-200 text-sm mb-2 font-medium">Nom de la banque</label>
              <select
                value={formData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300"
              >
                <option value="">Sélectionnez une banque</option>
                {bankNames.map((bankName, index) => (
                  <option key={index} value={bankName}>
                    {bankName}
                  </option>
                ))}
              </select>
            </div>

            {/* Fonctionnalité (uniquement pour les coordinateurs) */}
            {isCoordinateur && (
              <div className="pt-4 border-t border-orange-500/20">
                <h4 className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2">
                  <FaTasks className="text-orange-400" />
                  Fonctionnalité
                </h4>
                
                <div>
                  <label className="block text-cyan-200 text-sm mb-2 font-medium">
                    Sélectionnez votre fonctionnalité principale
                  </label>
                  
                  {Object.keys(fonctionnalitesDisponibles).length > 0 ? (
                    <select
                      value={formData.fonctionnalite}
                      onChange={(e) => handleChange('fonctionnalite', e.target.value)}
                      className="w-full bg-slate-700/60 border border-orange-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-400 focus:bg-slate-700/80 transition-all duration-300"
                    >
                      <option value="">Sélectionnez une fonctionnalité</option>
                      {Object.entries(fonctionnalitesDisponibles).map(([key, value]) => (
                        <option key={key} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
                      <p className="text-orange-300 text-sm">
                        Aucune fonctionnalité disponible pour le moment
                      </p>
                    </div>
                  )}
                  
                  <p className="text-cyan-100/50 text-xs mt-2">
                    Cette fonctionnalité définit votre rôle principal dans le système
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};