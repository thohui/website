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

export function Socials() {
	return (
			<Card className="dark:bg-gray-800 shadow-md col-auto row-span-1">
				<CardContent className='flex flex-row gap-3 items-center'>
					<img src={githubIcon} alt="GitHub" className="w-8 h-8" />
					<img src={linkedinIcon} alt="LinkedIn" className="w-8 h-8" />
				</CardContent>
			</Card>
	)
}