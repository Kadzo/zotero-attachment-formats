# Attachment Formats for Zotero 10

Attachment Formats adds a column to Zotero's item list showing the file
extensions of attachments. The default language is English. The column label
follows Zotero's interface language when the plugin starts; unsupported
languages fall back to **Formats**.

## What is it for?

In a large library, a title alone does not tell you whether the item has a
PDF, an image, a Word document, several different files, or no file at all.
This plugin lets you see that information directly in the main item list,
without expanding every item or opening its attachments. You can use the
column to spot missing PDFs, identify mixed file types, and quickly find
items with multiple copies of the same format. It does not convert files or
change the citation format; **Formats** refers to attachment file types.

For example, a journal article with two PDFs and one image displays
`PDF (2), JPG`; an attached `report.docx` displays `DOCX`; an item with no
files displays an empty cell. The counts represent files, not pages.

## How to use it

1. Install the XPI and restart Zotero if prompted.
2. In the main library view, right-click the header row above the item list.
3. Enable **Formats** (or the translated label matching your Zotero language).
4. Move or resize the column like other Zotero columns. No configuration is
   needed, and the values update from the item's current attachments.

This is a display-only aid. The Zotero library and its attachments remain
unchanged even if you disable or uninstall the plugin.

The additional column translations cover Serbian (Latin and Cyrillic), French,
Russian, German, Spanish, Italian, Portuguese, Dutch, Polish, Ukrainian,
Turkish, Czech, Japanese, Chinese (simplified and traditional), Korean, and
Arabic. The plugin's name and description in Zotero's plugin manager remain
in English because Zotero reads those from the manifest separately from the
column label. Restart Zotero after changing its interface language.

- Parent items show distinct extensions with counts, such as `PDF (2), JPG`.
- Individual file attachments show their extension, such as `PDF`.
- Notes and items without files have an empty cell.

The plugin reads Zotero data but does not change your database, files, titles,
attachments, paths, or synchronization settings. Removing it removes only the
column. It works with any extension, including `JPG`, `TIF`, `DOCX`, and `ZIP`.
For files without an extension, it uses a known file type or MIME type where
available.

Tested with Zotero 10.0.3. Install the `attachment-formats-0.1.5.xpi` file via
**Tools → Plugins → gear icon → Install Plugin From File**. If the column is not
visible, right-click the item-list header and enable **Formats**. Zotero 11 or
later needs a separate compatibility test.

The add-on ID remains `formati-priloga@local.invalid` so an existing local
0.1.4 installation can be upgraded manually without creating a duplicate.
There is no automatic update URL; download new releases from this repository.

Run the local regression test with `node test.js`. Source files for the XPI
are `manifest.json` and `bootstrap.js`. Licensed under MIT; see `LICENSE`.
