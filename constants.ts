import type { QuizQuestion, FollowupQuestion, Persona, Vaycover, Badge } from './types';

// Average the weights of dominant personas to get the ideal weights for a Vaycover
const calculateIdealWeights = (personaNames: string[]) => {
    const weights = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    const personas = personaNames.map(name => PERSONA_DATA.find(p => p.name === name)).filter(Boolean) as Persona[];
    if (personas.length === 0) return weights;

    personas.forEach(p => {
        weights.O += p.weights.O;
        weights.C += p.weights.C;
        weights.E += p.weights.E;
        weights.A += p.weights.A;
        weights.N += p.weights.N;
    });

    weights.O /= personas.length;
    weights.C /= personas.length;
    weights.E /= personas.length;
    weights.A /= personas.length;
    weights.N /= personas.length;
    
    return weights;
};

export const CORE_QUESTIONS: QuizQuestion[] = [
    { id: 1, trait: 'O', direction: 'direct', text: "If a friend pitches a wild idea—like painting a mural at midnight—I’m in, no questions asked.", feedback: { '1-2': "Sticking to the familiar? Nothing wrong with a comfort zone!", '3': "You’re open to new places, but not quite ready to leap without looking.", '4-5': "Nice, you’re a true adventurer at heart—bet you’ve got stories!" } },
    { id: 2, trait: 'O', direction: 'reverse', text: "I’d rather rewatch my favorite show than dive into something totally out there.", feedback: { '1-2': "Always chasing the unknown? Love that adventurous spirit!", '3': "You’re open to both the familiar and the new—best of both worlds!", '4-5': "You like the tried-and-true—nothing wrong with sticking to the classics!" } },
    { id: 3, trait: 'C', direction: 'direct', text: "I’d never show up to a potluck without knowing who’s bringing what.", feedback: { '1-2': "You’re a free spirit—love the energy!", '3': "You like a plan but can roll with the punches—nice balance!", '4-5': "You’ve got that planner energy—everything must run like clockwork!" } },
    { id: 4, trait: 'C', direction: 'reverse', text: "I’d roll into a party with a bag of chips and a shrug—someone’ll figure it out.", feedback: { '1-2': "You’re a planner through and through—respect the structure!", '3': "You like a bit of spontaneity but not too much—balanced vibes.", '4-5': "You’re all about that spontaneous life—love that energy!" } },
    { id: 5, trait: 'E', direction: 'direct', text: "I’d pick a karaoke night with strangers over a quiet coffee solo any day.", feedback: { '1-2': "Solo vibes—nothing wrong with keeping to yourself!", '3': "You’re open to socializing but not always seeking it—cool balance.", '4-5': "You’re a social butterfly—bet you’ve got friends all over!" } },
    { id: 6, trait: 'E', direction: 'reverse', text: "A packed room sounds like a nightmare—I’d rather vibe alone with my playlist.", feedback: { '1-2': "Crowds are your thing—love the social energy!", '3': "You’re flexible—solo or social, you’re good either way.", '4-5': "You’re a lone wolf—love that independent spirit!" } },
    { id: 7, trait: 'A', direction: 'direct', text: "I’d cancel my plans to help a friend move, even if it’s last-minute chaos.", feedback: { '1-2': "You’re keeping your plans—nothing wrong with that!", '3': "You’re willing to help but not always at your own expense—fair enough.", '4-5': "You’re a helpful soul—bet you’re the go-to for favors!" } },
    { id: 8, trait: 'A', direction: 'reverse', text: "If my crew’s arguing, I’m not playing referee—I’ll do my own thing.", feedback: { '1-2': "You’re a peacemaker—bet you’re the glue in your crew!", '3': "You’re flexible—sometimes you step in, sometimes you don’t.", '4-5': "You’re independent—love that trailblazer vibe!" } },
    { id: 9, trait: 'N', direction: 'direct', text: "If my phone dies mid-day, I’m spiraling about all the ‘what-ifs.’", feedback: { '1-2': "You’re cool as a cucumber—nothing fazes you!", '3': "You’re flexible but not totally chill—fair enough.", '4-5': "You’re a bit of a worrier—planning must be key for you!" } },
    { id: 10, trait: 'N', direction: 'reverse', text: "I’d lose my wallet and still think, ‘Eh, it’ll work itself out.’", feedback: { '1-2': "You’re a bit of a stress case—planning must be your jam!", '3': "You’re adaptable but not totally unfazed—balanced.", '4-5': "You’re chill as hell—love that energy!" } }
];

export const TEASERS = {
  3: (scores: { O: number }) => {
    if (scores.O >= 7) return "You’re leaning adventurous—let’s see if you’re a planner or a free spirit!";
    if (scores.O >= 4) return "You’re balanced—open to some new things but not too wild. Let’s keep going!";
    return "You’re a comfort-seeker—wonder if you’re a planner or a free spirit!";
  },
  6: (scores: { E: number }) => {
    if (scores.E >= 7) return "You’re quite the social butterfly—let’s find out more!";
    return "You enjoy your own company—let’s see what else defines you!";
  },
  9: (scores: { C: number }) => {
    if (scores.C >= 7) return "You’re a planner—almost there!";
    return "You go with the flow—let’s wrap this up!";
  }
};

