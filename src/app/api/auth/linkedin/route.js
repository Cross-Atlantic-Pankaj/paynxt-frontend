import { NextResponse } from "next/server";
import axios from "axios";
import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Authorization code is missing" }, { status: 400 });
  }

  return handleLinkedInAuth(code);
}

async function handleLinkedInAuth(code) {
  try {
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return NextResponse.json({ error: "No access token received from LinkedIn" }, { status: 400 });
    }

    const userInfoRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const { sub: linkedinId, given_name: Firstname, family_name: Lastname, email } = userInfoRes.data;

    if (!email || !linkedinId) {
      return NextResponse.json({ error: "Incomplete LinkedIn data" }, { status: 400 });
    }

    await connectDB();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        Firstname: Firstname || "LinkedIn",
        Lastname: Lastname || "User",
        email,
        linkedinId,
        phoneNumber: `linkedin_${linkedinId}`,
        termsAccepted: true,
        isVerified: true
      });

      await user.save();
      console.log("✅ New user created via LinkedIn:", user);
    } else {
      if (!user.linkedinId) {
        user.linkedinId = linkedinId;
        await user.save();
      }
      console.log("✅ Existing LinkedIn user:", user);
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const redirectUrl = new URL(process.env.NEXT_PUBLIC_APP_HOME_URL || "http://localhost:3000/dashboard");
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("user", encodeURIComponent(JSON.stringify({
      id: user._id,
      Firstname: user.Firstname,
      Lastname: user.Lastname,
      email: user.email
    })));

    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error("❌ LinkedIn login error:", error?.response?.data || error.message);
    return NextResponse.json({ error: "Failed to authenticate with LinkedIn" }, { status: 500 });
  }
}