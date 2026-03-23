import { TagManager } from "./tagManager";

type TagManagerClientProps = {
  gtmId: string;
  events: Record<string, string>;
  dataLayer: Record<string, string>;
  dataLayerName: string;
  auth: string;
  preview: string;
};

function TagManagerClient(props: TagManagerClientProps) {
  const tagManager = new TagManager();
  tagManager.initialize(props);

  return <></>;
}

export { TagManagerClient };
