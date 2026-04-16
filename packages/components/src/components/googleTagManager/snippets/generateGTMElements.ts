import { appendToDataLayer } from "./appendToDataLayer";

type GenerateGTMElementsProps = {
  id: string;
  events: Record<string, string>;
  dataLayer: Record<string, string>;
  dataLayerName: string;
  preview: string;
  auth: string;
};

function generateGTMElements(props: GenerateGTMElementsProps) {
  const { id, events, dataLayer, dataLayerName, preview, auth } = props;

  const gtmAuth = `&gtm_auth=${auth}`;
  const gtmPreview = `&gtm_preview=${preview}`;

  if (!id) console.warn("GTM Id is required");

  const iframe = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=${id}${gtmAuth}${gtmPreview}&gtm_cookies_win=x"
      height="0" width="0" style="display:none;visibility:hidden" id="tag-manager"></iframe>`;

  const script = `
    (function(w,d,s,l,i){w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js', ${JSON.stringify(
        events,
      ).slice(1, -1)}});
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl+'${gtmAuth}${gtmPreview}&gtm_cookies_win=x';
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','${dataLayerName}','${id}');`;

  const dataLayerVar = appendToDataLayer({ dataLayer, dataLayerName });

  return {
    iframe,
    script,
    dataLayerVar,
  };
}

export { generateGTMElements };
