import { redirect } from "next/navigation";

export default function RedirectToHomePage() {
	return redirect("/");
}
