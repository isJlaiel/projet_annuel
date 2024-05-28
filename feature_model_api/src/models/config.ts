export default interface Config {
    days: string[];
    slots: string[];
    allowedslots: { allowedslot: any[] }[];
    formations: Formation[];
    departements: string[];
    repas: { $: any }[];
    'formation-departements': { nrDepartement: any[] }[];
    courses: { course: any[] }[];
    distributionWeeks: { distributionWeek: any[] }[];
    distributionHoraires: { distributionHoraire: any[] }[];
    distributionHorairesCourses: { distributionHorairesDepartement: any[] }[];
    classheadcount: { headcount: any[] }[];
    'part-type': string[];
    'part-composition': { composition: any[] }[];
    'formation-composition': { distribution: any[] }[];
    'departement-commun': { departement: any[] }[];
    'part-dimension': { part: any[] }[];
    'departement-composition': { departement: any[] }[];
    'formation-room': { allowedRooms: any[] }[];
    'departement-rooms': { departement: any[] }[];
    haveParent: string[];
    roomType: RoomType[];
    roomGetDepartement: string[];
    roomSize: { room: any[] }[];
    probaMultimedia: string[];
    MinEffectifAmphi: string[];
    teachers: string[];
    features: { feature: any[] }[];
  }
  
  interface Formation {
    _: string;
    $: any;
  }
  
  interface RoomType {
    _: string;
    $: any;
  }
  