export const PERSONA_FOLLOWUP_QUESTIONS: Record<string, FollowupQuestion[]> = {
    "The Wild Trailblazer": [
        { text: "I’d rather wing my plans and see where the day takes me.", tag: "Spontaneous Planner" },
        { text: "I love diving into new cultures and trying wild stuff tourists skip.", tag: "Culture Enthusiast" },
        { text: "I’m always pushing to stay out late or hit one more spot.", tag: "Night Owl" }
    ],
    "The Party Pathfinder": [
        { text: "I thrive in social settings and love meeting new people.", tag: "Social Butterfly" },
        { text: "I’m always up for a spontaneous adventure.", tag: "Spontaneous Adventurer" },
        { text: "I enjoy nightlife and vibrant atmospheres.", tag: "Nightlife Lover" }
    ],
    "The Solo Dreamer": [
        { text: "I prefer solo travel to explore at my own pace.", tag: "Solo Traveler" },
        { text: "I’m drawn to quiet, reflective destinations.", tag: "Reflective Explorer" },
        { text: "I love immersing myself in local art and culture.", tag: "Culture Enthusiast" }
    ],
    "The Easygoing Roamer": [
        { text: "I prefer flexible plans over strict schedules.", tag: "Flexible Planner" },
        { text: "I enjoy spontaneous detours during my trips.", tag: "Spontaneous Explorer" },
        { text: "I’m open to trying new things without much planning.", tag: "Open-Minded Adventurer" }
    ],
    "The Adventure Architect": [
        { text: "I meticulously plan every detail of my trips.", tag: "Detailed Planner" },
        { text: "I enjoy organizing group adventures.", tag: "Group Coordinator" },
        { text: "I prefer structured activities over free time.", tag: "Structured Adventurer" }
    ],
    "The Comfort Crusader": [
        { text: "I stick to familiar destinations and routines.", tag: "Routine Traveler" },
        { text: "I prefer group travel for safety and comfort.", tag: "Group Traveler" },
        { text: "I enjoy revisiting places I’ve been before.", tag: "Repeat Visitor" }
    ],
    "The Quiet Traditionalist": [
        { text: "I prefer solo travel to avoid social exhaustion.", tag: "Solo Traveler" },
        { text: "I enjoy quiet, predictable environments.", tag: "Calm Seeker" },
        { text: "I stick to well-known tourist spots.", tag: "Traditional Explorer" }
    ],
    "The Steady Socialite": [
        { text: "I enjoy traveling with a small group of close friends.", tag: "Small Group Traveler" },
        { text: "I like a balance of planned activities and free time.", tag: "Balanced Planner" },
        { text: "I’m open to meeting new people but prefer familiar faces.", tag: "Socially Selective" }
    ],
    "The Nervous Nomad": [
        { text: "I need a detailed plan to feel secure while traveling.", tag: "Security Seeker" },
        { text: "I prefer destinations with good infrastructure and safety.", tag: "Safe Traveler" },
        { text: "I enjoy adventurous activities but with precautions.", tag: "Cautious Adventurer" }
    ],
    "The Coolheaded Captain": [
        { text: "I stay calm under pressure and handle travel mishaps well.", tag: "Calm Problem Solver" },
        { text: "I prefer leading group trips and making decisions.", tag: "Group Leader" },
        { text: "I enjoy planning but can adapt when needed.", tag: "Adaptable Planner" }
    ],
    "The Impulsive Influencer": [
        { text: "I often make last-minute travel decisions.", tag: "Last-Minute Traveler" },
        { text: "I love sharing my travel experiences on social media.", tag: "Social Media Sharer" },
        { text: "I enjoy group trips where I can meet new people.", tag: "Social Connector" }
    ],
    "The Lone Maverick": [
        { text: "I prefer traveling alone and setting my own pace.", tag: "Solo Adventurer" },
        { text: "I enjoy off-the-beaten-path destinations.", tag: "Offbeat Explorer" },
        { text: "I don’t mind taking risks for unique experiences.", tag: "Risk Taker" }
    ],
    "The Friendly Voyager": [
        { text: "I make friends easily while traveling.", tag: "Social Butterfly" },
        { text: "I enjoy participating in local community events.", tag: "Community Engager" },
        { text: "I prefer group tours to meet like-minded travelers.", tag: "Group Tour Enthusiast" }
    ],
    "The Budget Buccaneer": [
        { text: "I always look for the best deals and discounts.", tag: "Deal Hunter" },
        { text: "I enjoy budget-friendly accommodations like hostels.", tag: "Hostel Dweller" },
        { text: "I’m open to unconventional travel methods to save money.", tag: "Unconventional Traveler" }
    ],
    "The Lavish Logistician": [
        { text: "I prefer luxury accommodations and experiences.", tag: "Luxury Lover" },
        { text: "I meticulously plan every aspect of my trip.", tag: "Meticulous Planner" },
        { text: "I enjoy fine dining and high-end activities.", tag: "Gourmet Traveler" }
    ],
    "The Culture Chaser": [
        { text: "I immerse myself in local customs and traditions.", tag: "Cultural Immersionist" },
        { text: "I enjoy visiting museums and historical sites.", tag: "History Buff" },
        { text: "I prefer destinations with rich cultural heritage.", tag: "Heritage Explorer" }
    ],
    "The Fearless Flyer": [
        { text: "I’m always up for extreme sports and adventures.", tag: "Adrenaline Junkie" },
        { text: "I don’t let fear hold me back from new experiences.", tag: "Fearless Explorer" },
        { text: "I enjoy traveling to remote or challenging destinations.", tag: "Remote Adventurer" }
    ],
    "The Cozy Companion": [
        { text: "I prefer familiar destinations with comfortable amenities.", tag: "Comfort Seeker" },
        { text: "I enjoy traveling with a close friend or partner.", tag: "Companion Traveler" },
        { text: "I like to have a home-like base during my trips.", tag: "Homebody Explorer" }
    ],
    "The Restless Ruler": [
        { text: "I often feel the need to be in control of travel plans.", tag: "Control Seeker" },
        { text: "I enjoy leading group activities and making decisions.", tag: "Group Leader" },
        { text: "I get anxious if things don’t go according to plan.", tag: "Anxiety Prone" }
    ],
    "The Zen Seeker": [
        { text: "I travel to find peace and tranquility.", tag: "Peace Seeker" },
        { text: "I enjoy meditation or yoga retreats.", tag: "Wellness Traveler" },
        { text: "I prefer destinations with natural beauty and serenity.", tag: "Nature Lover" }
    ],
    "The Squad Strategist": [
        { text: "I enjoy organizing group trips and activities.", tag: "Group Organizer" },
        { text: "I prefer traveling with a large group of friends.", tag: "Large Group Traveler" },
        { text: "I like to plan surprises or special events for the group.", tag: "Event Planner" }
    ],
    "The Casual Curator": [
        { text: "I like a mix of planned activities and free time.", tag: "Balanced Planner" },
        { text: "I enjoy discovering local art and culture casually.", tag: "Casual Explorer" },
        { text: "I’m open to spontaneous changes in plans.", tag: "Flexible Traveler" }
    ],
    "The Edgy Empath": [
        { text: "I’m drawn to destinations with a unique or alternative vibe.", tag: "Alternative Explorer" },
        { text: "I enjoy connecting deeply with locals and their stories.", tag: "Empathetic Traveler" },
        { text: "I’m open to experiences that challenge my perspectives.", tag: "Perspective Challenger" }
    ],
    "The Grounded Globetrotter": [
        { text: "I prefer destinations that are easy to navigate.", tag: "Ease Seeker" },
        { text: "I enjoy learning about different cultures in a relaxed way.", tag: "Relaxed Learner" },
        { text: "I like to have a comfortable base to return to after exploring.", tag: "Comfort Base Traveler" }
    ],
    "The Homebound Hustler": [
        { text: "I prefer staycations or local trips over long-distance travel.", tag: "Local Explorer" },
        { text: "I enjoy discovering new things in my own city.", tag: "Urban Adventurer" },
        { text: "I’m always looking for ways to make local experiences exciting.", tag: "Experience Maximizer" }
    ]
};

