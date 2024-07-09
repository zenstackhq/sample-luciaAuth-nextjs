import { lucia, validateRequest } from "@/lib/auth";
import { Form } from "@/lib/form";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import type { ActionResult } from "@/lib/form";
import { getEnhancedPrisma } from "../lib/db";

export default async function Page() {
	const { user } = await validateRequest();

	if (!user) {
		return redirect("/login");
	}

	const db = await getEnhancedPrisma();

	const existingUsers = await db.user.findMany();
	return (
		<>
			<h1>Hi, {user.username}!</h1>
			<p>Your user ID is {user.id}.</p>
			<p>all existing users:</p>
			<ul>
				{existingUsers.map((user) => (
					<li key={user.id}>{user.userName}</li>
				))}
			</ul>
			<Form action={logout}>
				<button>Sign out</button>
			</Form>
		</>
	);
}

async function logout(): Promise<ActionResult> {
	"use server";
	const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized"
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/login");
}
