"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "manifest.json"), "utf8"));
assert.equal(manifest.applications.zotero.id, "formati-priloga@local.invalid");assert.equal(manifest.name, "Attachment Formats");
assert.equal(manifest.version, "0.1.6");assert.equal(manifest.applications.zotero.update_url, "https://raw.githubusercontent.com/Kadzo/zotero-attachment-formats/main/updates.json");
assert.equal(manifest.applications.zotero.strict_max_version, "10.0.*");

const attachments = new Map();
let options;
let removedColumn;

function attachment(id, filename, mime = "") {
  const item = {
    id,
    attachmentFilename: filename,
    attachmentContentType: mime,
    isAttachment: () => true,
    getFilename: () => filename,
  };
  attachments.set(id, item);
  return item;
}

const context = {
  Zotero: {
    locale: "sr-Latn-RS",
    debug: () => {},
    Items: { get: (id) => attachments.get(id) },
    ItemTreeManager: {
      registerColumn: async (column) => {
        options = column;
        return "attachmentFormats";
      },
      unregisterColumn: async (key) => { removedColumn = key; },
    },
  },
};

vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, "bootstrap.js"), "utf8"), context);

(async () => {
  await context.startup();
  assert.equal(options.label, "Formati");
  assert.equal(options.pluginID, "formati-priloga@local.invalid");

  for (const [locale, expected] of [
    ["sr-Latn-RS", "Formati"],
    ["sr_Latn_RS", "Formati"],
    ["sr-RS", "Формати"],
    ["sr-Cyrl-RS", "Формати"],
    ["en-US", "Formats"],
    ["fr-FR", "Formats"],
    ["ru-RU", "Форматы"],
    ["de-DE", "Formate"],
    ["es-ES", "Formatos"],
    ["it-IT", "Formati"],
    ["pt-BR", "Formatos"],
    ["nl-NL", "Bestandsformaten"],
    ["pl-PL", "Formaty"],
    ["uk-UA", "Формати"],
    ["tr-TR", "Biçimler"],
    ["cs-CZ", "Formáty"],
    ["ja-JP", "ファイル形式"],
    ["zh-CN", "文件格式"],
    ["zh-TW", "檔案格式"],
    ["ko-KR", "파일 형식"],
    ["ar", "صيغ الملفات"],
    ["xx-XX", "Formats"],
  ]) {
    assert.equal(context.columnLabelForLocale(locale), expected, locale);
    context.Zotero.locale = locale;
    await context.shutdown();
    await context.startup();
    assert.equal(options.label, expected, `startup: ${locale}`);
  }

  context.Zotero.locale = "";
  context.Services = { locale: { appLocaleAsBCP47: "fr-FR" } };
  await context.shutdown();
  await context.startup();
  assert.equal(options.label, "Formats", "Services locale fallback");

  const pdf = attachment(1, "knjiga.pdf", "application/pdf");
  const md = attachment(2, "knjiga.md", "text/markdown");
  const jpg = attachment(3, "slika.jpg", "image/jpeg");
  attachment(4, "jos-jedna.pdf", "application/pdf");
  const parent = { isAttachment: () => false, isRegularItem: () => true, getAttachments: () => [1, 2, 3, 4] };

  assert.equal(options.dataProvider(pdf), "PDF");
  assert.equal(options.dataProvider(md), "MD");
  assert.equal(options.dataProvider(jpg), "JPG");
  assert.equal(options.dataProvider(parent), "PDF (2), MD, JPG");
  assert.equal(options.dataProvider({ isAttachment: () => false, isRegularItem: () => true, getAttachments: () => [] }), "");
  assert.equal(options.dataProvider({ isAttachment: () => false, isRegularItem: () => false }), "");
  assert.equal(options.dataProvider(attachment(5, "", "application/epub+zip")), "EPUB");
  assert.equal(options.dataProvider(attachment(6, "bez-ekstenzije", "")), "");
  for (const [id, filename, expected] of [
    [7, "foto.jpeg", "JPEG"],
    [8, "foto.png", "PNG"],
    [9, "scan.tif", "TIF"],
    [10, "dokument.docx", "DOCX"],
    [11, "arhiva.tar.gz", "GZ"],
    [12, "podaci.neobicno_dug_nastavak", "NEOBICNO_DUG_NASTAVAK"],
  ]) {
    assert.equal(options.dataProvider(attachment(id, filename)), expected);
  }
  assert.equal(options.dataProvider(attachment(13, "bez-ekstenzije", "application/x-custom")), "APPLICATION/X-CUSTOM");
  assert.equal(options.dataProvider(attachment(14, "2026 - BAPI (6. septembar", "application/octet-stream")), "");
  assert.equal(options.dataProvider(attachment(15, "foto.tif", "application/octet-stream")), "TIF");

  await context.shutdown();
  assert.equal(removedColumn, "attachmentFormats");
  console.log("PASS: format display, parent aggregation, empty cases, startup/shutdown");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
