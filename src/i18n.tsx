import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export const locales = ['en', 'fr', 'es', 'de'] as const;
export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_STORAGE_KEY = 'swissknife.ui_language';

const en = {
  meta: {
    title: 'SwissKnife — local file converter',
    description: 'SwissKnife converts audio, video and images in your browser. Your files are never uploaded. Powered locally by FFmpeg WASM and Canvas.',
  },
  language: {
    label: 'Language',
    english: 'English',
    french: 'French',
    spanish: 'Spanish',
    german: 'German',
  },
  header: {
    tagline: 'Local converter',
    demo: 'Demo',
    loading: 'Loading…',
    engineReady: 'Engine ready',
    engineInactive: 'Engine inactive',
    console: 'Console',
  },
  demo: {
    public: 'Public demo',
    chip: 'Demo',
    info: 'Show demo information',
    reset: 'Reset',
    resetAria: 'Reset the demo',
    continue: 'Continue',
    title: 'Convert files without sending them anywhere.',
    body: 'This is the real SwissKnife converter running in your browser. Conversions happen locally in this tab. Your files never leave the device.',
    try: 'You can try',
    tryBody: 'Drop audio, video or images and convert them here.',
    sim: 'What stays local',
    simBody: 'The conversion engine runs in this tab only. Nothing is uploaded.',
    never: 'What never happens',
    neverBody: 'No account, remote processing or file upload is used.',
    limits: 'Refreshing the page clears the queue.',
    site: 'Site',
    docs: 'Docs',
    source: 'Source',
    resetting: 'The demo is being reset.',
  },
  dropzone: {
    aria: 'Drop or browse audio, video or image files',
    audio: 'Audio',
    video: 'Video',
    image: 'Image',
    release: 'Release to add',
    title: 'Drop your files',
    body: 'Audio, video or image. Files stay in your browser.',
    browse: 'Or click to browse',
  },
  privacy: {
    title: 'Privacy',
    beforeBrowser: 'Media is processed ',
    browser: 'inside your browser',
    afterBrowser: ' (Canvas for images, FFmpeg WASM for audio and video). Nothing is sent to a server.',
    localCpu: 'Local CPU',
    noUpload: 'Your files are never uploaded',
    localEngine: 'FFmpeg engine served by this app',
  },
  queue: {
    retry: 'Retry',
    convert: 'Convert',
    outputFormat: (name: string) => `Output format for ${name}`,
    confirm: 'Confirm',
    rename: 'Rename',
    download: 'Download',
    cancel: 'Cancel',
    queued: 'Queued',
    remove: (name: string) => `Remove ${name}`,
    unknown: 'unknown',
    cancelled: 'cancelled',
    largeFile: 'large file',
    title: 'Queue',
    info: 'Queue information',
    help: (limit: string) => `Images can be converted in parallel. Audio and video share one FFmpeg engine and run one after another. Above ${limit}, browser memory may become exhausted.`,
    summary: (files: number, done: number, pending: number) => `${files} file${files === 1 ? '' : 's'} · ${done} completed · ${pending} pending`,
    downloadAll: 'Download all',
    all: 'All',
    converting: 'Converting…',
    convertAll: 'Convert all',
    clearAll: 'Clear all',
    empty: 'No files in the queue',
    emptyHint: 'Drop files above to get started',
    categories: { video: 'video', audio: 'audio', image: 'image', unknown: 'unknown' },
  },
  console: {
    title: 'FFMPEG CONSOLE',
    logs: 'logs',
    clear: 'Clear logs',
    hide: 'Hide console',
    waiting: 'Waiting for FFmpeg logs…',
  },
  banners: {
    dismiss: 'Dismiss',
    rejected: (files: string[]) => `Unsupported file${files.length === 1 ? '' : 's'}: ${files.join(', ')}`,
    large: (files: string[]) => `Large file: ${files.join(', ')}. Conversion may exhaust this tab's memory.`,
  },
  engine: {
    cancelled: 'Conversion cancelled',
    unsupportedImage: (format: string) => `Unsupported image output: ${format}. Use JPG, PNG or WEBP.`,
    canvasUnavailable: 'Unable to create a 2D Canvas context',
    exportFailed: (format: string) => `Failed to export as ${format}`,
    tiffUnsupported: 'This browser cannot read TIFF files. Export to PNG or JPG first.',
    unreadableImage: (format: string) => `Unable to read this image (${format || 'unknown format'}).`,
    imageLoadFailed: 'Unable to load the image',
    imageStart: (name: string, format: string) => `Image conversion (Canvas): ${name} → ${format}`,
    conversionDone: (name: string) => `Conversion complete: ${name}`,
    fileNotConvertible: 'This file type cannot be converted.',
    conversionError: (message: string) => `Conversion error: ${message}`,
    loadingEngine: 'Loading the local FFmpeg WASM engine…',
    engineTimeout: 'The FFmpeg engine could not be loaded in time. Check the connection and try again.',
    engineReady: 'FFmpeg engine ready (local copy, single thread).',
    engineLoadFailed: (message: string) => `FFmpeg failed to load: ${message}`,
    mediaOnly: 'FFmpeg is only used for audio and video.',
    conversionStart: (name: string, format: string) => `Starting conversion: ${name} → ${format}`,
    fileLoaded: (megabytes: string) => `File loaded into memory (${megabytes} MB)`,
    command: (command: string) => `Command: ${command}`,
  },
};

