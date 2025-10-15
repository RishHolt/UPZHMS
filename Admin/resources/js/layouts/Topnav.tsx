import { Menu, Moon, Bell } from "lucide-react"
import { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Topnav = ({ onToggleSidebar }: HeaderProps) => {
	const [date, setDate] = useState(new Date());
	const { url } = usePage();
	const pathnames = url.split("/").filter(x => x);

	useEffect(() => {
		const timer = setInterval(() => {
			setDate(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const formattedDate = date.toLocaleDateString(undefined, {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	const formattedTime = date.toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	});

	return (
		<>
			<div className="flex flex-row items-center space-x-6 bg-background px-6 border-accent border-b-2 w-full min-h-18">
				<button 
					onClick={() => {
						console.log('Button clicked in Topnav');
						onToggleSidebar();
					}} 
					className="group hover:bg-secondary hover:shadow-md p-2 rounded-md transition cursor-pointer"
					aria-label="Toggle sidebar"
				>
					<Menu className="text-secondary group-hover:text-background" />
				</button>
				<div className="flex flex-col">
					<h1 className="font-bold text-primary text-lg">Urban Planning, Zoning & Housing</h1>
					<nav aria-label="Breadcrumb" className="text-secondary text-sm">
						<ol className="flex items-center space-x-1">
							<Link href="/" className="hover:underline">Home</Link>
							{pathnames.map((name, idx) => {
								const routeTo = "/" + pathnames.slice(0, idx + 1).join("/");
								return (
									<span key={routeTo} className="flex items-center">
										<span className="mx-1">/</span>
										{idx === pathnames.length - 1 ? (
											<span className="font-semibold">{decodeURIComponent(name.replace(/-/g, " "))}</span>
										) : (
											<Link href={routeTo} className="hover:underline">{decodeURIComponent(name.replace(/-/g, " "))}</Link>
										)}
									</span>
								);
							})}
						</ol>
					</nav>
				</div>
				<div className="flex flex-1 justify-end items-center space-x-4">
					<div className="flex flex-row space-x-2 font-bold text-secondary">
						<span>{formattedDate}</span>
						<span>{formattedTime}</span>
					</div>
					<div className="bg-secondary/25 hover:bg-secondary hover:shadow-md p-2 rounded-md transition cursor-pointer">
						<Bell className="text-secondary hover:text-background" />
					</div>
					<div className="bg-secondary/25 hover:bg-secondary hover:shadow-md p-2 rounded-md transition cursor-pointer">
						<Moon className="text-secondary hover:text-background" />
					</div>
				</div>
			</div>
		</>
	);
}

export default Topnav;
