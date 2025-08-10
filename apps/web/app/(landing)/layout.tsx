import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { type ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
};

export default layout;