export const MODIFIERS: string[] = [
    "Adventure","Relaxation","Family-friendly","Budget","Luxury","Cultural","Beach","Mountain","City Break","Rural Escape","Foodie","Wellness","Eco-friendly","Romantic","Solo Travel","Group Trip","Historical","Wildlife","Sports","Festival","Shopping","Nightlife","Volunteer","Educational","Off-the-Grid"
];

export const LOADING_MESSAGES: string[] = [
    "Analyzing your travel DNA...",
    "Consulting the globetrotting gurus...",
    "Cross-referencing vibes with vistas...",
    "Curating your perfect escape...",
    "Finding destinations that match your persona...",
    "Packing virtual bags for you...",
    "Just about ready to reveal your next adventure!"
];

export const PERSONA_DATA: Omit<Persona, 'reasoning' | 'dot_score'>[] = [
  { name: "The Wild Trailblazer", vibe: "Fearless explorer of uncharted paths.", tags: ["Adventure", "Spontaneous", "Outdoor", "Cultural"], weights: { O: 0.286, C: -0.214, E: 0.286, A: -0.143, N: -0.071 }, description: "Drawn to the thrill of the unknown, you seek out remote landscapes and authentic cultural encounters, forging your own path.", image_url: "https://picsum.photos/seed/wildtrailblazer/400/600" },
  { name: "The Party Pathfinder", vibe: "Nightlife socialite, lives for vibrant crowds.", tags: ["Social", "Nightlife", "Spontaneous", "Group"], weights: { O: 0.071, C: -0.286, E: 0.357, A: 0.214, N: -0.071 }, description: "You come alive after dark, seeking out the most vibrant clubs, bars, and festivals. For you, a great trip is a great party.", image_url: "https://picsum.photos/seed/partypathfinder/400/600" },
  { name: "The Solo Dreamer", vibe: "Introspective creative seeking solitude.", tags: ["Solo", "Creative", "Introspective", "Wellness"], weights: { O: 0.385, C: -0.231, E: -0.308, A: 0.0, N: 0.077 }, description: "Your travels are a canvas for creativity and self-reflection. You prefer quiet cafes and inspiring landscapes to crowded landmarks.", image_url: "https://picsum.photos/seed/solodreamer/400/600" },
  { name: "The Easygoing Roamer", vibe: "Laid-back drifter loving flexibility.", tags: ["Relaxed", "Spontaneous", "Offbeat", "Eco"], weights: { O: 0.364, C: -0.364, E: -0.273, A: 0.0, N: 0.0 }, description: "You go where the wind takes you, embracing serendipity. A loose plan and an open mind are your only travel essentials.", image_url: "https://picsum.photos/seed/easygoingroamer/400/600" },
  { name: "The Adventure Architect", vibe: "Structured thrill-planner.", tags: ["Adventure", "Planner", "Organized", "Eco"], weights: { O: 0.364, C: 0.364, E: 0.0, A: 0.0, N: -0.273 }, description: "Adrenaline is on the itinerary. You meticulously plan your adventures, from mountain treks to scuba dives, for maximum thrill.", image_url: "https://picsum.photos/seed/adventurearchitect/400/600" },
  { name: "The Comfort Crusader", vibe: "Seeker of cozy luxury and familiarity.", tags: ["Comfort", "Luxury", "Social", "Familiar"], weights: { O: -0.286, C: 0.214, E: 0.143, A: 0.286, N: -0.071 }, description: "You believe a vacation is for relaxing in style. High-end hotels, familiar comforts, and seamless service are your non-negotiables.", image_url: "https://picsum.photos/seed/comfortcrusader/400/600" },
  { name: "The Quiet Traditionalist", vibe: "Planner preferring classic calm.", tags: ["Planner", "History", "Traditional", "Solo"], weights: { O: -0.333, C: 0.417, E: -0.25, A: 0.0, N: 0.0 }, description: "You appreciate the timeless and tranquil. Well-planned visits to historical sites and quiet, classic destinations are your ideal.", image_url: "https://picsum.photos/seed/quiettraditionalist/400/600" },
  { name: "The Steady Socialite", vibe: "Reliable connector, group harmony lover.", tags: ["Social", "Group", "Relaxed", "Friendly"], weights: { O: 0.077, C: 0.231, E: 0.308, A: 0.231, N: -0.154 }, description: "You're the glue that holds a group trip together, ensuring everyone is happy. You thrive on shared experiences and good vibes.", image_url: "https://picsum.photos/seed/steadysocialite/400/600" },
  { name: "The Nervous Nomad", vibe: "Cautious traveler favoring safety.", tags: ["Cautious", "Solo", "Creative", "Guided"], weights: { O: 0.25, C: -0.25, E: -0.167, A: 0.0, N: 0.333 }, description: "You love to explore but prioritize safety and predictability. Guided tours and well-vetted destinations give you peace of mind.", image_url: "https://picsum.photos/seed/nervousnomad/400/600" },
  { name: "The Coolheaded Captain", vibe: "Calm leader of group journeys.", tags: ["Planner", "Group", "Calm", "Leader"], weights: { O: 0.0, C: 0.385, E: 0.231, A: 0.077, N: -0.308 }, description: "You're the natural leader on any group trip. Your calm demeanor and organizational skills make every journey smooth.", image_url: "https://picsum.photos/seed/coolheadedcaptain/400/600" },
  { name: "The Impulsive Influencer", vibe: "Charismatic trendsetter and content creator.", tags: ["Spontaneous", "Social", "Influencer", "Viral"], weights: { O: 0.25, C: -0.333, E: 0.333, A: 0.083, N: 0.0 }, description: "You chase the next viral moment, drawn to photogenic spots and trendy experiences. Your journey is your content.", image_url: "https://picsum.photos/seed/impulsiveinfluencer/400/600" },
  { name: "The Lone Maverick", vibe: "Independent off-grid adventurer.", tags: ["Solo", "Adventure", "Independent", "Off-Grid"], weights: { O: 0.333, C: 0.0, E: -0.333, A: -0.333, N: 0.0 }, description: "You find freedom in solitude and rugged landscapes. You're self-reliant and prefer destinations far from the tourist trail.", image_url: "https://picsum.photos/seed/lonemaverick/400/600" },
  { name: "The Friendly Voyager", vibe: "Warm connector of cultures.", tags: ["Social", "Friendly", "Spontaneous", "Eco"], weights: { O: 0.0, C: -0.214, E: 0.286, A: 0.357, N: -0.143 }, description: "You travel to connect with people. You easily make friends with locals and fellow travelers, creating a global community.", image_url: "https://picsum.photos/seed/friendlyvoyager/400/600" },
  { name: "The Budget Buccaneer", vibe: "Resourceful bargain hunter.", tags: ["Budget", "Adventure", "Resourceful", "Spontaneous"], weights: { O: 0.4, C: -0.3, E: 0.0, A: -0.3, N: 0.0 }, description: "You can make any trip happen on a shoestring budget. You're a master of finding deals and unique, low-cost adventures.", image_url: "https://picsum.photos/seed/budgetbuccaneer/400/600" },
  { name: "The Lavish Logistician", vibe: "Precise luxury planner.", tags: ["Luxury", "Planner", "Organized", "Social"], weights: { O: 0.0, C: 0.455, E: 0.273, A: 0.0, N: -0.273 }, description: "You curate flawless, high-end experiences. Every detail of your luxurious itinerary is planned to perfection.", image_url: "https://picsum.photos/seed/lavishlogistician/400/600" },
  { name: "The Culture Chaser", vibe: "Empathetic seeker of arts & heritage.", tags: ["Culture", "Solo", "Curious", "Eco"], weights: { O: 0.308, C: 0.0, E: -0.231, A: 0.308, N: -0.154 }, description: "You travel to understand the world, immersing yourself in local art, history, and traditions with an open heart and mind.", image_url: "https://picsum.photos/seed/culturechaser/400/600" },
  { name: "The Fearless Flyer", vibe: "Adrenaline-driven thrill seeker.", tags: ["Adventure", "Fearless", "Social", "Thrill"], weights: { O: 0.364, C: 0.0, E: 0.273, A: 0.0, N: -0.364 }, description: "If it gets your heart racing, you're there. You live for bungee jumping, skydiving, and any activity that tests your limits.", image_url: "https://picsum.photos/seed/fearlessflyer/400/600" },
  { name: "The Cozy Companion", vibe: "Family-oriented comfort lover.", tags: ["Comfort", "Social", "Planner", "Family"], weights: { O: -0.286, C: 0.214, E: 0.143, A: 0.286, N: -0.071 }, description: "Your ideal trip is about creating warm memories with loved ones in a comfortable, welcoming setting.", image_url: "https://picsum.photos/seed/cozycompanion/400/600" },
  { name: "The Restless Ruler", vibe: "Ambitious achiever seeking status.", tags: ["Ambitious", "Social", "Adventure", "Driven"], weights: { O: -0.071, C: 0.143, E: 0.286, A: -0.214, N: 0.286 }, description: "You're always on the move, seeking challenges and status. Your travels are as ambitious and competitive as you are.", image_url: "https://picsum.photos/seed/restlessruler/400/600" },
  { name: "The Zen Seeker", vibe: "Peaceful wellness-oriented traveler.", tags: ["Wellness", "Calm", "Solo", "Eco"], weights: { O: 0.273, C: 0.0, E: 0.0, A: 0.273, N: -0.455 }, description: "You travel to restore your mind and body. Yoga retreats, spa days, and serene natural settings are your sanctuary.", image_url: "https://picsum.photos/seed/zenseeker/400/600" },
  { name: "The Squad Strategist", vibe: "Sociable organizer of group fun.", tags: ["Group", "Planner", "Social", "Friendly"], weights: { O: 0.0, C: 0.308, E: 0.308, A: 0.231, N: -0.154 }, description: "You excel at planning unforgettable trips for your friends, balancing everyone's interests to create the perfect group getaway.", image_url: "https://picsum.photos/seed/squadstrategist/400/600" },
  { name: "The Casual Curator", vibe: "Chill collector of unique experiences.", tags: ["Curious", "Solo", "Relaxed", "Cultural"], weights: { O: 0.286, C: 0.214, E: -0.214, A: 0.143, N: -0.143 }, description: "You have a knack for finding unique, low-key experiences. You enjoy museums, local markets, and wandering without a strict plan.", image_url: "https://picsum.photos/seed/casualcurator/400/600" },
  { name: "The Edgy Empath", vibe: "Heartfelt creative with alternative edge.", tags: ["Introspective", "Creative", "Spontaneous", "Empathetic"], weights: { O: 0.214, C: -0.214, E: -0.143, A: 0.214, N: 0.214 }, description: "You connect deeply with the world's creative undercurrents, drawn to street art, indie music scenes, and authentic, emotional experiences.", image_url: "https://picsum.photos/seed/edgyempath/400/600" },
  { name: "The Grounded Globetrotter", vibe: "Balanced planner of eco-adventures.", tags: ["Adventure", "Planner", "Calm", "Global"], weights: { O: 0.333, C: 0.333, E: 0.0, A: 0.0, N: -0.333 }, description: "You're a well-balanced traveler who plans exciting eco-adventures while maintaining a calm, practical approach to your journey.", image_url: "https://picsum.photos/seed/groundedglobetrotter/400/600" },
  { name: "The Homebound Hustler", vibe: "Local explorer optimizing weekends.", tags: ["Planner", "Local", "Practical", "Staycation"], weights: { O: -0.286, C: 0.286, E: -0.214, A: 0.0, N: 0.214 }, description: "You're a master of the micro-adventure, finding exciting experiences close to home and making the most of your time off.", image_url: "https://picsum.photos/seed/homeboundhustler/400/600" },
];

