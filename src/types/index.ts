﻿export type Platform = "instagram" | "youtube" | "tiktok";

export interface UserProfileSummary {
  user_id: string;
  username: string;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  handle?: string;
  custom_name?: string;
  platform?: Platform;
  avg_views?: number;
}

export interface ProfileInterest {
  id?: number;
  name: string;
}

export interface ProfilePost {
  post_id: string;
  image?: string;
  thumbnail?: string;
  link?: string;
  text?: string;
  stat?: {
    likes?: number;
    comments?: number;
    views?: number;
  };
}

export interface AudienceSegment {
  code: string;
  weight: number;
}

export interface AudienceFollowers {
  success: boolean;
  data?: {
    audience_ages?: AudienceSegment[];
    audience_genders?: AudienceSegment[];
    audience_geo?: {
      countries?: Array<{
        id?: number;
        name: string;
        code?: string;
        weight: number;
      }>;
    };
  };
}

export interface SearchAccount {
  account: {
    user_profile: UserProfileSummary;
    audience_source: string;
  };
}

export interface SearchData {
  total: number;
  accounts: SearchAccount[];
}

export interface FullUserProfile extends UserProfileSummary {
  type?: string;
  description?: string;
  is_business?: boolean;
  posts_count?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_reels_plays?: number;
  gender?: string;
  age_group?: string;
  top_posts?: ProfilePost[];
  recent_posts?: ProfilePost[];
  interests?: ProfileInterest[];
  relevant_tags?: Array<{ tag: string }>;
}

export interface ProfileDetailResponse {
  cached?: boolean;
  data: {
    success: boolean;
    user_profile: FullUserProfile;
  };
  audience_followers?: AudienceFollowers;
}

export interface SelectedProfile {
  user_id: string;
  username: string;
  platform: Platform;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  url: string;
}
