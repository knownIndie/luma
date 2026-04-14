import { currentUser } from "@clerk/nextjs/server";

export async function requireCurrentUser() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
