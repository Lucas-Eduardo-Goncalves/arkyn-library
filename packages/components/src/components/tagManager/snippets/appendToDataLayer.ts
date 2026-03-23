type AppendToDataLayer = {
  dataLayer: Record<string, string>;
  dataLayerName: string;
};

function appendToDataLayer(props: AppendToDataLayer) {
  const { dataLayer, dataLayerName } = props;

  return `
  window.${dataLayerName} = window.${dataLayerName} || [];
  window.${dataLayerName}.push(${JSON.stringify(dataLayer)})`;
}

export { appendToDataLayer };
