import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    predictionEvents: defineTable({
        // Anonymous user identifier (SHA-256 hash or UUID stored in localStorage)
        userHash: v.string(),
        // ISO timestamp
        timestamp: v.string(),
        // Input slider values
        inputs: v.object({
            urgency: v.number(),
            loot: v.number(),
            comfort: v.number(),
            why: v.number(),
            fog: v.number(),
            difficulty: v.number(),
            fear: v.number(),
            friction: v.number(),
            habit: v.number(),
            mood: v.union(v.literal("POSITIVE"), v.literal("NEUTRAL"), v.literal("DEPRESSED")),
        }),
        // Model constants at time of prediction
        modelParams: v.object({
            beta: v.number(),
            moodBiasVal: v.number(),
        }),
        // Prediction output
        prediction: v.object({
            zScore: v.number(),
            probability: v.number(),
        }),
        // Outcome (filled in later via follow-up)
        outcome: v.optional(v.object({
            verified: v.boolean(),
            actionTaken: v.boolean(),
            timeDelta: v.number(), // seconds
        })),
    }),
});
