import { ImageUpload } from "@arkyn/components/imageUpload";

export default function ImageUploadRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<ImageUpload name="img1" action="/api/upload" label="Avatar:" showAsterisk />
				<ImageUpload name="img2" action="/api/upload" />
			</div>

			<div className="exampleContainer row foreground">
				<ImageUpload name="img3" action="/api/upload" disabled label="Disabled:" />
				<ImageUpload
					name="img4"
					action="/api/upload"
					label="JPEG/PNG only:"
					acceptImage="image/jpeg,image/png"
				/>
			</div>

			<div className="exampleContainer row">
				<ImageUpload name="img5" action="/api/upload" label="Image:" />
			</div>
		</>
	);
}
