package manager



var mimes = `[
  {
    "mimeType": "audio/aac",
    "Extension": ".aac"
  },
  {
    "mimeType": "application/x-abiword",
    "Extension": ".abw"
  },
  {
    "mimeType": "application/octet-stream",
    "Extension": ".arc"
  },
  {
    "mimeType": "video/x-msvideo",
    "Extension": ".avi"
  },
  {
    "mimeType": "application/vnd.amazon.ebook",
    "Extension": ".azw"
  },
  {
    "mimeType": "application/octet-stream",
    "Extension": ".bin"
  },
  {
    "mimeType": "application/x-bzip",
    "Extension": ".bz"
  },
  {
    "mimeType": "application/x-bzip2",
    "Extension": ".bz2"
  },
  {
    "mimeType": "application/x-csh",
    "Extension": ".csh"
  },
  {
    "mimeType": "text/css",
    "Extension": ".css"
  },
  {
    "mimeType": "text/csv",
    "Extension": ".csv"
  },
  {
    "mimeType": "application/msword",
    "Extension": ".doc"
  },
  {
    "mimeType": "application/epub+zip",
    "Extension": ".epub"
  },
  {
    "mimeType": "image/gif",
    "Extension": ".gif"
  },
  {
    "mimeType": "",
    "Extension": ".htm"
  },
  {
    "mimeType": "text/html",
    "Extension": ".html"
  },
  {
    "mimeType": "image/x-icon",
    "Extension": ".ico"
  },
  {
    "mimeType": "text/calendar",
    "Extension": ".ics"
  },
  {
    "mimeType": "application/java-archive",
    "Extension": ".jar"
  },
  {
    "mimeType": "",
    "Extension": ".jpeg"
  },
  {
    "mimeType": "image/jpeg",
    "Extension": ".jpg"
  },
  {
    "mimeType": "application/javascript",
    "Extension": ".js"
  },
  {
    "mimeType": "application/json",
    "Extension": ".json"
  },
  {
    "mimeType": "",
    "Extension": ".mid"
  },
  {
    "mimeType": "audio/midi",
    "Extension": ".midi"
  },
  {
    "mimeType": "video/mpeg",
    "Extension": ".mpeg"
  },
  {
    "mimeType": "application/vnd.apple.installer+xml",
    "Extension": ".mpkg"
  },
  {
    "mimeType": "application/vnd.oasis.opendocument.presentation",
    "Extension": ".odp"
  },
  {
    "mimeType": "application/vnd.oasis.opendocument.spreadsheet",
    "Extension": ".ods"
  },
  {
    "mimeType": "application/vnd.oasis.opendocument.text",
    "Extension": ".odt"
  },
  {
    "mimeType": "audio/ogg",
    "Extension": ".oga"
  },
  {
    "mimeType": "video/ogg",
    "Extension": ".ogv"
  },
  {
    "mimeType": "application/ogg",
    "Extension": ".ogx"
  },
  {
    "mimeType": "application/pdf",
    "Extension": ".pdf"
  },
  {
    "mimeType": "application/vnd.ms-powerpoint",
    "Extension": ".ppt"
  },
  {
    "mimeType": "application/x-rar-compressed",
    "Extension": ".rar"
  },
  {
    "mimeType": "application/rtf",
    "Extension": ".rtf"
  },
  {
    "mimeType": "application/x-sh",
    "Extension": ".sh"
  },
  {
    "mimeType": "image/svg+xml",
    "Extension": ".svg"
  },
  {
    "mimeType": "application/x-shockwave-flash",
    "Extension": ".swf"
  },
  {
    "mimeType": "application/x-tar",
    "Extension": ".tar"
  },
  {
    "mimeType": "",
    "Extension": ".tif"
  },
  {
    "mimeType": "image/tiff",
    "Extension": ".tiff"
  },
  {
    "mimeType": "font/ttf",
    "Extension": ".ttf"
  },
  {
    "mimeType": "application/vnd.visio",
    "Extension": ".vsd"
  },
  {
    "mimeType": "audio/x-wav",
    "Extension": ".wav"
  },
  {
    "mimeType": "audio/webm",
    "Extension": ".weba"
  },
  {
    "mimeType": "video/webm",
    "Extension": ".webm"
  },
  {
    "mimeType": "image/webp",
    "Extension": ".webp"
  },
  {
    "mimeType": "font/woff",
    "Extension": ".woff"
  },
  {
    "mimeType": "font/woff2",
    "Extension": ".woff2"
  },
  {
    "mimeType": "application/xhtml+xml",
    "Extension": ".xhtml"
  },
  {
    "mimeType": "application/vnd.ms-excel",
    "Extension": ".xls"
  },
  {
    "mimeType": "application/xml",
    "Extension": ".xml"
  },
  {
    "mimeType": "application/vnd.mozilla.xul+xml",
    "Extension": ".xul"
  },
  {
    "mimeType": "application/zip",
    "Extension": ".zip"
  },
  {
    "mimeType": "video/3gpp",
    "Extension": ".3gp"
  },
  {
    "mimeType": "",
    "Extension": "audio/3gpp if it doesn't contain video"
  },
  {
    "mimeType": "video/3gpp2",
    "Extension": ".3g2"
  },
  {
    "mimeType": "",
    "Extension": "audio/3gpp2 if it doesn't contain video"
  },
  {
    "mimeType": "application/x-7z-compressed",
    "Extension": ".7z"
  }
]`

type Mimes struct {
	MimeType  string `json:"mimeType"`
	Extension string `json:"Extension"`
}
