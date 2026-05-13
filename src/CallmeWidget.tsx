import { CSSProperties, useEffect, useId, useMemo, useRef } from 'react';
import "./vendor/style.css";
const detectRtcUrl = new URL('./vendor/detectWebRTC.min.js', import.meta.url).href;
const jsSipUrl = new URL('./vendor/jssip.min.js', import.meta.url).href;
const widgetUrl = new URL('./vendor/widget.min.js', import.meta.url).href;

export type CallmeWidgetOptions = {
  shape?: 'circle' | 'square';
  language?: 'en' | 'ru' | 'pl' | 'es' | 'ua' | string;
  dtmf?: boolean;
  dtmf_position?: 'top' | 'right' | 'bottom' | 'left';
  dtmf_time_to_disappear?: number;
  dtmf_auto_show?: boolean;
  color_call?: string;
  color_bg_call?: string;
  color_border_call?: string;
  color_connection?: string;
  color_bg_connection?: string;
  color_border_connection?: string;
  color_calling?: string;
  color_bg_calling?: string;
  color_border_calling?: string;
  color_ended?: string;
  color_bg_ended?: string;
  color_border_ended?: string;
  font?: string;
  txt_greeting?: string;
  txt_nowebrtc?: string;
  width?: number | string;
  [key: string]: unknown;
};

export type CallmeWidgetProps = {
  widgetId: number | string;
  sipId: number | string;
  options?: CallmeWidgetOptions;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /**
   * Global variable name used by Zadarma JSONP callbacks.
   * Use a stable unique value if multiple widgets are rendered on one page.
   */
  objectName?: string;
  /** Override script URLs if you host vendor files yourself. Order: detectRTC, JsSIP, widget. */
  scriptUrls?: [string, string, string];
  onReady?: () => void;
  onError?: (error: Error) => void;
};

function loadScript(src: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  window.__reactCallmeWidgetScripts ??= {};
  if (window.__reactCallmeWidgetScripts[src]) return window.__reactCallmeWidgetScripts[src];

  window.__reactCallmeWidgetScripts[src] = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-callmewidget-src="${src}"]`);
    if (existing?.dataset.loaded === 'true') {
      resolve();
      return;
    }

    const script = existing ?? document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.callmewidgetSrc = src;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Impossible de charger le script CallmeWidget: ${src}`));

    if (!existing) document.head.appendChild(script);
  });

  return window.__reactCallmeWidgetScripts[src];
}

export function CallmeWidget({
  widgetId,
  sipId,
  options,
  id,
  className,
  style,
  objectName,
  scriptUrls,
  onReady,
  onError
}: CallmeWidgetProps) {
  const reactId = useId().replace(/:/g, '');
  const domId = id ?? `callme-widget-${reactId}`;
  const instanceName = objectName ?? `zadarmaCallmeWidget_${reactId}`;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const resolvedScripts = useMemo(
    () => scriptUrls ?? [detectRtcUrl, jsSipUrl, widgetUrl] as [string, string, string],
    [scriptUrls]
  );

  useEffect(() => {
    let cancelled = false;

    async function mountWidget() {
      try {
        if (typeof window === 'undefined') return;
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
          throw new Error('Le widget Zadarma WebRTC doit être utilisé en HTTPS.');
        }

        for (const src of resolvedScripts) {
          await loadScript(src);
        }

        if (cancelled) return;
        if (!window.ZadarmaCallmeWidget) {
          throw new Error('window.ZadarmaCallmeWidget est introuvable après chargement des scripts.');
        }

        const instance = new window.ZadarmaCallmeWidget(instanceName);
        window[instanceName] = instance;

        containerRef.current?.replaceChildren();
        instance.create({ widgetId, sipId, domElement: domId }, options ?? {});
        onReady?.();
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    }

    mountWidget();

    return () => {
      cancelled = true;
      containerRef.current?.replaceChildren();
      try {
        delete window[instanceName];
      } catch {
        window[instanceName] = undefined;
      }
    };
  }, [domId, instanceName, onError, onReady, options, resolvedScripts, sipId, widgetId]);

  return <div id={domId} ref={containerRef} className={className} style={style} />;
}
