"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { auth, getAuthErrorFromCode } from "@/utils/firebase-auth";
import { UserContext } from "@/components/UserProvider";
import Button from "@/components/Button";
import UpdateUserForm from "./UpdateUserForm";
import text from "@/app/styles/text.module.css";
import message from "@/app/styles/message.module.css";

export default function User() {
	const { user, isLoading } = useContext(UserContext);
	const router = useRouter();

	const [statusMessage, setStatusMessage] = useState<string | null>(null);

	useEffect(() => {
		if (!user) {
			router.push("/signin");
		}
	}, [user]);

	if (!isLoading && user) {
		return (
			<>
				<div className="mb-16 flex flex-col items-center">
					{/* todo: maybe find alternative to url param / remove next image implementation*/}
					<div className="relative mb-4 h-20 w-20 overflow-hidden">
						{user.photoURL && (
							<Image
								loader={({ src }: { src: string }) => {
									return `${src}&w=auto`;
								}}
								src={user.photoURL}
								fill={true}
								sizes="80px"
								alt={`profile image for ${user.displayName}`}
								className="mb-4 h-20 w-20 rounded-full object-cover shadow-inner"
							/>
						)}
					</div>
					<h2 className={text.heading}>
						{user.displayName ? user.displayName : user.email}
					</h2>
				</div>
				<h3 className={text.heading}>Update profile</h3>
				<div className="mb-8">
					<UpdateUserForm />
				</div>
				<h3 className={text.heading}>Sign out</h3>
				{statusMessage && <p className={message.base}>{statusMessage}</p>}
				<Button
					onClick={() => {
						signOut(auth)
							.then(() => {
								console.log("signed out");
								// Signed out -- will push to "/signin"
							})
							.catch((error) => {
								setStatusMessage(getAuthErrorFromCode(error.code));
							});
					}}
				>
					Sign out
				</Button>
			</>
		);
	}
}
