import { Logout } from "@/components/logout";

const DashboardPage = async () => {
	const user = await fetch("http://localhost:8080/api/user", {
		method: "GET",
		credentials: "include",
	});
	const data = await user.json();
	console.log({ data });
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<Logout />
		</div>
	);
};

export default DashboardPage;
