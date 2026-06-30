import { AlertContainer } from "@arkyn/components/alertContainer";
import { AlertContent } from "@arkyn/components/alertContent";
import { AlertDescription } from "@arkyn/components/alertDescription";
import { AlertIcon } from "@arkyn/components/alertIcon";
import { AlertTitle } from "@arkyn/components/alertTitle";

export default function AlertRoute() {
	return (
		<div className="exampleContainer">
			<AlertContainer scheme="danger">
				<AlertIcon />
				<AlertContent>
					<AlertTitle>Title</AlertTitle>
					<AlertDescription>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
						qui aliquid rerum debitis aliquam. Enim alias earum esse consequatur
						obcaecati beatae fugiat eius mollitia odio, dolorum eum maiores, at
						aliquid.
					</AlertDescription>
				</AlertContent>
			</AlertContainer>

			<AlertContainer scheme="info">
				<AlertIcon />
				<AlertContent>
					<AlertTitle>Title</AlertTitle>
					<AlertDescription>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
						qui aliquid rerum debitis aliquam. Enim alias earum esse consequatur
						obcaecati beatae fugiat eius mollitia odio, dolorum eum maiores, at
						aliquid.
					</AlertDescription>
				</AlertContent>
			</AlertContainer>

			<AlertContainer scheme="success">
				<AlertIcon />
				<AlertContent>
					<AlertTitle>Title</AlertTitle>
					<AlertDescription>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
						qui aliquid rerum debitis aliquam. Enim alias earum esse consequatur
						obcaecati beatae fugiat eius mollitia odio, dolorum eum maiores, at
						aliquid.
					</AlertDescription>
				</AlertContent>
			</AlertContainer>

			<AlertContainer scheme="warning">
				<AlertIcon />
				<AlertContent>
					<AlertTitle>Title</AlertTitle>
					<AlertDescription>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
						qui aliquid rerum debitis aliquam. Enim alias earum esse consequatur
						obcaecati beatae fugiat eius mollitia odio, dolorum eum maiores, at
						aliquid.
					</AlertDescription>
				</AlertContent>
			</AlertContainer>
		</div>
	);
}