type Widen<T> = T extends (...args: infer Args) => infer Result
  ? (...args: Args) => Result
  : T extends string
    ? string
    : { [Key in keyof T]: Widen<T[Key]> };

export type Messages = Widen<typeof en>;

const fr = {
  meta: {
    title: 'SwissKnife — convertisseur de fichiers local',
    description: 'SwissKnife convertit audio, vidéo et images dans votre navigateur. Aucun envoi de vos fichiers. FFmpeg WASM et Canvas fonctionnent en local.',
  },
  language: { label: 'Langue', english: 'Anglais', french: 'Français', spanish: 'Espagnol', german: 'Allemand' },
  header: {
    tagline: 'Convertisseur local', demo: 'Démo', loading: 'Chargement…', engineReady: 'Moteur prêt', engineInactive: 'Moteur inactif', console: 'Console',
  },
  demo: {
    public: 'Démonstration publique',
    chip: 'Démo',
    info: 'Afficher les informations de la démonstration',
    reset: 'Réinitialiser',
    resetAria: 'Réinitialiser la démonstration',
    continue: 'Continuer',
    title: 'Convertissez des fichiers sans les envoyer nulle part.',
    body: 'Ceci est le vrai convertisseur SwissKnife, exécuté dans votre navigateur. Les conversions se font localement dans cet onglet. Vos fichiers ne quittent pas l’appareil.',
    try: 'Vous pouvez essayer',
    tryBody: 'Déposer de l’audio, de la vidéo ou des images et les convertir ici.',
    sim: 'Ce qui reste local',
    simBody: 'Le moteur de conversion tourne uniquement dans cet onglet. Rien n’est envoyé.',
    never: 'Ce qui n’arrive jamais',
    neverBody: 'Aucun compte, traitement distant ou envoi de fichier n’est utilisé.',
    limits: 'Recharger la page vide la file d’attente.',
    site: 'Site',
    docs: 'Docs',
    source: 'Source',
    resetting: 'La démonstration est en cours de réinitialisation.',
  },
  dropzone: {
    aria: 'Déposer ou parcourir des fichiers audio, vidéo ou image', audio: 'Audio', video: 'Vidéo', image: 'Image', release: 'Lâchez pour ajouter', title: 'Déposez vos fichiers', body: 'Audio, vidéo ou image. Les fichiers restent dans votre navigateur.', browse: 'Ou cliquez pour parcourir',
  },
  privacy: {
    title: 'Vie privée', beforeBrowser: 'Les médias sont traités ', browser: 'dans votre navigateur', afterBrowser: ' (Canvas pour les images, FFmpeg WASM pour l’audio et la vidéo). Rien n’est envoyé sur un serveur.', localCpu: 'CPU local', noUpload: 'Aucun envoi de vos fichiers', localEngine: 'Moteur FFmpeg servi par cette app',
  },
  queue: {
    retry: 'Réessayer', convert: 'Convertir', outputFormat: (name: string) => `Format de sortie pour ${name}`, confirm: 'Valider', rename: 'Renommer', download: 'Télécharger', cancel: 'Annuler', queued: 'En file', remove: (name: string) => `Retirer ${name}`, unknown: 'inconnu', cancelled: 'annulé', largeFile: 'fichier volumineux', title: "File d'attente", info: 'Informations sur la file d’attente', help: (limit: string) => `Les images peuvent être converties en parallèle. L’audio et la vidéo partagent un seul moteur FFmpeg et passent l’un après l’autre. Au-delà de ${limit}, la mémoire du navigateur peut saturer.`, summary: (files: number, done: number, pending: number) => `${files} fichier${files > 1 ? 's' : ''} · ${done} terminé${done > 1 ? 's' : ''} · ${pending} en attente`, downloadAll: 'Tout télécharger', all: 'Tout', converting: 'Conversion…', convertAll: 'Tout convertir', clearAll: 'Tout supprimer', empty: 'Aucun fichier dans la file', emptyHint: 'Déposez des fichiers ci-dessus pour commencer', categories: { video: 'vidéo', audio: 'audio', image: 'image', unknown: 'inconnu' },
  },
  console: { title: 'CONSOLE FFMPEG', logs: 'logs', clear: 'Vider les logs', hide: 'Masquer la console', waiting: 'En attente de logs FFmpeg…' },
  banners: {
    dismiss: 'Fermer', rejected: (files: string[]) => `Fichier${files.length > 1 ? 's' : ''} refusé${files.length > 1 ? 's' : ''} (type non géré) : ${files.join(', ')}`, large: (files: string[]) => `Fichier volumineux : ${files.join(', ')}. La conversion peut saturer la mémoire de l’onglet.`,
  },
  engine: {
    cancelled: 'Conversion annulée', unsupportedImage: (format: string) => `Sortie image non supportée : ${format}. Utilisez JPG, PNG ou WEBP.`, canvasUnavailable: 'Impossible de créer un contexte Canvas 2D', exportFailed: (format: string) => `Échec de l’export en ${format}`, tiffUnsupported: 'Ce navigateur ne peut pas lire le TIFF. Exportez d’abord en PNG ou JPG.', unreadableImage: (format: string) => `Impossible de lire cette image (${format || 'format inconnu'}).`, imageLoadFailed: 'Impossible de charger l’image', imageStart: (name: string, format: string) => `Conversion image (Canvas) : ${name} → ${format}`, conversionDone: (name: string) => `Conversion terminée : ${name}`, fileNotConvertible: 'Type de fichier non convertible.', conversionError: (message: string) => `Erreur de conversion : ${message}`, loadingEngine: 'Chargement du moteur FFmpeg WASM (copie locale)…', engineTimeout: 'Le moteur FFmpeg n’a pas pu être chargé (délai dépassé). Vérifiez la connexion ou réessayez.', engineReady: 'Moteur FFmpeg prêt (copie locale, un seul thread).', engineLoadFailed: (message: string) => `Échec du chargement FFmpeg : ${message}`, mediaOnly: 'FFmpeg n’est utilisé que pour l’audio et la vidéo.', conversionStart: (name: string, format: string) => `Début de conversion : ${name} → ${format}`, fileLoaded: (megabytes: string) => `Fichier chargé en mémoire (${megabytes} Mo)`, command: (command: string) => `Commande : ${command}`,
  },
} satisfies Messages;