export const VISION_CONTENT = {
  title: "Travel Beyond the Algorithm",
  subtitle: "At FlightSnapp, we believe your next vacation should be a reflection of you, not just a response to a search query. We're moving beyond generic travel booking by fusing psychology with intelligent curation. Our system analyzes your unique personality profile—your openness, your conscientiousness, your energy—to craft bespoke travel experiences that resonate on a deeper level. Stop searching, and start discovering.",
};

export const TERMS_CONTENT = `
<h2 class="text-2xl font-bold mb-4 text-cyan-300">Terms of Service</h2>
<p class="mb-4 text-sm italic">Effective Date: March 27, 2025</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">1. Agreement to Terms</h3>
<p class="mb-4">By hopping aboard Flightsnapp or joining our SnappStars program, you're agreeing to these Terms of Service ("Terms")—our roadmap for curating those hyper-personalized, one-of-a-kind YOLO escapes! If these vibes don't align with yours, feel free to explore elsewhere. Let's keep the journey fun and fair for all!</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">2. Use of Our Services</h3>
<p class="mb-4">Flightsnapp is your go-to for intuitive travel magic: Take our Big 5 quiz to unlock personalized snaps, spin for random deals, or match group packages by similar personas—all for personal, non-commercial joyrides. No misuse, interference, or unauthorized spins allowed—we're here to empower spontaneous, 5-star adventures like a vacation playlist reflecting your unique dreams!</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">3. User Responsibilities</h3>
<p class="mb-4">You're the captain of your inputs—ensure quiz responses, contact details, or any shared info are accurate and comply with laws (no illegal vibes here!). For SnappStars, that means verified listings, honest vibe tags (e.g., high Openness for exploratory hikes), and top-notch experiences. Keep it positive, respectful, and aligned with our Millennial/Gen Z ethos—let's curate joy without the drama!</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">4. SnappStars Program (If Applicable)</h3>
<p class="mb-4">If you're shining as a SnappStar, welcome to the spotlight! Your unique properties/experiences fuel our hybrid curator—matching to personas like relaxed retreats for low Neuroticism or social spins for high Extraversion. Agree to our Program Agreement for details on eligibility (18+, verified listings, 4-star standards), commissions (10-15% to us, 80-85% payouts via Stripe with incentives for 5-star ratings), operational integrations (AI scans via Grok API, one-tap bookings), and legal perks (indemnity, IP licenses, data use for anonymized B2B insights). Let's partner to deliver magical, persona-driven escapes—referral bonuses ($50 per recruit) and premium subs ($19.99/mo) keep the growth fun and viral!</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">5. Limitation of Liability</h3>
<p class="mb-4">Our snaps and recommendations are joyful suggestions only—Flightsnapp, our affiliates (like Amadeus or Tiqets), and SnappStars aren't liable for trip mishaps, losses, or real-world curveballs (e.g., booking glitches or adventure outcomes). Use at your own risk, and always double-check with partners. We're here for the fun, not the fine print drama!</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">6. Intellectual Property</h3>
<p class="mb-4">All the tech, content, and curation wizardry on Flightsnapp (including quiz algorithms, snaps, and SnappStars integrations) belong to us or our licensors—protected like a secret travel spot! You grant us a royalty-free license for any shared content (e.g., Star listings or quiz data for ML tweaks), but can't copy, tweak, or distribute ours without permission. Let's respect the creative vibes that make our hybrid magic shine!</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">7. Governing Law</h3>
<p class="mb-4">These Terms cruise under the laws of Alberta, Canada—any disputes get resolved through binding arbitration per ADRIC rules there, keeping things smooth and local. Force majeure covers those unexpected layovers!</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">8. Changes to Terms</h3>
<p class="mb-4">As we evolve (think new affiliate spins or ML upgrades), we'll refresh these Terms—check back for updates with a new effective date. Continued adventures or SnappStar shines mean you agree to the latest version. We'll notify you of big changes, so the fun never skips a beat!</p>
`;

