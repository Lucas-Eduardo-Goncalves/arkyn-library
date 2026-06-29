import { generateGAElements } from "./snippets/generateGAElements";

type InitializeProps = {
	measurementId: string;
};

class GoogleAnalytics {
	private initializeAsyncScript(src: string) {
		const script = document.createElement("script");
		script.async = true;
		script.src = src;
		return script;
	}

	private initializeInlineScript(content: string) {
		const script = document.createElement("script");
		script.innerHTML = content;
		return script;
	}

	initialize(props: InitializeProps) {
		const { measurementId } = props;

		const elements = generateGAElements({ measurementId });

		const asyncScript = this.initializeAsyncScript(elements.src);
		const inlineScript = this.initializeInlineScript(elements.script);

		document.head.appendChild(asyncScript);
		document.head.appendChild(inlineScript);
	}
}

export { GoogleAnalytics };