const es = {
  meta: {
    title: 'SwissKnife — convertidor de archivos local',
    description: 'SwissKnife convierte audio, vídeo e imágenes en tu navegador. Tus archivos nunca se suben. FFmpeg WASM y Canvas funcionan de forma local.',
  },
  language: { label: 'Idioma', english: 'Inglés', french: 'Francés', spanish: 'Español', german: 'Alemán' },
  header: {
    tagline: 'Convertidor local', demo: 'Demo', loading: 'Cargando…', engineReady: 'Motor listo', engineInactive: 'Motor inactivo', console: 'Consola',
  },
  demo: {
    public: 'Demostración pública',
    chip: 'Demo',
    info: 'Mostrar información de la demo',
    reset: 'Restablecer',
    resetAria: 'Restablecer la demo',
    continue: 'Continuar',
    title: 'Convierte archivos sin enviarlos a ningún sitio.',
    body: 'Este es el convertidor real de SwissKnife, ejecutado en tu navegador. Las conversiones ocurren en esta pestaña. Tus archivos no salen del dispositivo.',
    try: 'Puedes probar',
    tryBody: 'Soltar audio, vídeo o imágenes y convertirlos aquí.',
    sim: 'Qué se queda local',
    simBody: 'El motor de conversión corre solo en esta pestaña. No se sube nada.',
    never: 'Qué no ocurre nunca',
    neverBody: 'No se usa cuenta, procesamiento remoto ni subida de archivos.',
    limits: 'Recargar la página vacía la cola.',
    site: 'Sitio',
    docs: 'Docs',
    source: 'Código',
    resetting: 'La demo se está restableciendo.',
  },
  dropzone: {
    aria: 'Suelta o selecciona archivos de audio, vídeo o imagen', audio: 'Audio', video: 'Vídeo', image: 'Imagen', release: 'Suelta para añadir', title: 'Suelta tus archivos', body: 'Audio, vídeo o imagen. Los archivos permanecen en tu navegador.', browse: 'O haz clic para seleccionar',
  },
  privacy: {
    title: 'Privacidad', beforeBrowser: 'Los archivos se procesan ', browser: 'en tu navegador', afterBrowser: ' (Canvas para las imágenes y FFmpeg WASM para el audio y el vídeo). No se envía nada a ningún servidor.', localCpu: 'CPU local', noUpload: 'Tus archivos nunca se suben', localEngine: 'Motor FFmpeg servido por esta aplicación',
  },
  queue: {
    retry: 'Reintentar', convert: 'Convertir', outputFormat: (name: string) => `Formato de salida para ${name}`, confirm: 'Confirmar', rename: 'Renombrar', download: 'Descargar', cancel: 'Cancelar', queued: 'En cola', remove: (name: string) => `Quitar ${name}`, unknown: 'desconocido', cancelled: 'cancelado', largeFile: 'archivo grande', title: 'Cola', info: 'Información sobre la cola', help: (limit: string) => `Las imágenes pueden convertirse en paralelo. El audio y el vídeo comparten un único motor FFmpeg y se procesan uno tras otro. Por encima de ${limit}, la memoria del navegador puede agotarse.`, summary: (files: number, done: number, pending: number) => `${files} archivo${files === 1 ? '' : 's'} · ${done} completado${done === 1 ? '' : 's'} · ${pending} pendiente${pending === 1 ? '' : 's'}`, downloadAll: 'Descargar todo', all: 'Todo', converting: 'Convirtiendo…', convertAll: 'Convertir todo', clearAll: 'Vaciar la cola', empty: 'No hay archivos en la cola', emptyHint: 'Suelta archivos arriba para empezar', categories: { video: 'vídeo', audio: 'audio', image: 'imagen', unknown: 'desconocido' },
  },
  console: { title: 'CONSOLA DE FFMPEG', logs: 'registros', clear: 'Borrar registros', hide: 'Ocultar la consola', waiting: 'Esperando registros de FFmpeg…' },
  banners: {
    dismiss: 'Cerrar', rejected: (files: string[]) => `Archivo${files.length === 1 ? '' : 's'} no compatible${files.length === 1 ? '' : 's'}: ${files.join(', ')}`, large: (files: string[]) => `Archivo grande: ${files.join(', ')}. La conversión puede agotar la memoria de esta pestaña.`,
  },
  engine: {
    cancelled: 'Conversión cancelada', unsupportedImage: (format: string) => `Formato de imagen de salida no compatible: ${format}. Usa JPG, PNG o WEBP.`, canvasUnavailable: 'No se ha podido crear un contexto Canvas 2D', exportFailed: (format: string) => `No se ha podido exportar en ${format}`, tiffUnsupported: 'Este navegador no puede leer archivos TIFF. Expórtalos primero a PNG o JPG.', unreadableImage: (format: string) => `No se ha podido leer esta imagen (${format || 'formato desconocido'}).`, imageLoadFailed: 'No se ha podido cargar la imagen', imageStart: (name: string, format: string) => `Conversión de imagen (Canvas): ${name} → ${format}`, conversionDone: (name: string) => `Conversión completada: ${name}`, fileNotConvertible: 'Este tipo de archivo no se puede convertir.', conversionError: (message: string) => `Error de conversión: ${message}`, loadingEngine: 'Cargando el motor FFmpeg WASM local…', engineTimeout: 'El motor FFmpeg no se ha cargado a tiempo. Comprueba la conexión e inténtalo de nuevo.', engineReady: 'Motor FFmpeg listo (copia local, un solo hilo).', engineLoadFailed: (message: string) => `No se ha podido cargar FFmpeg: ${message}`, mediaOnly: 'FFmpeg solo se utiliza para audio y vídeo.', conversionStart: (name: string, format: string) => `Iniciando conversión: ${name} → ${format}`, fileLoaded: (megabytes: string) => `Archivo cargado en memoria (${megabytes} MB)`, command: (command: string) => `Comando: ${command}`,
  },
} satisfies Messages;

