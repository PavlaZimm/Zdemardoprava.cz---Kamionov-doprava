import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    })

    return orderId
  },
})

export const list = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status))
        .order("desc")
        .collect()
    }
    return await ctx.db
      .query("orders")
      .withIndex("by_creation_time")
      .order("desc")
      .collect()
  },
})

export const get = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status })
  },
})
