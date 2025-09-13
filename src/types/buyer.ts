export type Buyer = {
  id: string
  fullName: string
  email?: string
  phone: string
  city: City
  propertyType: PropertyType
  bhk?: BHK
  purpose: Purpose
  budgetMin?: number
  budgetMax?: number
  timeline: Timeline
  source: Source
  status: Status
  notes?: string
  tags: string[]
  ownerId: string
  updatedAt: Date
}

export type BuyerHistory = {
  id: string
  buyerId: string
  changedBy: string
  changedAt: Date
  diff: Record<string, any>
}

export enum City {
  Chandigarh = 'Chandigarh',
  Mohali = 'Mohali',
  Zirakpur = 'Zirakpur',
  Panchkula = 'Panchkula',
  Other = 'Other',
}

export enum PropertyType {
  Apartment = 'Apartment',
  Villa = 'Villa',
  Plot = 'Plot',
  Office = 'Office',
  Retail = 'Retail',
}

export enum BHK {
  One = 'One',
  Two = 'Two',
  Three = 'Three',
  Four = 'Four',
  Studio = 'Studio',
}

export enum Purpose {
  Buy = 'Buy',
  Rent = 'Rent',
}

export enum Timeline {
  ZeroToThreeMonths = 'ZeroToThreeMonths',
  ThreeToSixMonths = 'ThreeToSixMonths',
  MoreThanSixMonths = 'MoreThanSixMonths',
  Exploring = 'Exploring',
}

export enum Source {
  Website = 'Website',
  Referral = 'Referral',
  WalkIn = 'WalkIn',
  Call = 'Call',
  Other = 'Other',
}

export enum Status {
  New = 'New',
  Qualified = 'Qualified',
  Contacted = 'Contacted',
  Visited = 'Visited',
  Negotiation = 'Negotiation',
  Converted = 'Converted',
  Dropped = 'Dropped',
}
