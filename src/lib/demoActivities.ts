/**
 * Demo activities for instant page display
 * These are shown immediately while real data loads from the database
 */

export const getDemoActivitiesByType = (type: string, language: string) => {
  const demos: { [key: string]: any[] } = {
    youth: [
      {
        id: "demo-youth-1",
        item_name: language === "en" ? "Leadership Workshop" : "Punëtori e Lidershipit",
        activity_type: "youth",
        description: language === "en" 
          ? "Develop leadership skills and learn from industry experts" 
          : "Zhvillo aftësitë e lidershipit dhe mëso nga ekspertët e industrisë",
        date: language === "en" ? "March 15, 2026" : "15 Mars 2026",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        language: language,
      },
      {
        id: "demo-youth-2",
        item_name: language === "en" ? "Career Development" : "Zhvillimi i Karrierës",
        activity_type: "youth",
        description: language === "en"
          ? "Plan your future and explore career opportunities"
          : "Planifiko të ardhmen tënde dhe eksploro mundësitë e karrierës",
        date: language === "en" ? "March 20, 2026" : "20 Mars 2026",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        language: language,
      },
    ],
    arts: [
      {
        id: "demo-arts-1",
        item_name: language === "en" ? "Painting Masterclass" : "Masterclass Pikture",
        activity_type: "arts",
        description: language === "en"
          ? "Learn advanced painting techniques with professional artists"
          : "Mëso teknika të avancuara të pikturës me artistë profesionistë",
        date: language === "en" ? "March 10, 2026" : "10 Mars 2026",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        language: language,
      },
      {
        id: "demo-arts-2",
        item_name: language === "en" ? "Sculpture Workshop" : "Punëtori Skulpture",
        activity_type: "arts",
        description: language === "en"
          ? "Create stunning sculptures using traditional and modern methods"
          : "Krijo skulptura të mahnitshme duke përdorur metoda tradicionale dhe moderne",
        date: language === "en" ? "March 18, 2026" : "18 Mars 2026",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        language: language,
      },
    ],
    culture: [
      {
        id: "demo-culture-1",
        item_name: language === "en" ? "Heritage Exhibition" : "Ekspozita Trashëgimie",
        activity_type: "culture",
        description: language === "en"
          ? "Discover the rich cultural heritage of our community"
          : "Zbulo trashëgiminë e pasur kulturore të komunitetit tonë",
        date: language === "en" ? "March 22, 2026" : "22 Mars 2026",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        language: language,
      },
      {
        id: "demo-culture-2",
        item_name: language === "en" ? "Traditional Music Night" : "Nata e Muzikës Tradicionale",
        activity_type: "culture",
        description: language === "en"
          ? "Experience authentic traditional music and dance performances"
          : "Përjetoje performanca të muzikës dhe vallzimit tradicional autentik",
        date: language === "en" ? "March 25, 2026" : "25 Mars 2026",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        language: language,
      },
    ],
    sports: [
      {
        id: "demo-sports-1",
        item_name: language === "en" ? "Football Camp" : "Kampi i Futbollit",
        activity_type: "sports",
        description: language === "en"
          ? "Join our intensive football training program with professional coaches"
          : "Bashkohuni me programin tonë të intensiv të trajnimit të futbollit me trajnerë profesionistë",
        date: language === "en" ? "March 12, 2026" : "12 Mars 2026",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        language: language,
      },
      {
        id: "demo-sports-2",
        item_name: language === "en" ? "Basketball Tournament" : "Turnimi i Basketbollit",
        activity_type: "sports",
        description: language === "en"
          ? "Compete in our exciting basketball tournament and win prizes"
          : "Kompetito në turnirin ynë të emocionshëm të basketbollit dhe fito çmime",
        date: language === "en" ? "March 28, 2026" : "28 Mars 2026",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        language: language,
      },
    ],
    exhibition: [
      {
        id: "demo-exhibition-1",
        item_name: language === "en" ? "Modern Art Exhibition" : "Ekspozita e Artit Modern",
        activity_type: "exhibition",
        description: language === "en"
          ? "Explore cutting-edge contemporary art from emerging artists"
          : "Eksploro artin kontemporer të nivelit të lartë të artistëve në rritje",
        date: language === "en" ? "March 16, 2026" : "16 Mars 2026",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        language: language,
      },
      {
        id: "demo-exhibition-2",
        item_name: language === "en" ? "Photography Showcase" : "Shfaqja e Fotografisë",
        activity_type: "exhibition",
        description: language === "en"
          ? "Witness stunning photography from award-winning photographers"
          : "Dëshmeto fotografinë mahnitëse të fotografëve të fituesve të çmimeve",
        date: language === "en" ? "March 30, 2026" : "30 Mars 2026",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        language: language,
      },
    ],
    volunteering: [
      {
        id: "demo-volunteering-1",
        item_name: language === "en" ? "Community Cleanup" : "Pastrimi i Komunitetit",
        activity_type: "volunteering",
        description: language === "en"
          ? "Help us make our community cleaner and more beautiful"
          : "Ndihmo ne ta bëjmë komunitetin tonë më të pastër dhe më të bukur",
        date: language === "en" ? "March 14, 2026" : "14 Mars 2026",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        language: language,
      },
      {
        id: "demo-volunteering-2",
        item_name: language === "en" ? "Youth Mentorship" : "Mentorimi i Të Rinjve",
        activity_type: "volunteering",
        description: language === "en"
          ? "Mentor young people and make a lasting impact on their lives"
          : "Mentoro të rinjtë dhe bëj një ndikim të përjetshëm në jetën e tyre",
        date: language === "en" ? "March 24, 2026" : "24 Mars 2026",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        language: language,
      },
    ],
  };

  return demos[type] || [];
};
