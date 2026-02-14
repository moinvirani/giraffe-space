import { Hono } from "hono";
import { z } from "zod";
import {
  upsertUserProfile,
  getAllUserProfiles,
  getAnalyticsSummary,
  isSupabaseConfigured,
} from "../lib/supabase";

export const profileRouter = new Hono();

// Schema for profile sync request
const syncProfileSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"]).optional(),
  ageRange: z.enum(["18-24", "25-34", "35-44", "45-54", "55+"]).optional(),
  goals: z.array(z.string()).optional(),
  totalXP: z.number().optional(),
  level: z.number().optional(),
  completedExercises: z.number().optional(),
  streak: z.number().optional(),
  longestStreak: z.number().optional(),
});

// Sync user profile - creates or updates profile
profileRouter.post("/sync", async (c) => {
  try {
    if (!isSupabaseConfigured()) {
      console.log("[PROFILE] Supabase not configured, skipping sync");
      return c.json({ success: true, message: "Supabase not configured" });
    }

    const body = await c.req.json();
    const result = syncProfileSchema.safeParse(body);

    if (!result.success) {
      return c.json({ success: false, error: "Invalid data" }, 400);
    }

    const data = result.data;

    const { data: profile, error } = await upsertUserProfile({
      email: data.email,
      name: data.name,
      gender: data.gender,
      age_range: data.ageRange,
      goals: data.goals ? JSON.stringify(data.goals) : undefined,
      total_xp: data.totalXP,
      level: data.level,
      completed_exercises: data.completedExercises,
      streak: data.streak,
      longest_streak: data.longestStreak,
    });

    if (error) {
      console.error("[PROFILE] Error syncing to Supabase:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, profile: profile?.[0] });
  } catch (error) {
    console.error("[PROFILE] Error syncing profile:", error);
    return c.json({ success: false, error: "Failed to sync profile" }, 500);
  }
});

// Get analytics summary (for admin dashboard)
profileRouter.get("/analytics", async (c) => {
  try {
    if (!isSupabaseConfigured()) {
      return c.json({ error: "Supabase not configured" }, 503);
    }

    const analytics = await getAnalyticsSummary();

    return c.json({
      totalUsers: analytics.totalUsers,
      activeUsers: analytics.activeUsersLast7Days,
      genderDistribution: Object.entries(analytics.genderDistribution).map(([gender, count]) => ({
        gender: gender || "not-specified",
        count,
      })),
      ageDistribution: Object.entries(analytics.ageDistribution).map(([ageRange, count]) => ({
        ageRange: ageRange || "not-specified",
        count,
      })),
      averageStats: {
        xp: analytics.averageXP,
        level: analytics.averageLevel,
        streak: analytics.averageStreak,
      },
      topGoals: analytics.topGoals,
    });
  } catch (error) {
    console.error("[ANALYTICS] Error getting analytics:", error);
    return c.json({ error: "Failed to get analytics" }, 500);
  }
});

// Get all user profiles (for admin)
profileRouter.get("/users", async (c) => {
  try {
    if (!isSupabaseConfigured()) {
      return c.json({ error: "Supabase not configured" }, 503);
    }

    const { data: profiles, error } = await getAllUserProfiles();

    if (error) {
      console.error("[PROFILE] Error getting users:", error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({
      users: (profiles || []).slice(0, 100).map((p) => ({
        ...p,
        goals: p.goals ? JSON.parse(p.goals) : [],
      })),
    });
  } catch (error) {
    console.error("[PROFILE] Error getting users:", error);
    return c.json({ error: "Failed to get users" }, 500);
  }
});
