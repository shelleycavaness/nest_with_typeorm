export interface ProfileData {
  username: string;
  bio: string;
  points: number;
  image?: string;
  following?: boolean;
}

export interface ProfileRO {
  profile: ProfileData;
}