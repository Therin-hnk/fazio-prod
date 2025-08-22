// types/advertissement.ts
// Ce fichier peut être fusionné avec types/organization.ts, mais pour clarté, séparé.

export interface Advertissement {
  id: string;
  name: string;
  description?: string | null;
  owner: string;
  organizationId: string;
  link: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  organization?: Organization | null; // Relation optionnelle vers Organization
}

export interface Organization {
  id: string;
  firstName: string;
  lastName: string;
  sex: string;
  logo: string;
  advertissements: Advertissement[]; // Liste des publicités
}