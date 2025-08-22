// types/organization.ts
// Ce fichier définit les interfaces TypeScript pour les entités Organization et Advertissement, basées sur le schéma Prisma.

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
  organization?: Organization | null; // Relation optionnelle
}

export interface Organization {
  id: string;
  firstName: string;
  lastName: string;
  sex: string;
  logo: string;
  advertissements: Advertissement[]; // Liste des publicités associées
}