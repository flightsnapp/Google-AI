export type QuizAnswers = number[];
export type FollowupAnswers = number[];

export interface QuizQuestion {
  id: number;
  trait: 'O' | 'C' | 'E' | 'A' | 'N';
  text: string;
  direction: 'direct' | 'reverse';
  feedback: {
    '1-2': string;
    '3': string;
    '4-5': string;
  };
}

export interface FollowupQuestion {
    text: string;
    tag: string;
}

export interface QuizFlow {
  core_questions: QuizQuestion[];
  feedback_moments: { after_question: number; feedback: string; teaser: string; }[];
  follow_up_questions: FollowupQuestion[];
  modifiers: string[];
}

export interface Persona {
  name: string;
  vibe: string;
  tags: string[];
  weights: {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
  };
  reasoning: string;
  dot_score: number;
  description: string;
  image_url: string;
}

export interface Flight {
  airline: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price: number;
}

export interface Lodging {
  name: string;
  type: 'Hotel' | 'Resort' | 'Hostel' | 'Vacation Rental' | 'Boutique Hotel' | 'Eco-Lodge';
  rating: number;
  nights: number;
  price_per_night: number;
  total_price: number;
}

export interface VacationPackage {
  name: string;
  total_price: number;
  price_per_traveler: number;
  flight: Flight;
  lodging: Lodging;
  activity: string;
  fit_notes: string;
  booking_link: string;
  availability: 'High' | 'Medium' | 'Low';
  pricing_basis: string;
  image_url: string;
}

export interface SquadTier {
  tier: number;
  min_members: number;
  rewards: string[];
  cta: string;
}

export interface Shareable {
  short_blurb: string;
  share_cta_x: string;
  copy_blocks: {
    title: string;
    subtitle: string;
  };
}

export interface BookingStubs {
  flight_query: string;
  hotel_query: string;
  activity_query: string;
  affiliate_hint: string;
}

export interface CuratorResponse {
  quiz_flow: QuizFlow;
  persona_assignment: Persona;
  curated_packages: VacationPackage[];
  snapp_squad_tiers: SquadTier[];
  shareables_per_package: Shareable[];
  booking_session_stubs: BookingStubs;
}

export interface TripSettings {
    departureCity: string;
    budgetMin: number;
    budgetMax: number;
    departureDate: string;
    travelers: number;
}

export interface UserInputs {
    departure_city: string;
    earliest_departure: string;
    flex_days: number;
    budget_min: number;
    budget_max: number;
    travelers: number;
    group_interest: boolean;
    initial_group_size: number;
    quiz_answers: QuizAnswers;
    followup_answers: FollowupAnswers;
    selected_modifiers: string[];
    assigned_persona_name: string;
}

export interface UserProfile {
    name: string;
    email?: string;
    picture: string;
}

export interface QuizData {
    quizAnswers: QuizAnswers;
    followupAnswers: FollowupAnswers;
    selectedModifiers: string[];
    assignedPersonaName: string;
}

// --- Snapp Squad Vaycovers ---

export interface VaycoverRewardTier {
  member_count: number;
  reward: string;
  unlocked: boolean;
}

export interface VaycoverItineraryDay {
    day: number;
    title: string;
    description: string;
}

export interface Vaycover {
  id: string;
  isSpotlight: boolean;
  title: string;
  destination: string;
  dates: string;
  price_range: string;
  hero_image: string;
  dominant_personas: string[];
  ideal_weights: {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
  };
  squad_progress: number;
  squad_goal: number;
  reward_tiers: VaycoverRewardTier[];
  description: string;
  itinerary: VaycoverItineraryDay[];
  lodging_info: string;
}

// --- Gamification ---
export interface Badge {
    name: string;
    description: string;
    icon: string; // Could be an emoji or an SVG path
}