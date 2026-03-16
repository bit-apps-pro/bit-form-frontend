// eslint-disable-next-line import/prefer-default-export
export const fileFormats = [
  {
    label: 'AAC audio (.aac)',
    value: 'audio/aac',
    mimeType: ['audio/aac', 'audio/vnd.dlna.adts'],
  },
  // {
  //   "label": "AbiWord document (.abw)",
  //   "value": "application/x-abiword"
  // },
  // {
  //   "label": "Archive document (multiple files embedded) (.arc)",
  //   "value": "application/x-freearc"
  // },
  {
    label: 'AVI: Audio Video Interleave (.avi)',
    value: 'video/avi',
    mimeType: ['video/avi', 'video/msvideo', 'video/x-msvideo'],
  },
  // {
  //   "label": "Amazon Kindle eBook format (.azw)",
  //   "value": "application/vnd.amazon.ebook"
  // },
  {
    label: 'Any kind of binary data (.bin)',
    value: 'application/octet-stream',
    mimeType: ['application/octet-stream'],
  },
  {
    label: 'Windows OS/2 Bitmap Graphics (.bmp)',
    value: 'image/bmp',
    mimeType: ['image/bmp'],
  },
  // {
  //   "label": "BZip archive (.bz)",
  //   "value": "application/x-bzip"
  // },
  // {
  //   "label": "BZip2 archive (.bz2)",
  //   "value": "application/x-bzip2"
  // },
  // {
  //   "label": "CD audio (.cda)",
  //   "value": "application/x-cdf"
  // },
  // {
  //   "label": "C-Shell script (.csh)",
  //   "value": "application/x-csh"
  // },
  {
    label: 'Cascading Style Sheets (CSS)',
    value: 'text/css',
    mimeType: ['text/css'],
  },
  {
    label: 'Comma-separated values (CSV)',
    value: 'text/csv',
    mimeType: ['text/csv', 'application/vnd.ms-excel'],
  },
  {
    label: 'Microsoft Word (.doc)',
    value: 'application/msword',
    mimeType: ['application/msword'],
  },
  {
    label: 'Microsoft Word (OpenXML) (.docx)',
    value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    mimeType: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  // {
  //   "label": "MS Embedded OpenType fonts (.eot)",
  //   "value": "application/vnd.ms-fontobject"
  // },
  {
    label: 'Electronic publication (EPUB)(.epub)',
    value: 'application/epub+zip',
    mimeType: ['application/epub+zip'],
  },
  {
    label: 'GZip Compressed Archive (.gz)',
    value: 'application/gzip',
    mimeType: ['application/gzip', 'application/x-gzip'],
  },
  {
    label: 'Graphics Interchange Format (GIF)(.gif)',
    value: 'image/gif',
    mimeType: ['image/gif'],
  },
  {
    label: 'HyperText Markup Language (HTML)(.htm .html)',
    value: 'text/html',
    mimeType: ['text/html'],
  },
  {
    label: 'Icon format (.ico)',
    value: 'image/vnd.microsoft.icon',
    mimeType: ['image/vnd.microsoft.icon', 'image/x-icon'],
  },
  {
    label: 'iCalendar format (.ics)',
    value: 'text/calendar',
    mimeType: ['text/calendar'],
  },
  // {
  //   "label": "Java Archive (JAR)(.jar)",
  //   "value": "application/java-archive"
  // },
  {
    label: 'JPEG images (.jpeg .jpg)',
    value: 'image/jpeg',
    mimeType: ['image/jpeg', 'image/pjpeg'],
  },
  {
    label: 'JavaScript (.js)',
    value: 'text/javascript',
    mimeType: ['text/javascript (Specifications: HTML and its reasoning, and IETF)'],
  },
  {
    label: 'JSON format (.json)',
    value: 'application/json',
    mimeType: ['application/json'],
  },
  // {
  //   "label": "JSON-LD format (.jsonld)",
  //   "value": "application/ld+json"
  // },
  {
    label: 'Musical Instrument Digital Interface (MIDI) (.mid .midi)',
    value: 'audio/midi',
    mimeType: ['audio/midi', 'audio/x-midi'],
  },
  {
    label: 'JavaScript module (.mjs)',
    value: 'text/javascript',
    mimeType: ['text/javascript'],
  },
  {
    label: 'MP3 audio (.mp3)',
    value: 'audio/mpeg',
    mimeType: ['audio/mpeg', 'audio/mp3'],
  },
  {
    label: 'MP4 video (.mp4)',
    value: 'video/mp4',
    mimeType: ['video/mp4', 'application/mp4'],
  },
  {
    label: 'MPEG Video (.mpeg)',
    value: 'video/mpeg',
    mimeType: ['video/mpeg'],
  },
  // {
  //   "label": "Apple Installer Package (.mpkg)",
  //   "value": "application/vnd.apple.installer+xml"
  // },
  {
    label: 'OpenDocument presentation document (.odp)',
    value: 'application/vnd.oasis.opendocument.presentation',
    mimeType: ['application/vnd.oasis.opendocument.presentation'],
  },
  {
    label: 'OpenDocument spreadsheet document (.ods)',
    value: 'application/vnd.oasis.opendocument.spreadsheet',
    mimeType: ['application/vnd.oasis.opendocument.spreadsheet'],
  },
  {
    label: 'OpenDocument text document (.odt)',
    value: 'application/vnd.oasis.opendocument.text',
    mimeType: ['application/vnd.oasis.opendocument.text'],
  },
  {
    label: 'OGG audio (.oga)',
    value: 'audio/ogg',
    mimeType: ['audio/ogg'],
  },
  // {
  //   "label": "OGG video (.ogv)",
  //   "value": "video/ogg"
  // },
  // {
  //   "label": "OGG (.ogx)",
  //   "value": "application/ogg"
  // },
  {
    label: 'Opus audio (.opus)',
    value: 'audio/opus',
    mimeType: ['audio/opus'],
  },
  // {
  //   "label": "OpenType font (.otf)",
  //   "value": "font/otf"
  // },
  {
    label: 'Portable Network Graphics (.png)',
    value: 'image/png',
    mimeType: ['image/png', 'image/x-png'],
  },
  {
    label: 'Adobe Portable Document Format (PDF) (.pdf)',
    value: 'application/pdf',
    mimeType: ['application/pdf'],
  },
  // {
  //   "label": "Hypertext Preprocessor (Personal Home Page)(.php)",
  //   "value": "application/x-httpd-php"
  // },
  {
    label: 'Microsoft PowerPoint (.ppt)',
    value: 'application/vnd.ms-powerpoint',
    mimeType: ['application/vnd.ms-powerpoint'],
  },
  {
    label: 'Microsoft PowerPoint (OpenXML) (.pptx)',
    value: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    mimeType: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  },
  // {
  //   "label": "RAR archive (.rar)",
  //   "value": "application/vnd.rar"
  // },
  {
    label: 'Rich Text Format (RTF) (.rtf)',
    value: 'application/msword',
    mimeType: ['application/msword'],
  },
  {
    label: 'Bourne shell script (.sh)',
    value: 'text/x-sh',
    mimeType: ['text/x-sh'],
  },
  {
    label: 'Scalable Vector Graphics (SVG) (.svg)',
    value: 'image/svg+xml',
    mimeType: ['image/svg+xml'],
  },
  {
    label: 'Small web format (SWF) or Adobe Flash document (.swf)',
    value: 'application/x-shockwave-flash',
    mimeType: ['application/x-shockwave-flash'],
  },
  {
    label: 'Tape Archive (TAR) (.tar)',
    value: 'application/x-tar',
    mimeType: ['application/x-tar', 'application/tar'],
  },
  {
    label: 'Tagged Image File Format (TIFF) (.tif .tiff)',
    value: 'image/tiff',
    mimeType: ['image/tiff'],
  },
  {
    label: 'MPEG transport stream (.ts)',
    value: 'video/vnd.dlna.mpeg-tts',
    mimeType: ['video/vnd.dlna.mpeg-tts'],
  },
  {
    label: 'Text, (generally ASCII or ISO 8859-n) (.txt)',
    value: 'text/plain',
    mimeType: ['text/plain'],
  },
  {
    label: 'Microsoft Visio (.vsd)',
    value: 'application/vnd.ms-visio.viewer',
    mimeType: ['application/vnd.ms-visio.viewer'],
  },
  {
    label: 'Waveform Audio Format (.wav)',
    value: 'audio/wav',
    mimeType: ['audio/wav', 'audio/x-wav', 'audio/wave'],
  },
  {
    label: 'WEBM audio (.weba)',
    value: 'audio/webm',
    mimeType: ['audio/webm'],
  },
  {
    label: 'WEBM video (.webm)',
    value: 'video/webm',
    mimeType: ['video/webm'],
  },
  {
    label: 'WEBP image (.webp)',
    value: 'image/webp',
    mimeType: ['image/webp'],
  },
  {
    label: 'Web Open Font Format (WOFF) (.woff)',
    value: 'application/font-woff',
    mimeType: ['application/font-woff'],
  },
  // {
  //   "label": "Web Open Font Format (WOFF) (.woff2)",
  //   "value": "font/woff2"
  // },
  {
    label: 'XHTML (.xhtml)',
    value: 'application/xhtml+xml',
    mimeType: ['application/xhtml+xml'],
  },
  {
    label: 'Microsoft Excel (.xls)',
    value: 'application/vnd.ms-excel',
    mimeType: ['application/vnd.ms-excel'],
  },
  {
    label: 'Microsoft Excel (OpenXML) (.xlsx)',
    value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    mimeType: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
  {
    label: 'XML (.xml)',
    value: 'application/xml',
    mimeType: ['application/xml', 'text/xml'],
  },
  {
    label: 'XUL (.xul)',
    value: 'application/vnd.mozilla.xul+xml',
    mimeType: ['application/vnd.mozilla.xul+xml'],
  },
  {
    label: 'ZIP archive (.zip)',
    value: 'application/zip',
    mimeType: [
      'application/zip',
      'application/x-zip-compressed',
      'application/x-zip',
      'multipart/x-zip',
    ],
  },
  {
    label: '3GPP audio/video container (.3gp)',
    value: 'video/3gpp',
    mimeType: ['video/3gpp'],
  },
  {
    label: '3GPP2 audio/video container (.3g2)',
    value: 'video/3gpp2',
    mimeType: ['video/3gpp2'],
  },
  // {
  //   "label": "7-zip archive (.7z)",
  //   "value": "application/x-7z-compressed"
  // }
  {
    label: 'FLAC audio (.flac)',
    value: 'audio/flac',
    mimeType: ['audio/flac'],
  },
  {
    label: 'QuickTime video (.mov)',
    value: 'video/quicktime',
    mimeType: ['video/quicktime'],
  },
  {
    label: 'Matroska video (.mkv)',
    value: 'video/x-matroska',
    mimeType: ['video/x-matroska'],
  },
]
