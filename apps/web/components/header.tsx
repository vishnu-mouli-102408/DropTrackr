"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "@repo/ui/components/button";
import Icons from "@repo/ui/global/icons";
import { motion } from "motion/react";

const menuItems = [
	{ name: "Home", href: "/" },
	{ name: "Features", href: "#features" },
	{ name: "Contact", href: "#footer" },
];

export const Header = () => {
	const [menuState, setMenuState] = React.useState(false);
	const [isScrolled, setIsScrolled] = React.useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			setIsScrolled(scrollTop > 0);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header>
			<nav
				data-state={menuState && "active"}
				className={`fixed z-20 w-full backdrop-blur-3xl transition-all duration-300 ${isScrolled ? "border-b" : ""}`}
			>
				<div className="mx-auto max-w-6xl px-6 transition-all duration-300">
					<div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
						{/* Logo */}
						<Link href="/" aria-label="home" className="flex items-center space-x-2">
							<motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
								<div className="relative">
									<Icons.logo className="size-10" />
								</div>
								<span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
									Image Craft
								</span>
							</motion.div>
						</Link>

						{/* Mobile Menu Button */}
						<button
							onClick={() => setMenuState(!menuState)}
							aria-label={menuState == true ? "Close Menu" : "Open Menu"}
							className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
						>
							<Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
							<X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
						</button>

						{/* Desktop Menu - Centered */}
						<div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
							<ul className="flex gap-8 text-sm">
								{menuItems.map((item, index) => (
									<li key={index}>
										<Link
											href={item.href}
											className="text-muted-foreground font-medium hover:text-accent-foreground block duration-150"
										>
											<span>{item.name}</span>
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
							<div className="lg:hidden">
								<ul className="space-y-6 text-base">
									{menuItems.map((item, index) => (
										<li key={index}>
											<Link
												href={item.href}
												className="text-muted-foreground font-medium hover:text-accent-foreground block duration-150"
											>
												<span>{item.name}</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
								<Button asChild size="sm">
									<Link href="/sign-in">
										<span>Sign In</span>
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};
