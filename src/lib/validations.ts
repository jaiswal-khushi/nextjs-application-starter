import { z } from 'zod'
import { City, PropertyType, BHK, Purpose, Timeline, Source, Status } from '@/types/buyer'

const cityValues = Object.values(City) as [string, ...string[]]
const propertyTypeValues = Object.values(PropertyType) as [string, ...string[]]
const bhkValues = Object.values(BHK) as [string, ...string[]]
const purposeValues = Object.values(Purpose) as [string, ...string[]]
const timelineValues = Object.values(Timeline) as [string, ...string[]]
const sourceValues = Object.values(Source) as [string, ...string[]]
const statusValues = Object.values(Status) as [string, ...string[]]

const buyerBaseSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  city: z.enum(cityValues, { required_error: 'City is required' }),
  propertyType: z.enum(propertyTypeValues, { required_error: 'Property type is required' }),
  bhk: z.enum(bhkValues).optional(),
  purpose: z.enum(purposeValues, { required_error: 'Purpose is required' }),
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  timeline: z.enum(timelineValues, { required_error: 'Timeline is required' }),
  source: z.enum(sourceValues, { required_error: 'Source is required' }),
  status: z.enum(statusValues).default(Status.New),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

export const buyerSchema = buyerBaseSchema.refine((data) => {
  if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
    return data.budgetMax >= data.budgetMin
  }
  return true
}, {
  message: 'Budget max must be greater than or equal to budget min',
  path: ['budgetMax'],
}).refine((data) => {
  if (data.propertyType === PropertyType.Apartment || data.propertyType === PropertyType.Villa) {
    return data.bhk !== undefined
  }
  return true
}, {
  message: 'BHK is required for Apartment or Villa',
  path: ['bhk'],
})

export const buyerUpdateSchema = buyerBaseSchema.partial()

export const csvRowSchema = buyerBaseSchema.omit({ tags: true }).extend({
  tags: z.string().optional(),
})

export type BuyerInput = z.infer<typeof buyerSchema>
export type BuyerUpdateInput = z.infer<typeof buyerUpdateSchema>
export type CsvRowInput = z.infer<typeof csvRowSchema>
