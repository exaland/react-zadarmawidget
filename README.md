# react-zadarmawidget

[![Node.js Package](https://github.com/exaland/react-zadarmawidget/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/exaland/react-zadarmawidget/actions/workflows/npm-publish.yml)

Librairie React publique pour intégrer le widget WebRTC Callme de Zadarma dans une application React.

Elle encapsule le widget JavaScript historique fourni dans `zip_callmewidget_v2.0.9_full.zip` et expose un composant React typé.

## Installation

```bash
npm install react-zadarmawidget
```

## Utilisation

```tsx
import { CallmeWidget } from 'react-zadarmawidget';
import 'react-zadarmawidget/style.css';

export default function App() {
  return (
    <CallmeWidget
      widgetId={123456}
      sipId={123456}
      options={{
        language: 'fr',
        shape: 'circle',
        dtmf: true,
        color_bg_call: 'rgb(126, 211, 33)'
      }}
      onError={(error) => console.error(error)}
    />
  );
}
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `widgetId` | `number \| string` | Identifiant du widget Zadarma. |
| `sipId` | `number \| string` | Identifiant SIP Zadarma. |
| `options` | `CallmeWidgetOptions` | Options visuelles et fonctionnelles du widget. |
| `id` | `string` | ID DOM personnalisé du conteneur. |
| `className` | `string` | Classe CSS du conteneur. |
| `style` | `CSSProperties` | Style inline du conteneur. |
| `objectName` | `string` | Nom global utilisé par les callbacks JSONP Zadarma. Utile si plusieurs widgets sont affichés sur la même page. |
| `scriptUrls` | `[string, string, string]` | URLs personnalisées pour `detectWebRTC`, `JsSIP` et `widget`. |
| `onReady` | `() => void` | Callback appelé après création du widget. |
| `onError` | `(error: Error) => void` | Callback appelé en cas d’erreur. |

## Contraintes

- Le widget WebRTC doit être utilisé en HTTPS, sauf en local sur `localhost`.
- `widgetId` et `sipId` doivent venir de ton compte Zadarma.
- Le widget original utilise des variables globales et des callbacks JSONP ; cette librairie les isole autant que possible côté React.
- Pour plusieurs widgets sur une même page, définis un `objectName` unique pour chaque instance.

## Héberger les scripts vendor toi-même

Par défaut, les scripts vendor sont empaquetés avec la librairie. Tu peux aussi fournir tes propres URLs :

```tsx
<CallmeWidget
  widgetId={123456}
  sipId={123456}
  scriptUrls={[
    '/callmewidget/detectWebRTC.min.js',
    '/callmewidget/jssip.min.js',
    '/callmewidget/widget.min.js'
  ]}
/>
```

## Publication npm publique

Avant publication, connecte-toi à npm :

```bash
npm login
```

Puis publie :

```bash
npm publish --access public
```

Si le nom `react-zadarmawidget` est déjà pris, change le champ `name` dans `package.json`, par exemple :

```json
{
  "name": "react-zadarmawidget"
}
```

## Développement

```bash
npm install
npm run typecheck
npm run build
```

## Licence

MIT
