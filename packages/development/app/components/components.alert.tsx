import { AlertContainer } from "@arkyn/components/alertContainer";
import { AlertContent } from "@arkyn/components/alertContent";
import { AlertDescription } from "@arkyn/components/alertDescription";
import { AlertIcon } from "@arkyn/components/alertIcon";
import { AlertTitle } from "@arkyn/components/alertTitle";

export default function AlertRoute() {
	return (
		<>
			<div className="exampleContainer">
				<AlertContainer scheme="danger">
					<AlertIcon />
					<AlertContent>
						<AlertTitle>Payment failed</AlertTitle>
						<AlertDescription>
							Please check your card details and try again.
						</AlertDescription>
					</AlertContent>
				</AlertContainer>

				<AlertContainer scheme="info">
					<AlertIcon />
					<AlertContent>
						<AlertTitle>New version available</AlertTitle>
						<AlertDescription>
							A new version of the app is available. Refresh to update.
						</AlertDescription>
					</AlertContent>
				</AlertContainer>

				<AlertContainer scheme="success">
					<AlertIcon />
					<AlertContent>
						<AlertTitle>Subscription activated</AlertTitle>
						<AlertDescription>
							Your subscription has been successfully activated.
						</AlertDescription>
					</AlertContent>
				</AlertContainer>

				<AlertContainer scheme="warning">
					<AlertIcon />
					<AlertContent>
						<AlertTitle>Storage almost full</AlertTitle>
						<AlertDescription>
							You have used 90% of your storage quota. Consider upgrading.
						</AlertDescription>
					</AlertContent>
				</AlertContainer>
			</div>

			<div className="exampleContainer">
				<AlertContainer scheme="danger">
					<AlertIcon />
					<AlertDescription>
						Critical error occurred. Please contact support.
					</AlertDescription>
				</AlertContainer>

				<AlertContainer scheme="info">
					<AlertIcon />
					<AlertDescription>
						Your session will expire in 5 minutes. Please save your work.
					</AlertDescription>
				</AlertContainer>

				<AlertContainer scheme="success">
					<AlertIcon />
					<AlertDescription>
						Your changes have been saved successfully.
					</AlertDescription>
				</AlertContainer>

				<AlertContainer scheme="warning">
					<AlertIcon />
					<AlertDescription>Unsaved changes will be lost.</AlertDescription>
				</AlertContainer>
			</div>
		</>
	);
}
