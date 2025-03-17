export interface ReviewStats {
  average: number
  total: number
  distribution: {
    [key: number]: number 
  }
}

export interface Author {
  id?: string; 
  name: string;
  email: string | null;
}

export interface LawyerReview {
  id: string;
  rating: number;
  title?: string;
  content: string;
  author: Author;
  isAnonymous: boolean;
  userId: string; 
  date: string;
  isHired: boolean;
}