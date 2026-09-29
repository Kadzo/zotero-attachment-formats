# Attachment Formats for Zotero 10

Attachment Formats adds a column to Zotero's item list showing the file extensions of attachments. English is the default language; the column label follows Zotero's interface language when the plugin starts. Unsupported languages fall back to **Formats**.

## What is it for?

In a large library, a title alone does not tell you whether an item has a PDF, an image, a Word document, several files, or no attachment. This plugin displays that information directly in the item list without opening each item. It does not convert files or change citation formats.

For example, an item with two PDFs and one image displays `PDF (2), JPG`; an attached `report.docx` displays `DOCX`; an item without files displays an empty cell. Counts represent files, not pages. This display-only plugin does not change your library data or attachments.

## Install and use

Download **attachment-formats-0.1.6.xpi** from the [v0.1.6 release](https://github.com/Kadzo/zotero-attachment-formats/releases/tag/v0.1.6). In Zotero 10, choose Tools → Plugins → gear icon → Install Plugin From File, then restart if prompted. Right-click the item-list header and enable **Formats** (or its translated label). You can move or resize the column normally. Zotero 11 or later has not been tested.

**Do not install version 0.1.5.** Its XPI was missing the `update_url` manifest field and Zotero rejected it. Version 0.1.6 restores the field and has been installed successfully in Zotero 10.0.3. The add-on ID remains `formati-priloga@local.invalid`, allowing existing 0.1.4 installations to upgrade without creating a duplicate.

The label is translated for Serbian (Latin and Cyrillic), French, Russian, German, Spanish, Italian, Portuguese, Dutch, Polish, Ukrainian, Turkish, Czech, Japanese, Chinese (simplified and traditional), Korean, and Arabic. The name and description in the Plugins Manager remain in English because Zotero reads those from the manifest. Restart Zotero after changing its interface language.

The column uses file extensions including PDF, JPG, TIF, DOCX and ZIP; where a file has no extension, it uses a known file type or MIME type if available. Removing the add-on removes only this column, not any library data.

Source files are `manifest.json` and `bootstrap.js`; `updates.json` lists the current release for future automatic updates. Run `node test.js` for the local regression test. Licensed under MIT; see `LICENSE`.
