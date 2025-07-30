
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";



export function Sidemenu() {
	return (
		<Card className="row-span-2">
			<CardHeader>
				<CardTitle>Sidemenu</CardTitle>
				<CardDescription>Navigation links and actions</CardDescription>
			</CardHeader>
			<CardContent>
				<ul className="space-y-2">
					<li><a href="/blog">Blog</a></li>
					<li><a href="/contact">Contact</a></li>
				</ul>
			</CardContent>
		</Card>
		)
}