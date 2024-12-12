import dbConnect from "@/lib/database/dbConnect";
import User, { IUser } from "@/lib/database/models/user.model";
import { userType } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("email"); // Assumes `email` is passed as a query parameter

  if (!userEmail) {
    return new Response(JSON.stringify({ error: "Email query parameter is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await dbConnect();
    const user = await User.findOne<IUser>({ email: userEmail });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const parsedUser: userType = JSON.parse(JSON.stringify(user));
    return new Response(JSON.stringify({credits : parsedUser.creditBalance}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
