import { appendToDataLayer } from "./snippets/appendToDataLayer";
import { generateGTMElements } from "./snippets/generateGTMElements";

type InitializeDataLayerProps = {
  dataLayerName: string;
  dataLayer: Record<string, string>;
};

type InitializeGTMProps = {
  id: string;
  events: Record<string, string>;
  dataLayer: Record<string, string>;
  dataLayerName: string;
  preview: string;
  auth: string;
};

type InitializeProps = {
  gtmId: string;
  events: Record<string, string>;
  dataLayer: Record<string, string>;
  dataLayerName: string;
  auth: string;
  preview: string;
};

interface Window {
  [key: string]: any;
}

declare var window: Window;

class GoogleTagManager {
  private initializeDataScript(dataLayer: string) {
    const script = document.createElement("script");
    script.innerHTML = dataLayer;
    return script;
  }

  private initializeGTMElements(props: InitializeGTMProps) {
    const snippets = generateGTMElements(props);

    const noScript = () => {
      const noscript = document.createElement("noscript");
      noscript.innerHTML = snippets.iframe;
      return noscript;
    };

    const script = () => {
      const script = document.createElement("script");
      script.innerHTML = snippets.script;
      return script;
    };

    const dataScript = this.initializeDataScript(snippets.dataLayerVar);

    return {
      noScript,
      script,
      dataScript,
    };
  }

  initializeDataLayer(props: InitializeDataLayerProps) {
    const { dataLayer, dataLayerName } = props;

    if (window[dataLayerName]) return window[dataLayerName].push(dataLayer);

    const snippets = appendToDataLayer({ dataLayer, dataLayerName });
    const dataScript = this.initializeDataScript(snippets);

    document.head.insertBefore(dataScript, document.head.childNodes[0]);
  }

  initialize(props: InitializeProps) {
    const {
      events,
      gtmId,
      dataLayer,
      auth = "",
      preview = "",
      dataLayerName = "dataLayer",
    } = props;

    const gtm = this.initializeGTMElements({
      id: gtmId,
      events: events,
      dataLayer: dataLayer || undefined,
      dataLayerName: dataLayerName,
      auth,
      preview,
    });

    if (dataLayer) document.head.appendChild(gtm.dataScript);
    document.head.insertBefore(gtm.script(), document.head.childNodes[0]);
    document.body.insertBefore(gtm.noScript(), document.body.childNodes[0]);
  }
}

export { GoogleTagManager };
