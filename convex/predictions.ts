import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to save a new prediction event
export const savePrediction = mutation({
    args: {
        userHash: v.string(),
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
        modelParams: v.object({
            beta: v.number(),
            moodBiasVal: v.number(),
        }),
        prediction: v.object({
            zScore: v.number(),
            probability: v.number(),
        }),
    },
    handler: async (ctx, args) => {
        const eventId = await ctx.db.insert("predictionEvents", {
            userHash: args.userHash,
            timestamp: new Date().toISOString(),
            inputs: args.inputs,
            modelParams: args.modelParams,
            prediction: args.prediction,
            outcome: undefined,
        });
        return eventId;
    },
});

// Mutation to record the outcome of a prediction
export const recordOutcome = mutation({
    args: {
        eventId: v.id("predictionEvents"),
        actionTaken: v.boolean(),
        timeDelta: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.eventId, {
            outcome: {
                verified: true,
                actionTaken: args.actionTaken,
                timeDelta: args.timeDelta,
            },
        });
    },
});

// Query to get all predictions for a user (for export/analysis)
export const getMyPredictions = query({
    args: {
        userHash: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("predictionEvents")
            .filter((q) => q.eq(q.field("userHash"), args.userHash))
            .order("desc")
            .collect();
    },
});

// Query to get all predictions (admin/research use)
export const getAllPredictions = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("predictionEvents").order("desc").collect();
    },
});
