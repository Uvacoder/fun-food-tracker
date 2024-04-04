"use client";
import { useContext } from "react";
import { Moon, Sun, Monitor } from "react-feather";
import Image from "next/image";
import { UserContext } from "@/components/UserProvider";
import { ThemeContext } from "@/components/ThemeProvider";

import Link from "./Link";

export default function Nav() {
	const { user, isLoading } = useContext(UserContext);

	const modes = ["dark", "light", "system"];

	const { mode, toggleMode } = useContext(ThemeContext);

	return (
		<>
			<nav className="mb-16 flex items-center justify-between">
				<Link href="/">
					<div className="flex items-center gap-2">
						<div
							className={`${
								mode === "light" ? "brightness-75" : "brightness-125"
							} -ml-2`}
						>
							<Image
								src="/icon-earthy.png"
								alt="app logo"
								height="28"
								width="28"
							/>
						</div>
						<h1 className="text-xl font-semibold tracking-tighter">
							Herbivorous
						</h1>
					</div>
				</Link>
				<div className="flex flex-row items-center gap-4">
					{!isLoading && (
						<Link href={user ? "/user" : "/signin"}>
							{user?.displayName
								? user?.displayName
								: user
									? "Signed in"
									: "Not signed in"}
						</Link>
					)}
					<button
						aria-label={`set mode to ${mode === "dark" ? "light" : mode === "light" ? "system" : "dark"}`}
						onClick={toggleMode}
						className="-m-1 rounded-sm p-1 hover:text-f-high"
					>
						{mode === "dark" ? (
							<Moon size={20} />
						) : mode === "light" ? (
							<Sun size={20} />
						) : (
							<Monitor size={20} />
						)}
					</button>
				</div>
			</nav>
		</>
	);
}
