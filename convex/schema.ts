import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,
  orders: defineTable({
    fromLocation: v.string(),
    toLocation: v.string(),
    distance: v.optional(v.number()),
    duration: v.optional(v.string()),
    cargoType: v.optional(v.string()),
    vehicleType: v.optional(v.string()),
    fullTruckType: v.optional(v.string()),
    pickupDate: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    companyName: v.optional(v.string()),
    phone: v.string(),
    email: v.string(),
    address: v.string(),
    finalPrice: v.number(),
    createdAt: v.number(),
    status: v.optional(v.union(v.literal("pending"), v.literal("sent"), v.literal("failed"))),
  }),
})

