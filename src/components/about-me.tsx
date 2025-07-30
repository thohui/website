import githubIcon from "@/assets/github.svg?react";
import linkedinIcon from "@/assets/linkedin.svg?react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

export function AboutMe() {
	return (
			<Card className="dark:bg-gray-800 shadow-md row-span-3 col-span-5">
				<CardHeader>
					<CardTitle>About me</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						my name is thomas and I am a software developer with a passion for creating innovative solutions. I have experience in various programming languages and frameworks, and I enjoy working on both front-end and back-end development. In my free time, I love to explore new technologies and contribute to open-source projects.
					</p>
				</CardContent>
			</Card>
	)
}