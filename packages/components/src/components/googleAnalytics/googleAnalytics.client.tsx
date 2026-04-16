import { GoogleAnalytics } from "./googleAnalytics";

type GoogleAnalyticsClientProps = {
  measurementId: string;
};

function GoogleAnalyticsClient(props: GoogleAnalyticsClientProps) {
  const googleAnalytics = new GoogleAnalytics();
  googleAnalytics.initialize(props);

  return <></>;
}

export { GoogleAnalyticsClient };
