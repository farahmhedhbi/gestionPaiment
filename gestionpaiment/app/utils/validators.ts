export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateCIN = (cin: string): boolean => {
  return /^[0-9]{8}$/.test(cin);
};

export const validateRIB = (rib: string): boolean => {
  return /^[0-9]{20}$/.test(rib);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const bankNames = [
  'Banque Centrale de Tunisie',
  'Banque de Tunisie',
  'Société Tunisienne de Banque',
  'Banque Nationale Agricole',
  'Banque de l\'Habitat',
  'Banque Internationale Arabe de Tunisie',
  'Amen Bank',
  'Union Internationale de Banques',
  'Arab Tunisian Bank',
  'Banque de Tunisie et des Emirats',
  'Attijari Bank',
  'Banque de Financement des Petites et Moyennes Entreprises',
  'Banque Tuniso-Koweitienne',
  'Tunisian Saudi Bank',
  'Banque de Tunisie et des Emirats',
  'Banque Tuniso-Libyenne',
  'Banque Zitouna',
  'Al Baraka Bank',
  'Banque de Développement Local',
  'Banque Tuniso-Qatari'
];