export const PRIVACY_POLICY_CONTENT = `
<p class="mb-4 text-sm italic">Effective Date: March 27, 2025</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">Our Commitment to Your Privacy</h3>
<p class="mb-4">At Flightsnapp, we're all about safeguarding your privacy like a hidden gem retreat—it's the cornerstone of our mission to curate those hyper-personalized, one-of-a-kind YOLO escapes! We commit to collecting only the must-have data to spin our hybrid AI magic, delivering 5-star travel recommendations without snagging any personally identifiable info unless you choose to share it. Dive deeper into our Privacy Policy.</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">1. Information We Collect</h3>
<p class="mb-4">We're laser-focused on essentials to tailor your dream snaps, so here's what we gather:</p>
<ul class="list-disc list-inside mb-4 space-y-2">
  <li><strong>Quiz Responses:</strong> Your fun answers to our Big 5 personality quiz let us decode your unique traits (like high Openness for bold adventures or low Neuroticism for chill retreats) and serve up personalized recommendations via our rule-based filters and ML personalization.</li>
  <li><strong>Technical Data:</strong> We scoop up device details, IP addresses, and usage stats to fine-tune site performance, ensure seamless spins, and boost your overall experience—like optimizing for random deal discoveries or group package matches.</li>
</ul>
<p class="mb-4">We skip the basics like your name, email, or any direct IDs unless you voluntarily ping us (e.g., for beta access or support). No fuss, just fun curation!</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">2. How We Use Your Information</h3>
<p class="mb-4">Your quiz insights fuel our hybrid curator to craft travel playlists that reflect your personality, dreams, and spontaneity—think adventure spins for extraverts or budget-conscious getaways for conscientious types. Technical data helps us maintain a rock-solid platform, squash bugs, and enhance features like flexible date searches or real-time affiliate integrations (e.g., with Amadeus for flights or Tiqets for activities). We stick strictly to these joyful purposes—no detours!</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">3. Data Sharing and Third Parties</h3>
<p class="mb-4">Flightsnapp doesn't currently sell, trade, or share your data for marketing mischief or anything shady—your privacy is our VIP guest! If you opt in (totally your call!), we might use anonymized quiz trends to level up our AI algorithms, ensuring zero ties back to you while making future snaps even more magical for everyone. We may update our data practices in the future, but we'll always notify you via policy changes and prioritize transparency. Otherwise, data stays locked in our ecosystem, with partners like Stripe (for payouts) or Grok API (for uniqueness scans) bound by strict confidentiality to keep things secure and fun.</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">4. Data Security Measures</h3>
<p class="mb-4">We guard your data with top-tier encryption and robust defenses, like a fortress around your favorite secret spot—protecting against unauthorized access, tweaks, or leaks. Our industry-standard practices ensure your quiz vibes and tech footprints stay safe as we curate those spontaneous, 5-star escapes.</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">5. Your Rights and Choices</h3>
<p class="mb-4">No clunky accounts needed—your Flightsnapp journey is streamlined and hassle-free, just like our one-tap Snaps! If you've got questions or want us to zap any session-linked data (e.g., anonymized quiz responses), hit us up at flightsnapp@gmail.com. Under laws like GDPR or CCPA, you can access, correct, or delete info, withdraw consent for optional uses, or object to processing—we're here to make it easy and empower your control!</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">6. Data Retention</h3>
<p class="mb-4">We hold onto quiz responses and tech data only as long as needed to deliver your personalized magic (like matching high Extraversion squads to lively group packages) or meet legal musts—then it's securely wiped or anonymized. Short and sweet, so we can focus on fresh spins for your next adventure!</p>
<h3 class="text-xl font-semibold mb-2 text-cyan-400">7. Policy Updates</h3>
<p class="mb-4">We'll tweak this Privacy Policy as our platform evolves (think new affiliate vibes or ML upgrades), posting changes here with a fresh effective date. Swing by periodically to stay in the loop—we'll keep it transparent and fun, just like our random deal discoveries! We may change our data practices at any time, but we'll always notify you of material updates to ensure your vibes stay aligned.</p>
`;

