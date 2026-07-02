import { FileUpload } from "@arkyn/components/fileUpload";

export default function FileUploadRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<FileUpload
					name="file1"
					action="/api/upload"
					label="Document:"
					showAsterisk
				/>
				<FileUpload name="file2" action="/api/upload" />
			</div>

			<div className="exampleContainer row foreground">
				<FileUpload
					name="file3"
					action="/api/upload"
					acceptFile=".pdf"
					label="PDF only:"
					selectFileButtonText="Choose PDF"
				/>
				<FileUpload
					name="file4"
					action="/api/upload"
					disabled
					label="Disabled:"
				/>
			</div>

			<div className="exampleContainer row">
				<FileUpload name="file5" action="/api/upload" label="Document:" />
			</div>
		</>
	);
}
