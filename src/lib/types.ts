
export type Testimonial = {
  name: string;
  location: string;
  text: string;
  avatar: string;
  avatarHint: string;
};

export type LocalizedString = {
  en: string;
  hi: string;
  cg: string;
};

// Represents a user object as returned by the backend API.
export type User = {
    id: string;
    email: string;
    name: string;
    profilePhoto: string;
    role: "USER" | "ADMIN" | "AGENT" | "PREMIUM_USER";
    isActive: boolean;
    isBanned: boolean;
    profile: ApiProfile;
};

// Represents a profile's media item from the API.
export type ApiMedia = {
    id: string;
    url: string;
    thumbnailUrl?: string;
    type: string;
    isProfilePicture?: boolean;
}

// Represents the education details from the API.
export type ApiEducation = {
  degree: string;
  field?: string;
  institution: string;
}

// Represents an occupation from the API
export type ApiOccupation = {
  designation?: string;
  companyName?: string;
}

// Represents a partner preference from the API
export type ApiPartnerPreference = {
    ageFrom: number;
    ageTo: number;
    heightFrom: number;
    heightTo: number;
    religion?: string;
    caste?: string;
    description?: string;
}

// Represents a user profile as returned by the backend API.
export type ApiProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  religion: string;
  caste?: string;
  motherTongue: string;
  maritalStatus: string;
  city?: string;
  state?: string;
  country?: string;
  nativeDistrict?: string;
  nativeState?: string;
  height?: number;
  occupations: ApiOccupation[];
  education: ApiEducation[];
  media: ApiMedia[];
  profileCompleteness: number;
  isVerified: boolean;
  aboutMe?: string;
  partnerPreference?: ApiPartnerPreference;
};

// Represents a profile card as returned from the /matches or /search endpoints
export type MatchProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  city?: string;
  state?: string;
  height?: number;
  aboutMe?: string;
  // Use the first education entry as the primary display
  education: ApiEducation[];
  // Use the first occupation entry as the primary display
  occupations: {
    designation?: string;
  }[];
  media: ApiMedia[];
}

// Represents an interest received from the API
export type Interest = {
    id: string;
    senderProfile: MatchProfile;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    createdAt: string;
}
