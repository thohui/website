
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

export function ThemeSwitcher() {
	return  (
		<Card className='row-start-0 col-start-1'>
			{/** biome-ignore lint/a11y/useButtonType: <explanation> */}
<button>switch theme</button>
			</Card>
	)
}