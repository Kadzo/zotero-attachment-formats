"use strict";

const PLUGIN_ID = "formati-priloga@local.invalid";
let registeredColumn = null;

// The column API takes a plain string, so select its label when Zotero starts
// the plugin. Zotero restarts plugins when the interface language is changed.
const FORMAT_LABELS = Object.freeze({
  en: "Formats",
  srLatn: "Formati",
  srCyrl: "Формати",
  fr: "Formats",
  ru: "Форматы",
  de: "Formate",
  es: "Formatos",
  it: "Formati",
  pt: "Formatos",
  nl: "Bestandsformaten",
  pl: "Formaty",
  uk: "Формати",
  tr: "Biçimler",
  cs: "Formáty",
  ja: "ファイル形式",
  zhHans: "文件格式",
  zhHant: "檔案格式",
  ko: "파일 형식",
  ar: "صيغ الملفات",
});

function columnLabelForLocale(locale) {
  const tag = String(locale || "").replace(/_/g, "-").toLowerCase();
  const language = tag.split("-")[0];
  if (language === "sr") {
    return /(?:^|-)latn(?:-|$)/.test(tag) ? FORMAT_LABELS.srLatn : FORMAT_LABELS.srCyrl;
  }
  if (language === "zh") {
    return /(?:^|-)(?:hant|tw|hk|mo)(?:-|$)/.test(tag)
      ? FORMAT_LABELS.zhHant : FORMAT_LABELS.zhHans;
  }
  return FORMAT_LABELS[language] || FORMAT_LABELS.en;
}

function interfaceLocale() {
  try {
    if (Zotero.locale) return Zotero.locale;
  } catch (error) {
    Zotero.debug("Attachment Formats: Zotero locale unavailable: " + error);
  }
  try {
    if (Services.locale.appLocaleAsBCP47) return Services.locale.appLocaleAsBCP47;
  } catch (error) {
    Zotero.debug("Attachment Formats: application locale unavailable: " + error);
  }
  return "en-US";
}

function formatForAttachment(attachment) {
  if (!attachment || !attachment.isAttachment()) {
    return "";
  }

  let filename = "";
  try {
    filename = attachment.attachmentFilename || attachment.getFilename() || "";
  } catch (error) {
    Zotero.debug("Attachment Formats: filename unavailable: " + error);
  }

  // Only the actual attachment filename determines an extension; the Zotero
  // title is independent and may merely say "PDF" or contain misleading text.
  const basename = String(filename).split(/[\\/]/).pop();
  const dot = basename.lastIndexOf(".");
  const suffix = basename.slice(dot + 1);
  // A date such as "6. septembar" is not a filename extension.
  if (dot > 0 && /^[^\s.\\/?*:"<>|]+$/u.test(suffix)) {
    return suffix.toUpperCase();
  }

  // Some older attachments have no filename but do have a content type.
  const mime = String(attachment.attachmentContentType || "").toLowerCase();
  const fallback = {
    "application/pdf": "PDF",
    "application/epub+zip": "EPUB",
    "image/jpeg": "JPG",
    "image/png": "PNG",
    "text/html": "HTML",
    "text/markdown": "MD",
  };
  return fallback[mime] || (mime && mime !== "application/octet-stream" ? mime.toUpperCase() : "");
}

function formatsForItem(item) {
  if (!item) {
    return "";
  }

  if (item.isAttachment()) {
    return formatForAttachment(item);
  }

  if (!item.isRegularItem()) {
    return "";
  }

  const counts = new Map();
  for (const id of item.getAttachments()) {
    const attachment = Zotero.Items.get(id);
    const format = formatForAttachment(attachment);
    if (format) {
      counts.set(format, (counts.get(format) || 0) + 1);
    }
  }

  return [...counts].map(([format, count]) =>
    count > 1 ? `${format} (${count})` : format
  ).join(", ");
}

function install() {}

async function startup() {
  registeredColumn = await Zotero.ItemTreeManager.registerColumn({
    dataKey: "attachmentFormats",
    label: columnLabelForLocale(interfaceLocale()),
    pluginID: PLUGIN_ID,
    dataProvider: (item) => {
      try {
        return formatsForItem(item);
      } catch (error) {
        Zotero.debug("Attachment Formats: column error: " + error);
        return "";
      }
    },
  });
}

async function shutdown() {
  if (registeredColumn) {
    await Zotero.ItemTreeManager.unregisterColumn(registeredColumn);
    registeredColumn = null;
  }
}

function uninstall() {}
