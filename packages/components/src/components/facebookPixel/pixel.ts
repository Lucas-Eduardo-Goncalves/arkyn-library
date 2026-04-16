import { Fbq } from "../../types/defineType";

type Options = {
  autoConfig?: boolean;
  debug?: boolean;
};

class FacebookPixel {
  pixelId: string;
  autoConfig: boolean;
  initialized: boolean;

  constructor(pixelId: string, options?: Options) {
    this.pixelId = pixelId;
    this.autoConfig = options?.autoConfig || true;
    this.initialized = false;
  }

  private loadFacebookPixel() {
    // Verifica se o objeto fbq já está definido no objeto window
    if (window.fbq) return;

    // Define a função fbq que será usada para enviar eventos ao Facebook Pixel
    const fbq: Fbq = function (...args: any[]) {
      // Se fbq.callMethod estiver definido, chama o método com os argumentos fornecidos
      // Caso contrário, adiciona os argumentos à fila de eventos
      fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args);
    } as Fbq;

    // Se o objeto _fbq não estiver definido no objeto window, define-o como fbq
    if (!window._fbq) window._fbq = fbq;

    // Define propriedades e métodos adicionais para fbq
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];

    // Cria um elemento script e define o atributo src como o URL do script do Facebook Pixel
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";

    // Busca o primeiro elemento script no documento
    const firstScript = document.getElementsByTagName("script")[0];

    // Estoura uma exceção se não houver nenhum elemento script no documento
    if (!firstScript.parentNode) {
      throw new Error("No script tag found in the document");
    }

    // Insere o elemento script no início do documento
    firstScript.parentNode.insertBefore(script, firstScript);
    window.fbq = fbq;
  }

  init(advancedMatching: object = {}) {
    // Verifica se o pixel já foi inicializado
    this.initialized = typeof window !== "undefined" && !!window.fbq;

    // Carrega o Facebook Pixel
    this.loadFacebookPixel();

    // Estoura uma exceção se o fbq não estiver definido
    if (!window.fbq) {
      throw new Error("window.fbq is not defined");
    }

    // Inicializa o pixel com o ID fornecido
    if (this.autoConfig === false) {
      window.fbq("set", "autoConfig", false, this.pixelId);
    } else {
      window.fbq("init", this.pixelId, advancedMatching);
    }

    // Marca o pixel como inicializado
    this.initialized = true;
  }

  pageView() {
    if (!this.initialized) return;
    if (!window.fbq) return;

    window.fbq("track", "PageView");
  }

  track(title: string, data?: object) {
    if (!this.initialized) return;
    if (!window.fbq) return;

    window.fbq("track", title, data);
  }

  trackSingle(pixel: string, title: string, data?: object) {
    if (!this.initialized) return;
    if (!window.fbq) return;

    window.fbq("trackSingle", pixel, title, data);
  }

  trackCustom(event: string, data?: object) {
    if (!this.initialized) return;
    if (!window.fbq) return;

    window.fbq("trackCustom", event, data);
  }

  trackSingleCustom(pixel: string, event: string, data?: object) {
    if (!this.initialized) return;
    if (!window.fbq) return;

    window.fbq("trackSingle", pixel, event, data);
  }

  grantConsent() {
    if (!this.initialized) return;
    if (!window.fbq) return;

    window.fbq("consent", "grant");
  }

  revokeConsent() {
    if (!this.initialized) return;
    if (!window.fbq) return;

    window.fbq("consent", "revoke");
  }
}

export { FacebookPixel };
