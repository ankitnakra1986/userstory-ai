export interface AcceptanceCriteria {
  functional: string[];
  accessibility: string[];
  performance: string[];
  errorHandling: string[];
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: AcceptanceCriteria;
  storyPoints: number | string;
  epic: string;
  flags: string[];
  techNotes: string;
}

export interface GenerationConfig {
  detailLevel: 'light' | 'detailed';
  pointScale: 'fibonacci' | 'tshirt' | 'none';
  crossCutting: {
    accessibility: boolean;
    security: boolean;
    performance: boolean;
    errorHandling: boolean;
    compliance: boolean;
  };
}

export interface GenerationRequest {
  prd: string;
  config: GenerationConfig;
  apiKey: string;
}

export interface GenerationResponse {
  stories: UserStory[];
  summary: {
    totalStories: number;
    totalPoints: number | string;
    epics: string[];
  };
}
