declare global {
  interface Window {
    ZadarmaCallmeWidget?: new (objectLink: string) => {
      create: (
        config: { widgetId: number | string; sipId: number | string; domElement: string },
        options?: Record<string, unknown>
      ) => void;
      zadarmaCreate?: (response: unknown) => void;
      zadarmaCallback?: (response: unknown) => void;
    };
    __reactCallmeWidgetScripts?: Record<string, Promise<void> | undefined>;
    [key: string]: unknown;
  }
}

export {};