export const SNAPPSTARS_TERMS_CONTENT = `
<h2 class="text-2xl font-bold mb-4 text-cyan-300">SnappStars Program Agreement</h2>
<p class="mb-4 text-sm italic">Version 1.1 | Effective Date: August 26, 2025</p>

<h3 class="text-xl font-semibold mb-2 text-cyan-400">Introduction</h3>
<p class="mb-4">This Agreement outlines the terms and conditions for participation in the SnappStars program ("Program"), operated by Flightsnapp, Inc. ("Flightsnapp"). The Program enables qualified Stars to list unique properties and experiences, integrating them into Flightsnapp's AI-powered travel curation platform. By participating, Stars agree to these terms, which are designed to foster profitable, scalable partnerships while delivering hyper-personalized, one-of-a-kind travel experiences for Millennials and Gen Z users.</p>
<p class="mb-4">Flightsnapp's vision is to empower intuitive, joyful travel like a vacation playlist—curating spontaneous, 5-star trips reflecting users' personalities via Big 5 psychology quizzes, hybrid AI curation (rule-based filters for budgets/dates and ML for persona matching), random "slot machine" spins for deals, and group packages for similar vibes. SnappStars fuels this by providing exclusive listings blended with affiliates (e.g., Amadeus flights, Tiqets activities) for seamless, one-tap "Snaps."</p>
<p class="mb-4">This Agreement is binding upon approval of a Star's application. Flightsnapp reserves the right to amend terms with 15 days' notice. Consult legal counsel for personalized advice.</p>

<h3 class="text-xl font-semibold mb-2 text-cyan-400">1. Program Overview</h3>
<p class="mb-2"><strong>Program Description</strong></p>
<p class="mb-4">SnappStars allows individuals, influencers, and small operators ("Stars") to apply and list exclusive properties and experiences on Flightsnapp. Listings must be unique and verified, such as off-grid cabins for conscientious budgeters or urban adventures for extraverts. These integrate into Flightsnapp's hybrid curator, matching to user personas (e.g., relaxed vibes for low Neuroticism, adventure for high Openness) via Big 5 quiz results, with features like random spins for spontaneity and group packages for persona similarity.</p>
<p class="mb-2"><strong>Purpose</strong></p>
<p class="mb-4">The Program enhances Flightsnapp's one-stop shop for YOLO-style escapes, driving viral growth through high-quality, personalized curation. Stars benefit from exposure to tech-savvy users, automated bookings, and competitive payouts, while Flightsnapp monetizes via commissions and subscriptions.</p>
<p class="mb-2"><strong>Eligibility Criteria</strong></p>
<ul class="list-disc list-inside mb-4 space-y-2">
  <li>Unique Listings: Exclusive, non-generic properties/experiences with Big 5-inspired vibe tags (e.g., "High Openness: Exploratory hikes included").</li>
  <li>Star Qualifications: Must be 18+; provide proof of ownership/rights, background check, and valid business license if applicable.</li>
  <li>Standards: Listings must meet 4-star potential; no discriminatory, illegal, or commodity offerings.</li>
  <li>Verification: All listings undergo review for authenticity and alignment with Flightsnapp's niche focus on custom, joyful travel.</li>
</ul>

<h3 class="text-xl font-semibold mb-2 text-cyan-400">2. Commission Structure</h3>
<p class="mb-4">Flightsnapp's structure ensures profitability and competitiveness, benchmarked against industry leaders (e.g., Airbnb's 14-16% host fees, VRBO's 8%). Commissions apply to the total booking value (excluding taxes/refunds and flights, handled separately via Amadeus markups).</p>
<p class="mb-2"><strong>Flightsnapp Commission</strong></p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>Base Rate: 12% per booking (range: 10-15%, adjustable for market conditions).</li>
    <li>Tiered Adjustments: Reduced to 10% for high-volume Stars (50+ bookings/year) to incentivize loyalty; optional 2% add-on for premium features (e.g., priority in AI curation).</li>
</ul>
<p class="mb-2"><strong>Star Payout</strong></p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>Base Payout: 83% of booking value (after Flightsnapp's commission and ~2-3% payment processing fees via Stripe).</li>
    <li>Performance Incentives: +2% for 90%+ 5-star ratings; +1% for successful referrals.</li>
    <li>Maximum Cap: Payouts not to exceed 85% to maintain platform sustainability.</li>
</ul>
<p class="mb-2"><strong>Additional Fees</strong></p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>Premium Subscription: Optional $19.99/month for enhanced visibility (e.g., featured in random spins or group packages).</li>
    <li>Transparency: No hidden fees; Stars receive detailed breakdowns pre-payout.</li>
</ul>
<p class="mb-2"><strong>Example Calculation</strong><br>For a $500 snap (stay + experiences):</p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>Total: $500</li>
    <li>Flightsnapp Commission (12%): $60</li>
    <li>Processing (~3%): $15</li>
    <li>Star Payout (83% net): $415</li>
    <li>Scalability: At 1,000 bookings/month, generates $60,000 in platform revenue.</li>
</ul>

<h3 class="text-xl font-semibold mb-2 text-cyan-400">3. Application and Operations</h3>
<p class="mb-2"><strong>Application Process</strong></p>
<p class="mb-4">Submission: Via Flightsnapp's website form, including property details, psych vibe alignment (Big 5 tags), photos/videos, availability, pricing, and references. Application is free; $50 one-time verification fee (waived for beta participants).<br>Review: Combination of manual assessment and AI scan (via Grok API) for uniqueness and fit; decisions within 7 days.</p>
<p class="mb-2"><strong>Operational Integration</strong></p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>Curator Feed: Approved listings integrate into Flightsnapp's hybrid system—rule-based for constraints (budget under $500 or unlimited, flexible dates within a week, layovers) and ML for personalization (e.g., matching high Extraversion to social experiences).</li>
    <li>Booking Flow: Users book via one-tap "Snaps"; payments handled with Stripe and Afterpay for flexibility.</li>
    <li>Payouts: Automated via Stripe Connect post-booking; 7-day hold for refunds/cancellations. Stars responsible for taxes; Flightsnapp provides 1099 forms.</li>
</ul>
<p class="mb-2"><strong>Legal Terms</strong></p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>Liability: Flightsnapp is not liable for disputes, damages, or listing inaccuracies. Stars indemnify Flightsnapp against claims related to their offerings. Liability capped at booking value.</li>
    <li>Data Usage: Stars grant a non-exclusive license for anonymized data (e.g., trends) to improve curation and enable B2B insights. Compliant with GDPR/CCPA; no personal data shared without consent.</li>
    <li>Intellectual Property: Stars retain ownership; grant Flightsnapp a perpetual, royalty-free license for promotional use (e.g., on platform/social media). No infringing content permitted.</li>
    <li>Termination: 30 days' notice by either party; immediate for violations (e.g., low ratings or breaches).</li>
    <li>Dispute Resolution: Binding arbitration per ADRIC rules in Alberta, Canada.</li>
    <li>Governing Law: Alberta, Canada; includes force majeure provisions.</li>
</ul>

<h3 class="text-xl font-semibold mb-2 text-cyan-400">4. Growth and Scalability for Stars</h3>
<p class="mb-4">Targets: Aim for 500 active Stars by Q1 2026 MVP launch; 20% conversion from snaps to bookings to drive mutual growth.<br>Growth Drivers: Referral bonuses ($50 per recruit); integration with Flightsnapp+ subs ($9.99/month) and beta access ($5 one-time) for enhanced visibility and viral marketing (TikTok ads, influencer collabs, gamification badges).<br>Risk Management: Diversified revenue from affiliates and data insights ensures sustainable partnerships; 15% buffer for market fluctuations.</p>
<p class="mb-4">By signing this Agreement, Stars acknowledge understanding and acceptance of all terms. For questions, contact support@flightsnapp.com. Let's create magical, persona-driven escapes together! 🚀</p>
`;

