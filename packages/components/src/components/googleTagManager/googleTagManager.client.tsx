import { GoogleTagManager } from "./googleTagManager";

type GoogleTagManagerClientProps = {
  gtmId: string;
  events: Record<string, string>;
  dataLayer: Record<string, string>;
  dataLayerName: string;
  auth: string;
  preview: string;
};

function GoogleTagManagerClient(props: GoogleTagManagerClientProps) {
  const googleTagManager = new GoogleTagManager();
  googleTagManager.initialize(props);

  return <></>;
}

export { GoogleTagManagerClient };
