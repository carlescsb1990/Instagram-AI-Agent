import mongoose, { Document, Schema } from "mongoose";

export interface IInstagramAccount {
  username: string;
  password: string;
  isActive: boolean;
  cookies?: any[];
  lastActivity?: Date;
  stats: {
    followers: number;
    following: number;
    posts: number;
    engagement: number;
  };
  settings: {
    autoLike: boolean;
    autoComment: boolean;
    autoFollow: boolean;
    autoDM: boolean;
    maxLikesPerHour: number;
    maxCommentsPerHour: number;
    maxFollowsPerHour: number;
    targetHashtags: string[];
    blacklistedUsers: string[];
  };
}

export interface IUser extends Document {
  name: string;
  email: string;
  role: "admin" | "user";
  instagramAccounts: IInstagramAccount[];
  subscription: {
    plan: "free" | "basic" | "premium" | "enterprise";
    expiresAt: Date;
    accountsLimit: number;
  };
  settings: {
    aiCharacter: string;
    defaultHashtags: string[];
    contentStyle: string;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const InstagramAccountSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  cookies: [Schema.Types.Mixed],
  lastActivity: { type: Date, default: Date.now },
  stats: {
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    posts: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
  },
  settings: {
    autoLike: { type: Boolean, default: true },
    autoComment: { type: Boolean, default: true },
    autoFollow: { type: Boolean, default: false },
    autoDM: { type: Boolean, default: false },
    maxLikesPerHour: { type: Number, default: 60 },
    maxCommentsPerHour: { type: Number, default: 30 },
    maxFollowsPerHour: { type: Number, default: 20 },
    targetHashtags: [String],
    blacklistedUsers: [String],
  },
});

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    instagramAccounts: [InstagramAccountSchema],
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium", "enterprise"],
        default: "free",
      },
      expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      accountsLimit: { type: Number, default: 1 },
    },
    settings: {
      aiCharacter: { type: String, default: "ArcanEdge.System.Agent" },
      defaultHashtags: [String],
      contentStyle: { type: String, default: "professional" },
      language: { type: String, default: "es" },
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", UserSchema);