export const MOCK_VAYCOVERS_DATA: Vaycover[] = [
    {
        id: 'vaycover-1',
        isSpotlight: true,
        title: 'Patagonia Trailblazer Takeover',
        destination: 'Patagonia, Chile',
        dates: 'March 10-20, 2026',
        price_range: '$1,800 - $2,200',
        hero_image: 'https://picsum.photos/seed/patagonia/800/600',
        dominant_personas: ['The Wild Trailblazer', 'The Adventure Architect'],
        ideal_weights: calculateIdealWeights(['The Wild Trailblazer', 'The Adventure Architect']),
        squad_progress: 18,
        squad_goal: 30,
        reward_tiers: [
            { member_count: 15, reward: 'Private Welcome Dinner', unlocked: true },
            { member_count: 25, reward: 'Guided Glacier Hike', unlocked: false },
            { member_count: 30, reward: 'Celebratory Farewell Fiesta', unlocked: false }
        ],
        description: 'An epic 10-day trek through the heart of Patagonia. This Vaycover is for those who crave raw nature, challenging hikes, and disconnecting from the grid. We\'re taking over a series of exclusive eco-lodges.',
        itinerary: [
            { day: 1, title: "Arrival & Welcome", description: "Arrive in Punta Arenas, meet the squad, and enjoy a private welcome dinner." },
            { day: 2-4, title: "Torres del Paine W-Trek", description: "Begin the iconic W-Trek, witnessing stunning glaciers and mountainscapes." },
            { day: 5, title: "Rest & Recharge", description: "A day of relaxation at our eco-lodge, with optional yoga sessions." },
            { day: 6-8, title: "Glacier Grey Exploration", description: "Kayak among icebergs and hike to breathtaking viewpoints of the Grey Glacier." },
            { day: 9, title: "Farewell Fiesta", description: "Conclude the trek and celebrate with a farewell party if the squad goal is met." },
            { day: 10, title: "Departure", description: "Depart from Punta Arenas with unforgettable memories." }
        ],
        lodging_info: "Accommodation will be in a series of exclusive, sustainable eco-lodges along the trekking route, offering comfort in the heart of the wilderness."
    },
    {
        id: 'vaycover-2',
        isSpotlight: false,
        title: 'Tokyo Culture Chaser Convergence',
        destination: 'Tokyo, Japan',
        dates: 'April 5-12, 2026',
        price_range: '$2,000 - $2,500',
        hero_image: 'https://picsum.photos/seed/tokyo/800/600',
        dominant_personas: ['The Culture Chaser', 'The Solo Dreamer'],
        ideal_weights: calculateIdealWeights(['The Culture Chaser', 'The Solo Dreamer']),
        squad_progress: 9,
        squad_goal: 20,
        reward_tiers: [
            { member_count: 10, reward: 'Ghibli Museum Tickets', unlocked: false },
            { member_count: 15, reward: 'Private Sushi Making Class', unlocked: false },
            { member_count: 20, reward: 'Day Trip to Hakone', unlocked: false }
        ],
        description: 'Immerse yourself in the vibrant tapestry of Tokyo. From ancient temples to neon-lit skyscrapers, this trip is a deep dive into Japanese art, food, and culture. Perfect for curious, introspective travelers.',
        itinerary: [
            { day: 1, title: "Arrival in Shinjuku", description: "Settle into our boutique hotel and explore the vibrant Shinjuku Gyoen National Garden." },
            { day: 2, title: "Art & Tech", description: "Visit the teamLab Borderless digital art museum and explore the tech hub of Akihabara." },
            { day: 3, title: "Tradition in Asakusa", description: "Explore the historic Senso-ji Temple and Nakamise-dori market." },
            { day: 4, title: "Youth Culture", description: "Dive into the fashion and energy of Harajuku's Takeshita Street and the Shibuya Crossing." },
            { day: 5, title: "Free Day", description: "A day for personal exploration, with optional Ghibli Museum visit if unlocked." },
            { day: 6, title: "Culinary Deep Dive", description: "Explore the Tsukiji Outer Market followed by a sushi making class (if unlocked)." },
            { day: 7, title: "Farewell", description: "Enjoy a final group dinner in a traditional izakaya." },
            { day: 8, title: "Departure", description: "Depart from Narita or Haneda airport." }
        ],
        lodging_info: "We'll be staying at a stylish boutique hotel in the heart of Shinjuku, providing a calm oasis with easy access to the city's best attractions."
    },
    {
        id: 'vaycover-3',
        isSpotlight: false,
        title: 'The Ibiza Party Pathfinder Escape',
        destination: 'Ibiza, Spain',
        dates: 'July 20-27, 2026',
        price_range: '$1,500 - $1,900',
        hero_image: 'https://picsum.photos/seed/ibiza/800/600',
        dominant_personas: ['The Party Pathfinder', 'The Impulsive Influencer'],
        ideal_weights: calculateIdealWeights(['The Party Pathfinder', 'The Impulsive Influencer']),
        squad_progress: 28,
        squad_goal: 40,
        reward_tiers: [
            { member_count: 25, reward: 'VIP Club Access', unlocked: true },
            { member_count: 35, reward: 'Private Catamaran Party', unlocked: false },
            { member_count: 40, reward: 'Closing Party DJ Set', unlocked: false }
        ],
        description: 'Experience the world\'s most iconic party island. This Vaycover is all about sun, sea, and sound. We\'ve secured a private villa and access to the best clubs for a week of non-stop energy.',
        itinerary: [
            { day: 1, title: "Villa Welcome Party", description: "Arrive at our private villa, meet the squad, and kick things off with a sunset pool party." },
            { day: 2, title: "Beach Club Bliss", description: "Relax and vibe at one of Ibiza's famous beach clubs with reserved beds." },
            { day: 3, title: "Pacha & VIP", description: "Experience the legendary Pacha nightclub with VIP access (unlocked)." },
            { day: 4, title: "Formentera Day Trip", description: "Escape to the pristine beaches of Formentera on a private boat." },
            { day: 5, title: "Free Day & Exploration", description: "Explore Ibiza Town's Dalt Vila or discover a hidden cove." },
            { day: 6, title: "Ushuaïa Experience", description: "Attend a world-famous open-air party at Ushuaïa." },
            { day: 7, title: "Sunset & Farewell", description: "Watch the iconic Ibiza sunset at a cliffside bar for our farewell gathering." },
            { day: 8, title: "Departure", description: "Depart from Ibiza Airport." }
        ],
        lodging_info: "A stunning, private villa takeover near Ibiza Town, featuring a pool, outdoor lounge areas, and plenty of space for the squad to connect and recharge."
    }
];

export const BADGE_DATA: Badge[] = [
    { name: "Vaycover Pioneer", description: "Joined your first Snapp Squad Vaycover. Welcome to the new way to travel!", icon: "🚀" },
    { name: "Trailblazer Certified", description: "Completed a Vaycover aligned with The Wild Trailblazer persona. You've truly walked the untrodden path.", icon: "🧭" },
    { name: "Squad Recruiter", description: "Successfully invited a friend who joined a Vaycover. You're a true connector!", icon: "🤝" },
    { name: "Globetrotter", description: "You've been on 3+ Vaycovers. The world is your playground.", icon: "🌍" },
    { name: "Party Captain", description: "Joined a Vaycover with a Party Pathfinder vibe. You know how to bring the energy.", icon: "🎉" },
    { name: "Zen Master", description: "Embarked on a Zen Seeker Vaycover. Your inner peace is palpable.", icon: "🧘" }
];