const de = {
  meta: {
    title: 'SwissKnife — lokaler Dateikonverter',
    description: 'SwissKnife konvertiert Audio-, Video- und Bilddateien direkt im Browser. Deine Dateien werden nie hochgeladen. FFmpeg WASM und Canvas laufen lokal.',
  },
  language: { label: 'Sprache', english: 'Englisch', french: 'Französisch', spanish: 'Spanisch', german: 'Deutsch' },
  header: {
    tagline: 'Lokaler Konverter', demo: 'Demo', loading: 'Wird geladen…', engineReady: 'Engine bereit', engineInactive: 'Engine inaktiv', console: 'Konsole',
  },
  demo: {
    public: 'Öffentliche Demo',
    chip: 'Demo',
    info: 'Informationen zur Demo anzeigen',
    reset: 'Zurücksetzen',
    resetAria: 'Demo zurücksetzen',
    continue: 'Weiter',
    title: 'Dateien konvertieren, ohne sie irgendwohin zu senden.',
    body: 'Dies ist der echte SwissKnife-Konverter und läuft in deinem Browser. Konvertierungen passieren lokal in diesem Tab. Deine Dateien verlassen das Gerät nicht.',
    try: 'Du kannst ausprobieren',
    tryBody: 'Audio, Video oder Bilder ablegen und hier konvertieren.',
    sim: 'Was lokal bleibt',
    simBody: 'Die Konvertierungs-Engine läuft nur in diesem Tab. Nichts wird hochgeladen.',
    never: 'Was nie passiert',
    neverBody: 'Es wird kein Konto, keine entfernte Verarbeitung und kein Datei-Upload verwendet.',
    limits: 'Ein Neuladen der Seite leert die Warteschlange.',
    site: 'Website',
    docs: 'Doku',
    source: 'Quellcode',
    resetting: 'Die Demo wird zurückgesetzt.',
  },
  dropzone: {
    aria: 'Audio-, Video- oder Bilddateien ablegen oder auswählen', audio: 'Audio', video: 'Video', image: 'Bild', release: 'Zum Hinzufügen loslassen', title: 'Dateien hier ablegen', body: 'Audio, Video oder Bild. Die Dateien bleiben in deinem Browser.', browse: 'Oder zum Auswählen klicken',
  },
  privacy: {
    title: 'Datenschutz', beforeBrowser: 'Die Dateien werden ', browser: 'in deinem Browser', afterBrowser: ' verarbeitet (Bilder mit Canvas, Audio und Video mit FFmpeg WASM). Nichts wird an einen Server gesendet.', localCpu: 'Lokale CPU', noUpload: 'Deine Dateien werden nie hochgeladen', localEngine: 'FFmpeg-Engine wird von dieser App bereitgestellt',
  },
  queue: {
    retry: 'Erneut versuchen', convert: 'Konvertieren', outputFormat: (name: string) => `Ausgabeformat für ${name}`, confirm: 'Bestätigen', rename: 'Umbenennen', download: 'Herunterladen', cancel: 'Abbrechen', queued: 'In Warteschlange', remove: (name: string) => `${name} entfernen`, unknown: 'unbekannt', cancelled: 'abgebrochen', largeFile: 'große Datei', title: 'Warteschlange', info: 'Informationen zur Warteschlange', help: (limit: string) => `Bilder können parallel konvertiert werden. Audio und Video teilen sich eine FFmpeg-Engine und werden nacheinander verarbeitet. Ab ${limit} kann der Browser an seine Speichergrenze stoßen.`, summary: (files: number, done: number, pending: number) => `${files} Datei${files === 1 ? '' : 'en'} · ${done} abgeschlossen · ${pending} ausstehend`, downloadAll: 'Alle herunterladen', all: 'Alle', converting: 'Wird konvertiert…', convertAll: 'Alle konvertieren', clearAll: 'Warteschlange leeren', empty: 'Keine Dateien in der Warteschlange', emptyHint: 'Lege oben Dateien ab, um zu beginnen', categories: { video: 'Video', audio: 'Audio', image: 'Bild', unknown: 'unbekannt' },
  },
  console: { title: 'FFMPEG-KONSOLE', logs: 'Einträge', clear: 'Einträge löschen', hide: 'Konsole ausblenden', waiting: 'Warte auf FFmpeg-Einträge…' },
  banners: {
    dismiss: 'Schließen', rejected: (files: string[]) => `Nicht unterstützte Datei${files.length === 1 ? '' : 'en'}: ${files.join(', ')}`, large: (files: string[]) => `Große Datei: ${files.join(', ')}. Die Konvertierung kann den Speicher dieses Tabs erschöpfen.`,
  },
  engine: {
    cancelled: 'Konvertierung abgebrochen', unsupportedImage: (format: string) => `Nicht unterstütztes Bild-Ausgabeformat: ${format}. Verwende JPG, PNG oder WEBP.`, canvasUnavailable: 'Es konnte kein 2D-Canvas-Kontext erstellt werden', exportFailed: (format: string) => `Export als ${format} fehlgeschlagen`, tiffUnsupported: 'Dieser Browser kann TIFF-Dateien nicht lesen. Exportiere sie zuerst als PNG oder JPG.', unreadableImage: (format: string) => `Dieses Bild konnte nicht gelesen werden (${format || 'unbekanntes Format'}).`, imageLoadFailed: 'Das Bild konnte nicht geladen werden', imageStart: (name: string, format: string) => `Bildkonvertierung (Canvas): ${name} → ${format}`, conversionDone: (name: string) => `Konvertierung abgeschlossen: ${name}`, fileNotConvertible: 'Dieser Dateityp kann nicht konvertiert werden.', conversionError: (message: string) => `Konvertierungsfehler: ${message}`, loadingEngine: 'Lokale FFmpeg-WASM-Engine wird geladen…', engineTimeout: 'Die FFmpeg-Engine konnte nicht rechtzeitig geladen werden. Prüfe die Verbindung und versuche es erneut.', engineReady: 'FFmpeg-Engine bereit (lokale Kopie, ein Thread).', engineLoadFailed: (message: string) => `FFmpeg konnte nicht geladen werden: ${message}`, mediaOnly: 'FFmpeg wird nur für Audio und Video verwendet.', conversionStart: (name: string, format: string) => `Konvertierung gestartet: ${name} → ${format}`, fileLoaded: (megabytes: string) => `Datei in den Speicher geladen (${megabytes} MB)`, command: (command: string) => `Befehl: ${command}`,
  },
} satisfies Messages;

export const messages: Record<Locale, Messages> = { en, fr, es, de };

function isLocale(value: string | null): value is Locale {
  return value !== null && locales.includes(value as Locale);
}

function initialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const requested = new URLSearchParams(window.location.search).get('lang');
  if (isLocale(requested)) return requested;
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

type I18nValue = {
  locale: Locale;
  copy: Messages;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.title = messages[locale].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', messages[locale].meta.description);
  }, [locale]);

  const value = useMemo(() => ({ locale, copy: messages[locale], setLocale }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
}
