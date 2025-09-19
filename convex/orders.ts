import { mutation, query, action, internalMutation, internalQuery, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Mutation to create a new order and schedule email notification
export const submitOrder = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      fromLocation: args.fromLocation,
      toLocation: args.toLocation,
      distance: args.distance,
      duration: args.duration,
      cargoType: args.cargoType,
      vehicleType: args.vehicleType,
      fullTruckType: args.fullTruckType,
      pickupDate: args.pickupDate,
      firstName: args.firstName,
      lastName: args.lastName,
      companyName: args.companyName,
      phone: args.phone,
      email: args.email,
      address: args.address,
      finalPrice: args.finalPrice,
      createdAt: Date.now(),
      status: "pending",
    });

    console.log("New order created:", orderId);

    // Schedule the email notification action to run immediately after this transaction
    await ctx.scheduler.runAfter(0, internal.orders.sendOrderNotificationEmail, {
      orderId: orderId,
    });

    return orderId;
  },
});

// Internal action to send email notification
export const sendOrderNotificationEmail = internalAction({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    "use node";

    // Get the order details
    const order = await ctx.runQuery(internal.orders.getOrderDetails, {
      orderId: args.orderId,
    });

    if (!order) {
      console.error("Order not found:", args.orderId);
      return;
    }

    try {
      // Create detailed order summary
      const orderSummary = `
Nová objednávka kamionové dopravy:

ZÁKAZNÍK:
- Jméno: ${order.firstName} ${order.lastName}
- Email: ${order.email}
- Telefon: ${order.phone}
- Adresa: ${order.address}
${order.companyName ? `- Společnost: ${order.companyName}` : ''}

TRASA:
- Odkud: ${order.fromLocation}
- Kam: ${order.toLocation}
${order.distance ? `- Vzdálenost: ${order.distance} km` : ''}
${order.duration ? `- Doba jízdy: ${order.duration}` : ''}

SLUŽBA:
${order.cargoType ? `- Typ nákladu: ${order.cargoType}` : ''}
${order.vehicleType ? `- Typ vozidla: ${order.vehicleType}` : ''}
${order.fullTruckType ? `- Vybrané auto: ${order.fullTruckType}` : ''}
${order.pickupDate ? `- Termín nakládky: ${new Date(order.pickupDate).toLocaleString('cs-CZ')}` : ''}

CENA: ${order.finalPrice.toLocaleString('cs-CZ')} Kč

Objednávka byla vytvořena: ${new Date(order.createdAt).toLocaleString('cs-CZ')}
      `.trim();

      // Get recipient emails (comma-separated) and send to each
      const recipientEmails = process.env.RECIPIENT_EMAIL!.split(',').map(email => email.trim());
      let allEmailsSent = true;

      for (const recipientEmail of recipientEmails) {
        const response = await fetch(process.env.EMAIL_NOTIFICATION_ENDPOINT!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toEmail: recipientEmail,
            subject: `Nová objednávka dopravy: ${order.fromLocation} → ${order.toLocation}`,
            message: orderSummary,
            chatId: process.env.CHAT_ID!,
            appName: process.env.APP_NAME!,
            secretKey: process.env.SECRET_KEY!,
          }),
        });

        if (response.ok) {
          console.log(`Email notification sent successfully to: ${recipientEmail}`);
        } else {
          console.error(`Failed to send email notification to ${recipientEmail}:`, response.status, response.statusText);
          allEmailsSent = false;
        }
      }

      if (allEmailsSent) {
        await ctx.runMutation(internal.orders.updateOrderStatus, {
          orderId: args.orderId,
          status: "sent",
        });
      } else {
        await ctx.runMutation(internal.orders.updateOrderStatus, {
          orderId: args.orderId,
          status: "failed",
        });
      }
    } catch (error) {
      console.error("Error sending email notification:", error);
      await ctx.runMutation(internal.orders.updateOrderStatus, {
        orderId: args.orderId,
        status: "failed",
      });
    }
  },
});

// Internal query to get order details
export const getOrderDetails = internalQuery({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

// Internal mutation to update order status
export const updateOrderStatus = internalMutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(v.literal("pending"), v.literal("sent"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
    });
  },
});

// Query to get all orders (for admin purposes)
export const getAllOrders = query({
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

// Query to get orders by status
export const getOrdersByStatus = query({
  args: {
    status: v.union(v.literal("pending"), v.literal("sent"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("status"), args.status))
      .order("desc")
      .collect();
  },
});
