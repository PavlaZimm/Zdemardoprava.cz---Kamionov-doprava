import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,
  orders: defineTable({
    fromLocation: v.string(),
    toLocation: v.string(),
    fromCoordinates: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    toCoordinates: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    distance: v.optional(v.number()),
    cargoType: v.optional(v.string()),
    vehicleType: v.optional(v.string()),
    fullTruckType: v.optional(v.string()),
    pickupDate: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    companyName: v.optional(v.string()),
    phone: v.string(),
    email: v.string(),
    address: v.optional(v.string()),
    finalPrice: v.optional(v.number()),
    finalPriceWithVAT: v.optional(v.number()),
    status: v.optional(v.string()), // "new", "contacted", "in_progress", "completed", "cancelled"
    createdAt: v.number(),
  })
    .index("by_creation_time", ["createdAt"])
    .index("by_status", ["status"]),
})
