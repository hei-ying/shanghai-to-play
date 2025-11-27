
export interface LocationItem {
  id: string;
  name: string;
  shortName?: string; // For display on the wheel if name is too long
  color: string;
  textColor: string;
  iconName: string; // Mapping to Lucide icons
  rating: number; // 1-5 stars
}

export interface TravelTip {
  description: string;
  proTip: string;
  attractions: string[];
}
