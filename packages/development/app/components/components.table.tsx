import { TableBody } from "@arkyn/components/tableBody";
import { TableCaption } from "@arkyn/components/tableCaption";
import { TableContainer } from "@arkyn/components/tableContainer";
import { TableFooter } from "@arkyn/components/tableFooter";
import { TableHeader } from "@arkyn/components/tableHeader";

const users = [
	{ id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
	{ id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor" },
	{ id: 3, name: "Carol White", email: "carol@example.com", role: "Viewer" },
];

export default function TableRoute() {
	return (
		<>
			<div className="exampleContainer foreground">
				<TableContainer>
					<TableCaption>Users</TableCaption>
					<TableHeader>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<tr key={user.id}>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>{user.role}</td>
							</tr>
						))}
					</TableBody>
					<TableFooter>3 users found</TableFooter>
				</TableContainer>
			</div>

			<div className="exampleContainer foreground">
				<TableContainer>
					<TableCaption>Empty State</TableCaption>
					<TableHeader>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
					</TableHeader>
					<TableBody emptyMessage="No users found." />
				</TableContainer>
			</div>

			<div className="exampleContainer">
				<TableContainer>
					<TableCaption>Dark mode</TableCaption>
					<TableHeader>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<tr key={user.id}>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>{user.role}</td>
							</tr>
						))}
					</TableBody>
				</TableContainer>
			</div>
		</>
	);
}
