import { authOptions } from "./auth-config";
import { getServerSession } from "next-auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export { getServerSession } from "next-auth";
export { authOptions };
