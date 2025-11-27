
export interface Project {
  id: string;
  name: string;
  garmentType: string; // 'T-Shirt', 'Hoodie', 'Dress'
  lastEdited: string;
  thumbnailUrl: string;
  description?: string;
}

export type FitType = 'Regular' | 'Slim' | 'Oversized';

export interface DesignState {
  projectName: string;
  garmentType: string;
  color: string;
  textureUrl: string | null;
  description: string;
  fit: FitType;
  textureScale: number;
  customModelUrl: string | null; // URL blob for user-uploaded GLB
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export enum GarmentType {
  TSHIRT = 'T-Shirt',
  HOODIE = 'Hoodie',
  DRESS = 'Dress'
}

export interface AiResponse {
  suggestedColor: string;
  designDescription: string;
  texturePattern: string; // In a real app, this would be a URL or base64
}
