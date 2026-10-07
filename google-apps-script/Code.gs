/**
 * Google Apps Script - Crown Daily Indicators
 *
 * DEPLOYMENT SETTINGS:
 * - Execute as: Me
 * - Who has access: Anyone
 *
 * STRUKTUR KOLOM submissions (update header row di spreadsheet!):
 * A:id | B:branchId | C:userNik | D:userName | E:date | F:createdAt | G:totalScore
 * H:sales | I:trx | J:basket | K:wa_personal | L:no_baru | M:after_sales
 * N:proteksi | O:google_review | P:mgb | Q:photos | R:notes
 */

const SPREADSHEET_ID = '1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0';
const A321_SPREADSHEET_ID = '1xTtYV1ZnDllfMEXt7DsrOcUwVGkdtWOO_zyVGQi1qiQ';
const A321_SALES_SOURCE_SPREADSHEET_ID = '1mNGKDPFNnF1Ca0CtNzyriwTE8zjuwdJei0RafXxna38';

function spreadsheetIdForBranch(branchId) {
  return branchId === 'A321' ? A321_SPREADSHEET_ID : SPREADSHEET_ID;
}

// Opsional: isi dengan ID folder Google Drive untuk simpan foto sebagai URL
// Kosongkan ('') jika tidak pakai → foto tidak disimpan (tapi data tetap tersimpan)
const GDRIVE_FOLDER_ID = '';
const A321_PHOTO_FOLDER_PROPERTY = 'A321_PHOTO_FOLDER_ID';

// Urutan indikator (sesuai urutan kolom H-P di spreadsheet)
var INDICATOR_ORDER = ['sales', 'trx', 'basket', 'wa_personal', 'no_baru', 'after_sales', 'proteksi', 'google_review', 'mgb'];

// ─── Helper: ekstrak nilai per indikator dari data submission ─────────────────
function extractIndicatorValues(data) {
  var values = {};
  if (!data) return values;

  if (Array.isArray(data)) {
    // Format: [{id:'sales', value:6408950}, ...]
    for (var i = 0; i < data.length; i++) {
      var ind = data[i];
      if (ind && ind.id) {
        values[ind.id] = ind.value != null ? ind.value : 0;
      }
    }
  } else if (typeof data === 'object') {
    // Format: {sales: {value:6408950}, ...} atau {sales: 6408950, ...}
    var keys = Object.keys(data);
    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      var v = data[key];
      values[key] = (v && typeof v === 'object') ? (v.value != null ? v.value : 0) : (v != null ? v : 0);
    }
  }
  return values;
}

// ─── Helper: upload base64 ke Google Drive, kembalikan URL ───────────────────
function getA321PhotoFolder() {
  var properties = PropertiesService.getScriptProperties();
  var folderId = properties.getProperty(A321_PHOTO_FOLDER_PROPERTY);
  if (folderId) {
    try {
      return DriveApp.getFolderById(folderId);
    } catch (error) {
      properties.deleteProperty(A321_PHOTO_FOLDER_PROPERTY);
    }
  }

  var folder = DriveApp.createFolder('CROWN A321 Submission Photos');
  properties.setProperty(A321_PHOTO_FOLDER_PROPERTY, folder.getId());
  return folder;
}

function uploadBase64ToDrive(base64Data, filename, branchId, targetFolder) {
  try {
    var parts = base64Data.split(',');
    if (parts.length < 2) return null;
    var mimeType = parts[0].split(';')[0].split(':')[1] || 'image/jpeg';
    var extension = mimeType === 'image/png' ? 'png' : 'jpg';
    var fileName = filename + '.' + extension;
    var bytes = Utilities.base64Decode(parts[1]);
    var blob = Utilities.newBlob(bytes, mimeType, fileName);
    var folder = targetFolder || (branchId === 'A321'
      ? getA321PhotoFolder()
      : GDRIVE_FOLDER_ID ? DriveApp.getFolderById(GDRIVE_FOLDER_ID) : null);
    if (!folder) return null;

    var existingFiles = folder.getFilesByName(fileName);
    if (existingFiles.hasNext()) {
      var existingFile = existingFiles.next();
      return 'https://drive.google.com/uc?export=view&id=' + existingFile.getId();
    }

    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return 'https://drive.google.com/uc?export=view&id=' + file.getId();
  } catch (e) {
    Logger.log('Drive upload error: ' + e.toString());
    return null;
  }
}

// ─── Helper: konversi foto ke URL Drive (strip base64) ───────────────────────
function processPhotos(photos, submissionId, branchId) {
  if (!photos || typeof photos !== 'object') return '';
  var urlMap = {};
  var keys = Object.keys(photos);
  var targetFolder = null;
  for (var ki = 0; ki < keys.length; ki++) {
    var indicatorId = keys[ki];
    var photoList = photos[indicatorId];
    if (!Array.isArray(photoList) || photoList.length === 0) continue;
    var urls = [];
    for (var i = 0; i < photoList.length; i++) {
      var photo = photoList[i];
      if (typeof photo !== 'string') continue;
      if (photo.startsWith('http')) {
        urls.push(photo);
      } else if (photo.startsWith('data:') && (GDRIVE_FOLDER_ID || branchId === 'A321')) {
        if (!targetFolder) {
          targetFolder = branchId === 'A321'
            ? getA321PhotoFolder()
            : DriveApp.getFolderById(GDRIVE_FOLDER_ID);
        }
        var url = uploadBase64ToDrive(photo, submissionId + '_' + indicatorId + '_' + i, branchId, targetFolder);
        if (url) urls.push(url);
        else throw new Error('Gagal menyimpan foto ' + indicatorId + ' ke Google Drive');
      }
      // base64 tanpa Drive → diabaikan (terlalu besar)
    }
    if (urls.length > 0) urlMap[indicatorId] = urls;
  }
  return Object.keys(urlMap).length > 0 ? JSON.stringify(urlMap) : '';
}

// ─── doGet ────────────────────────────────────────────────────────────────────
function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'getA321UserByNik') {
    try {
      var user = getA321UserByNik(e.parameter.nik);
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, data: user }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (e && e.parameter && e.parameter.action === 'getA321PhotoData') {
    try {
      var imageDataUrl = getA321PhotoDataUrl(e.parameter.fileId);
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, data: { dataUrl: imageDataUrl } }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (e && e.parameter && e.parameter.action === 'getA321DailyMetrics') {
    try {
      var metrics = getA321DailyMetrics(e.parameter.nik, e.parameter.date);
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, data: metrics }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Crown Daily Indicators API is running!',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getA321PhotoDataUrl(fileId) {
  if (!fileId) throw new Error('File ID foto tidak diberikan');

  var file = DriveApp.getFileById(fileId);
  var allowedFolderId = getA321PhotoFolder().getId();
  var parents = file.getParents();
  var isA321Photo = false;
  while (parents.hasNext()) {
    if (parents.next().getId() === allowedFolderId) {
      isA321Photo = true;
      break;
    }
  }
  if (!isA321Photo) throw new Error('Foto tidak termasuk folder submission A321');

  var blob = file.getBlob();
  var mimeType = blob.getContentType() || 'image/jpeg';
  return 'data:' + mimeType + ';base64,' + Utilities.base64Encode(blob.getBytes());
}

function normalizeA321Date(value, timeZone) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, timeZone, 'yyyy-MM-dd');
  }

  var text = String(value == null ? '' : value).trim();
  if (!text) return '';

  var isoDate = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoDate) {
    return isoDate[1] + '-' + ('0' + isoDate[2]).slice(-2) + '-' + ('0' + isoDate[3]).slice(-2);
  }

  var localDate = text.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})(?:\s|$)/);
  if (localDate) {
    return localDate[3] + '-' + ('0' + localDate[2]).slice(-2) + '-' + ('0' + localDate[1]).slice(-2);
  }

  var parsedDate = new Date(text);
  return !isNaN(parsedDate.getTime())
    ? Utilities.formatDate(parsedDate, timeZone, 'yyyy-MM-dd')
    : '';
}

function parseA321Amount(value) {
  if (typeof value === 'number') return isFinite(value) ? value : 0;

  var text = String(value == null ? '' : value).trim().replace(/[^\d,.-]/g, '');
  if (!text) return 0;

  var commaIndex = text.lastIndexOf(',');
  var dotIndex = text.lastIndexOf('.');
  if (commaIndex >= 0 && dotIndex >= 0) {
    text = commaIndex > dotIndex
      ? text.replace(/\./g, '').replace(',', '.')
      : text.replace(/,/g, '');
  } else if (commaIndex >= 0) {
    var commaParts = text.split(',');
    text = commaParts[commaParts.length - 1].length === 3
      ? commaParts.join('')
      : text.replace(',', '.');
  } else if (dotIndex >= 0) {
    var dotParts = text.split('.');
    if (dotParts.length > 2 || dotParts[dotParts.length - 1].length === 3) {
      text = dotParts.join('');
    }
  }

  var amount = Number(text);
  return isFinite(amount) ? amount : 0;
}

function getA321JobTitle(userSheet, nik) {
  var lastRow = userSheet.getLastRow();
  if (lastRow < 2) throw new Error('Data NIK tidak ditemukan di sheet User');

  var rows = userSheet.getRange(2, 1, lastRow - 1, 4).getDisplayValues();
  for (var i = 0; i < rows.length; i++) {
    var userNik = String(rows[i][0] == null ? '' : rows[i][0]).trim().replace(/\.0$/, '');
    if (userNik === nik) {
      var jobTitle = String(rows[i][3] == null ? '' : rows[i][3]).trim();
      if (jobTitle) return jobTitle;
      throw new Error('Job title untuk NIK ' + nik + ' belum diisi di sheet User kolom D');
    }
  }
  throw new Error('NIK ' + nik + ' tidak ditemukan di sheet User kolom A');
}

function getA321UserByNik(nik) {
  var normalizedNik = String(nik == null ? '' : nik).trim().replace(/\.0$/, '');
  if (!normalizedNik) throw new Error('NIK tidak boleh kosong');

  var source = SpreadsheetApp.openById(A321_SALES_SOURCE_SPREADSHEET_ID);
  var userSheet = source.getSheetByName('User') || source.getSheetByName('Users');
  if (!userSheet) throw new Error('Sheet User tidak ditemukan');

  var lastRow = userSheet.getLastRow();
  if (lastRow < 2) throw new Error('Data NIK tidak ditemukan di sheet User');
  var users = userSheet.getRange(2, 1, lastRow - 1, 4).getDisplayValues();
  for (var i = 0; i < users.length; i++) {
    var userNik = String(users[i][0] == null ? '' : users[i][0]).trim().replace(/\.0$/, '');
    if (userNik === normalizedNik) {
      var name = String(users[i][1] == null ? '' : users[i][1]).trim();
      if (!name) throw new Error('Nama untuk NIK ' + normalizedNik + ' belum diisi di User kolom B');
      return {
        nik: normalizedNik,
        name: name,
        jobTitle: String(users[i][3] == null ? '' : users[i][3]).trim()
      };
    }
  }
  throw new Error('NIK ' + normalizedNik + ' tidak ditemukan di User kolom A');
}

function getA321DailyMetrics(nik, requestedDate) {
  var normalizedNik = String(nik == null ? '' : nik).trim().replace(/\.0$/, '');
  var dateKey = String(requestedDate == null ? '' : requestedDate).trim();
  if (!normalizedNik || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    throw new Error('NIK atau tanggal tidak valid');
  }

  var source = SpreadsheetApp.openById(A321_SALES_SOURCE_SPREADSHEET_ID);
  var copasSheet = source.getSheetByName('COPAS S2');
  var targetSheet = source.getSheetByName('TARGET');
  var userSheet = source.getSheetByName('User') || source.getSheetByName('Users');
  if (!copasSheet) throw new Error('Sheet COPAS S2 tidak ditemukan');
  if (!targetSheet) throw new Error('Sheet TARGET tidak ditemukan');
  if (!userSheet) throw new Error('Sheet User tidak ditemukan');
  var jobTitle = getA321JobTitle(userSheet, normalizedNik);

  var timeZone = source.getSpreadsheetTimeZone() || 'Asia/Jakarta';
  var sales = 0;
  var protection = 0;
  var instantUpgrade = 0;
  var receipts = {};
  var copasLastRow = copasSheet.getLastRow();

  if (copasLastRow > 1) {
    var copasRange = copasSheet.getRange(2, 1, copasLastRow - 1, 14);
    var rows = copasRange.getDisplayValues();
    var rawRows = copasRange.getValues();
    var protectedItemNumbers = {
      '70123983': true,
      '70123984': true,
      '70123985': true
    };

    rows.forEach(function(row, rowIndex) {
      var rawRow = rawRows[rowIndex];
      var rowNik = String(row[0] == null ? '' : row[0]).trim().replace(/\.0$/, '');
      var sourceDate = rawRow[13] instanceof Date ? rawRow[13] : row[13];
      if (rowNik !== normalizedNik || normalizeA321Date(sourceDate, timeZone) !== dateKey) return;

      sales += parseA321Amount(rawRow[11] === '' ? row[11] : rawRow[11]);

      var receipt = String(row[3] == null ? '' : row[3]).trim();
      if (receipt) receipts[receipt] = true;

      var itemNumber = String(row[4] == null ? '' : row[4]).trim().replace(/\.0$/, '');
      if (protectedItemNumbers[itemNumber]) {
        protection += parseA321Amount(rawRow[7] === '' ? row[7] : rawRow[7]);
      }
      if (itemNumber === '70118152') {
        instantUpgrade += parseA321Amount(rawRow[7] === '' ? row[7] : rawRow[7]);
      }
    });
  }

  var targetSales = null;
  var targetLastRow = targetSheet.getLastRow();
  if (targetLastRow > 1) {
    var targetRange = targetSheet.getRange(2, 1, targetLastRow - 1, 3);
    var targets = targetRange.getDisplayValues();
    var rawTargets = targetRange.getValues();
    for (var i = 0; i < targets.length; i++) {
      var targetNik = String(targets[i][0] == null ? '' : targets[i][0]).trim().replace(/\.0$/, '');
      if (targetNik === normalizedNik) {
        targetSales = Math.floor(parseA321Amount(rawTargets[i][2] === '' ? targets[i][2] : rawTargets[i][2]));
        break;
      }
    }
  }
  if (targetSales === null) throw new Error('Target Sales untuk NIK ' + normalizedNik + ' tidak ditemukan');

  return {
    sales: sales,
    trx: Object.keys(receipts).length,
    proteksi: protection,
    instantUpgrade: instantUpgrade,
    jobTitle: jobTitle,
    targetSales: targetSales
  };
}

function normalizeA321IndicatorId(value) {
  return String(value == null ? '' : value).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getA321IndicatorEntry(data, aliases) {
  var aliasSet = {};
  aliases.forEach(function(alias) { aliasSet[normalizeA321IndicatorId(alias)] = true; });

  if (Array.isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      if (item && aliasSet[normalizeA321IndicatorId(item.id)]) return item;
    }
    return null;
  }

  if (data && typeof data === 'object') {
    var keys = Object.keys(data);
    for (var k = 0; k < keys.length; k++) {
      if (aliasSet[normalizeA321IndicatorId(keys[k])]) return data[keys[k]];
    }
  }
  return null;
}

function getA321IndicatorValue(data, aliases) {
  var entry = getA321IndicatorEntry(data, aliases);
  if (entry == null) return '';
  if (typeof entry !== 'object') return entry;
  if (entry.value != null) return entry.value;
  if (entry.textValue != null) return entry.textValue;
  if (entry.dropdownValue != null) return entry.dropdownValue;
  if (entry.checkboxValue != null) return entry.checkboxValue;
  return '';
}

function getA321PhotoLabel(indicatorId) {
  var labels = {
    sales: 'Sales',
    trx: 'TRX',
    transaksi: 'TRX',
    basket: 'Basket Size',
    basketsize: 'Basket Size',
    proteksi: 'Proteksi',
    instantupgrade: 'Instant Upgrade',
    newmember: 'New Member',
    wa: 'WA Personal',
    wapersonal: 'WA Personal',
    nobaru: 'No Baru Customer',
    nobarucustomer: 'No Baru Customer',
    googlereview: 'Google Review',
    mgb: 'MGB'
  };
  var normalizedId = normalizeA321IndicatorId(indicatorId);
  return labels[normalizedId] || String(indicatorId).replace(/[_-]+/g, ' ');
}

function getA321ResultPhotoFields(photos) {
  var fields = [];
  if (!photos || typeof photos !== 'object') return fields;

  Object.keys(photos).forEach(function(indicatorId) {
    var photoList = photos[indicatorId];
    if (!Array.isArray(photoList)) return;
    var label = getA321PhotoLabel(indicatorId);
    photoList.forEach(function(photo, photoIndex) {
      fields.push({
        indicatorId: indicatorId,
        photoIndex: photoIndex,
        header: label + ' Foto ' + (photoIndex + 1),
        data: photo
      });
    });
  });
  return fields;
}

function ensureA321ResultSheet(spreadsheet, photoHeaders) {
  var baseHeaders = [
    'Tanggal', 'Waktu Submit', 'NIK', 'Nama', 'Job Title',
    'Sales', 'TRX', 'Basket Size', 'Proteksi', 'Instant Upgrade',
    'New Member', 'WA Personal', 'No Baru Customer', 'Google Review', 'VOC',
    'Kendala Hari Ini', 'Komitmen untuk Besok'
  ];
  var headers = baseHeaders.concat(photoHeaders || [], ['Submission ID']);
  var sheet = spreadsheet.getSheetByName('RESULT') || spreadsheet.insertSheet('RESULT');
  var lastColumn = sheet.getLastColumn();

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  } else {
    if (lastColumn === 0) throw new Error('Sheet RESULT berisi data tanpa header');
    var existingHeaders = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
    if (existingHeaders.every(function(header) { return !String(header).trim(); })) {
      throw new Error('Sheet RESULT berisi data tanpa header');
    }

    var newHeaders = headers.filter(function(header) { return existingHeaders.indexOf(header) < 0; });
    if (newHeaders.length > 0) {
      var requiredLastColumn = lastColumn + newHeaders.length;
      if (requiredLastColumn > sheet.getMaxColumns()) {
        sheet.insertColumnsAfter(sheet.getMaxColumns(), requiredLastColumn - sheet.getMaxColumns());
      }
      sheet.getRange(1, lastColumn + 1, 1, newHeaders.length).setValues([newHeaders]);
    }
  }

  var mgbColumn = 26;
  if (sheet.getMaxColumns() < mgbColumn) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), mgbColumn - sheet.getMaxColumns());
  }
  var mgbHeaderCell = sheet.getRange(1, mgbColumn);
  var mgbHeader = String(mgbHeaderCell.getDisplayValue() || '').trim();
  if (mgbHeader && mgbHeader !== 'Keterangan MGB') {
    throw new Error('Kolom Z pada sheet RESULT sudah digunakan (' + mgbHeader + '), data tidak ditimpa.');
  }
  if (!mgbHeader) {
    var resultLastRow = sheet.getLastRow();
    if (resultLastRow > 1) {
      var existingMgbColumnData = sheet.getRange(2, mgbColumn, resultLastRow - 1, 1).getDisplayValues();
      if (existingMgbColumnData.some(function(row) { return String(row[0] || '').trim() !== ''; })) {
        throw new Error('Kolom Z pada sheet RESULT berisi data lama tanpa header, data tidak ditimpa.');
      }
    }
    mgbHeaderCell.setValue('Keterangan MGB');
  }

  var resultHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), mgbColumn)).getDisplayValues()[0];
  return { sheet: sheet, headers: resultHeaders };
}

function blobFromA321DataUrl(dataUrl, filename) {
  if (typeof dataUrl !== 'string' || dataUrl.indexOf('data:') !== 0) return null;
  var parts = dataUrl.split(',');
  if (parts.length < 2) return null;
  var mimeMatch = parts[0].match(/^data:([^;]+)/);
  var mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  return Utilities.newBlob(Utilities.base64Decode(parts[1]), mimeType, filename);
}

function appendA321Result(submission, photoUrls) {
  var spreadsheet = SpreadsheetApp.openById(A321_SPREADSHEET_ID);
  var photos = photoUrls || {};
  var photoFields = getA321ResultPhotoFields(photos);
  var photoHeaders = photoFields.map(function(field) { return field.header; });
  var result = ensureA321ResultSheet(spreadsheet, photoHeaders);
  var sheet = result.sheet;
  var headers = result.headers;
  var submissionIdColumn = headers.indexOf('Submission ID') + 1;

  if (submissionIdColumn > 0 && sheet.getLastRow() > 1) {
    var existingIds = sheet.getRange(2, submissionIdColumn, sheet.getLastRow() - 1, 1).getDisplayValues();
    if (existingIds.some(function(row) { return row[0] === submission.id; })) return;
  }

  var sourceSpreadsheet = SpreadsheetApp.openById(A321_SALES_SOURCE_SPREADSHEET_ID);
  var userSheet = sourceSpreadsheet.getSheetByName('User') || sourceSpreadsheet.getSheetByName('Users');
  var jobTitle = getA321JobTitle(userSheet, submission.user ? submission.user.nik : '');
  var valuesByHeader = {
    'Tanggal': submission.date || '',
    'Waktu Submit': submission.createdAt || '',
    'NIK': submission.user ? submission.user.nik || '' : '',
    'Nama': submission.user ? submission.user.nama || '' : '',
    'Job Title': jobTitle,
    'Sales': getA321IndicatorValue(submission.data, ['sales']),
    'TRX': getA321IndicatorValue(submission.data, ['trx', 'transaksi', 'transaction']),
    'Basket Size': getA321IndicatorValue(submission.data, ['basket', 'basketsize']),
    'Proteksi': getA321IndicatorValue(submission.data, ['proteksi']),
    'Instant Upgrade': getA321IndicatorValue(submission.data, ['instantupgrade', 'instant_upgrade']),
    'New Member': getA321IndicatorValue(submission.data, ['newmember', 'new_member']),
    'WA Personal': getA321IndicatorValue(submission.data, ['wa', 'wapersonal', 'whatsappersonal']),
    'No Baru Customer': getA321IndicatorValue(submission.data, ['nobaru', 'nobarucustomer']),
    'Google Review': getA321IndicatorValue(submission.data, ['googlereview', 'google_review']),
    'VOC': getA321IndicatorValue(submission.data, ['voc']),
    'Kendala Hari Ini': getA321IndicatorValue(submission.data, ['kendala', 'kendalahariini', 'kendala_hari_ini']),
    'Komitmen untuk Besok': getA321IndicatorValue(submission.data, ['komitmen', 'komitmenbesok', 'komitmen_besok']),
    'Submission ID': submission.id || ''
  };

  var row = new Array(headers.length).fill('');
  headers.forEach(function(header, index) {
    if (Object.prototype.hasOwnProperty.call(valuesByHeader, header)) row[index] = valuesByHeader[header];
  });
  row[25] = getA321IndicatorValue(submission.data, ['mgb']);
  photoFields.forEach(function(field) {
    var photoHeaderIndex = headers.indexOf(field.header);
    if (photoHeaderIndex >= 0) row[photoHeaderIndex] = '';
  });

  var rowNumber = sheet.getLastRow() + 1;
  sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
  sheet.setRowHeight(rowNumber, 110);

  photoFields.forEach(function(field) {
    var photoColumn = headers.indexOf(field.header) + 1;
    if (photoColumn < 1) return;
    sheet.setColumnWidth(photoColumn, 125);
    if (typeof field.data !== 'string' || !/^https?:\/\//i.test(field.data)) return;
    var cellImage = SpreadsheetApp.newCellImage()
      .setSourceUrl(field.data)
      .setAltTextTitle(field.header)
      .setAltTextDescription('Submission ' + submission.id + ', indikator ' + field.indicatorId)
      .build();
    sheet.getRange(rowNumber, photoColumn).setValue(cellImage);
  });
}

// ─── doPost ───────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var action = params.action;
    if (!action) throw new Error('Missing "action"');

    var result;
    switch (action) {
      case 'addSubmission':
        if (!params.data) throw new Error('Missing "data"');
        result = addSubmission(params.data);
        break;
      case 'updateSettings':
        result = updateSettings(params.data);
        break;
      case 'deleteSubmission':
        result = deleteSubmission(params.data);
        break;
      case 'updateBranchAdmin':
        result = updateBranchAdmin(params.data);
        break;
      default:
        throw new Error('Invalid action: ' + action);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: result, timestamp: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('doPost error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString(), timestamp: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── addSubmission ────────────────────────────────────────────────────────────
/**
 * Menyimpan submission dengan SATU NILAI PER KOLOM.
 *
 * Kolom H–P = nilai tiap indikator (angka kecil, max ~10 karakter per cell)
 * Kolom Q   = foto (URL Drive saja, max ~100 karakter per foto)
 * Kolom R   = notes
 *
 * Tidak ada lagi JSON besar di satu cell!
 */
function ensureA321Sheet(ss, name, headers, rows) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    var blankSheet = ss.getSheets().filter(function(existing) {
      return existing.getName() === 'Sheet1' && existing.getLastRow() === 0;
    })[0];
    sheet = blankSheet || ss.insertSheet();
    sheet.setName(name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
  }
  return sheet;
}

function setupA321Spreadsheet() {
  var target = SpreadsheetApp.openById(A321_SPREADSHEET_ID);
  var createdAt = new Date().toISOString();
  var sourceIndicators = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('indicators');
  if (!sourceIndicators) throw new Error('Source sheet "indicators" not found');

  var sourceValues = sourceIndicators.getDataRange().getValues();
  var indicatorHeaders = sourceValues[0];
  var branchIndex = indicatorHeaders.indexOf('branchId');
  var roleIndex = indicatorHeaders.indexOf('role');
  if (branchIndex < 0) throw new Error('Source indicators are missing the branchId column');

  var indicatorRows = sourceValues.slice(1)
    .filter(function(row) {
      return row[branchIndex] === 'TEMPLATE' && (roleIndex < 0 || row[roleIndex] === 'Advisor');
    })
    .map(function(row) {
      var copy = row.slice();
      copy[branchIndex] = 'A321';
      return copy;
    });
  if (indicatorRows.length === 0) throw new Error('No Advisor template indicators found');

  ensureA321Sheet(target, 'branches',
    ['id', 'nik', 'name', 'displayName', 'adminName', 'createdAt', 'lastNameChange', 'logo'],
    [['A321', 'A321', 'Toko A321', 'Toko A321', 'Manager A321', createdAt, '', '']]);
  ensureA321Sheet(target, 'indicators', indicatorHeaders, indicatorRows);
  ensureA321Sheet(target, 'settings',
    ['branchId', 'loginTitle', 'loginSubtitle', 'minScore', 'createdAt', 'updatedAt'],
    [['A321', 'CROWN DAILY INDICATORS', 'Silakan masuk dengan NIK dan Nama Anda', 80, createdAt, createdAt]]);
  ensureA321Sheet(target, 'submissions',
    ['id', 'branchId', 'userNik', 'userName', 'date', 'createdAt', 'totalScore', 'sales', 'trx', 'basket', 'wa_personal', 'no_baru', 'after_sales', 'proteksi', 'google_review', 'mgb', 'photos', 'notes'],
    []);
  ensureA321Sheet(target, 'users', ['branchId', 'nik', 'name', 'createdAt'], []);

  return 'A321 spreadsheet initialized';
}

function updateBranchAdmin(data) {
  var ss = SpreadsheetApp.openById(spreadsheetIdForBranch(data.branchId));
  var sheet = ss.getSheetByName('branches');
  if (!sheet) throw new Error('Sheet "branches" not found!');

  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var idIndex = headers.indexOf('id');
  var adminNameIndex = headers.indexOf('adminName');
  var lastNameChangeIndex = headers.indexOf('lastNameChange');
  if (idIndex < 0 || adminNameIndex < 0) throw new Error('Branch sheet headers are invalid');

  for (var i = 1; i < values.length; i++) {
    if (values[i][idIndex] === data.branchId) {
      sheet.getRange(i + 1, adminNameIndex + 1).setValue(data.adminName || '');
      if (lastNameChangeIndex >= 0) {
        sheet.getRange(i + 1, lastNameChangeIndex + 1).setValue(new Date().toISOString());
      }
      return { success: true };
    }
  }
  throw new Error('Branch not found: ' + data.branchId);
}

function addSubmission(submission) {
  var submissionLock = LockService.getScriptLock();
  submissionLock.waitLock(30000);

  try {
    Logger.log('addSubmission: ' + submission.id);

    var ss = SpreadsheetApp.openById(spreadsheetIdForBranch(submission.branchId));
    var sheet = ss.getSheetByName('submissions');
    if (!sheet) throw new Error('Sheet "submissions" not found!');

    // Ekstrak nilai per indikator
    var indValues = extractIndicatorValues(submission.data);

    var lastSubmissionRow = sheet.getLastRow();
    var duplicateRow = null;
    if (submission.id && lastSubmissionRow > 1) {
      var existingId = sheet.getRange(2, 1, lastSubmissionRow - 1, 1)
        .createTextFinder(String(submission.id))
        .matchEntireCell(true)
        .findNext();
      if (existingId) duplicateRow = existingId.getRow();
    }

    // Skip Drive work on retries where this submission was already stored.
    var photosStr = duplicateRow
      ? String(sheet.getRange(duplicateRow, 17).getValue() || '')
      : processPhotos(submission.photos || {}, submission.id || 'sub', submission.branchId);
    var uploadedPhotoUrls = photosStr ? JSON.parse(photosStr) : {};
    Logger.log('Photos stored: ' + photosStr.length + ' chars');

    // Notes
    var notesStr = '';
    if (submission.notes && typeof submission.notes === 'object') {
      notesStr = JSON.stringify(submission.notes);
    } else if (submission.notes) {
      notesStr = String(submission.notes);
    }

    // Row: A–G = metadata, H–P = indikator, Q = foto, R = notes
    var rowData = [
      submission.id || '',                                          // A: id
      submission.branchId || '',                                    // B: branchId
      submission.user ? (submission.user.nik || '') : '',           // C: userNik
      submission.user ? (submission.user.nama || '') : '',          // D: userName
      submission.date || '',                                        // E: date
      submission.createdAt || new Date().toISOString(),             // F: createdAt
      submission.totalScore || 0,                                   // G: totalScore
      indValues['sales']          != null ? indValues['sales']          : 0,  // H
      indValues['trx']            != null ? indValues['trx']            : 0,  // I
      indValues['basket']         != null ? indValues['basket']         : 0,  // J
      indValues['wa_personal']    != null ? indValues['wa_personal']    : 0,  // K
      indValues['no_baru']        != null ? indValues['no_baru']        : 0,  // L
      indValues['after_sales']    != null ? indValues['after_sales']    : 0,  // M
      indValues['proteksi']       != null ? indValues['proteksi']       : 0,  // N
      indValues['google_review']  != null ? indValues['google_review']  : 0,  // O
      indValues['mgb']            != null ? indValues['mgb']            : 0,  // P
      photosStr,                                                    // Q: photos (URL saja)
      notesStr                                                      // R: notes
    ];

    if (!duplicateRow) sheet.appendRow(rowData);
    if (submission.branchId === 'A321') appendA321Result(submission, uploadedPhotoUrls);
    Logger.log('Row appended. Max cell size: ' + photosStr.length + ' chars (photos)');

    return { id: submission.id, success: true };

  } catch (error) {
    Logger.log('addSubmission error: ' + error.toString());
    throw error;
  } finally {
    submissionLock.releaseLock();
  }
}

// ─── updateSettings ───────────────────────────────────────────────────────────
function updateSettings(data) {
  var ss = SpreadsheetApp.openById(spreadsheetIdForBranch(data.branchId));
  var sheet = ss.getSheetByName('settings');
  if (!sheet) throw new Error('Sheet "settings" not found!');

  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === data.branchId) {
      sheet.getRange(i + 1, 1, 1, 6).setValues([[
        data.branchId,
        data.loginTitle || '',
        data.loginSubtitle || '',
        data.minScore || 80,
        values[i][4],
        new Date().toISOString()
      ]]);
      return { success: true };
    }
  }
  sheet.appendRow([data.branchId, data.loginTitle || '', data.loginSubtitle || '', data.minScore || 80, new Date().toISOString(), new Date().toISOString()]);
  return { success: true };
}

// ─── deleteSubmission ─────────────────────────────────────────────────────────
function deleteSubmission(data) {
  var ss = SpreadsheetApp.openById(spreadsheetIdForBranch(data.branchId));
  var sheet = ss.getSheetByName('submissions');
  if (!sheet) throw new Error('Sheet "submissions" not found!');

  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === data.id) {
      sheet.deleteRow(i + 1);
      return { success: true, deleted: data.id };
    }
  }
  throw new Error('Submission not found: ' + data.id);
}

// ─── MIGRASI DATA LAMA ────────────────────────────────────────────────────────
/**
 * Jalankan SEKALI untuk migrasi data lama ke format kolom per indikator.
 *
 * Cara pakai di Apps Script Editor:
 *   1. Pilih fungsi "migrateToColumnsFormat" dari dropdown
 *   2. Klik ▶ Run
 *   3. Cek Execution Log untuk progress
 *
 * PENTING: Backup spreadsheet dulu sebelum menjalankan!
 *
 * Yang dilakukan:
 *   - Baca kolom H (data JSON lama) → pecah ke kolom H-P per indikator
 *   - Kolom I (foto base64) → pindah ke kolom Q, hapus base64
 *   - Update header row menjadi format baru
 */
function migrateToColumnsFormat() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('submissions');
  if (!sheet) { Logger.log('Sheet tidak ditemukan!'); return; }

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  Logger.log('Total baris: ' + lastRow + ', Total kolom: ' + lastCol);

  if (lastRow < 1) { Logger.log('Sheet kosong.'); return; }

  // ── Step 1: Update header row ──────────────────────────────────────────────
  var newHeaders = [
    'id', 'branchId', 'userNik', 'userName', 'date', 'createdAt', 'totalScore',
    'sales', 'trx', 'basket', 'wa_personal', 'no_baru', 'after_sales',
    'proteksi', 'google_review', 'mgb', 'photos', 'notes'
  ];
  // Pastikan ada cukup kolom
  if (lastCol < newHeaders.length) {
    sheet.insertColumnsAfter(lastCol, newHeaders.length - lastCol);
  }
  sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
  Logger.log('Header row updated: ' + newHeaders.join(' | '));

  // ── Step 2: Migrasi tiap baris data ───────────────────────────────────────
  var migrated = 0, skipped = 0, errors = 0;

  for (var row = 2; row <= lastRow; row++) {
    try {
      var rowVals = sheet.getRange(row, 1, 1, Math.max(lastCol, 18)).getValues()[0];

      var colH = String(rowVals[7] || '');  // H: data (lama)
      var colI = String(rowVals[8] || '');  // I: photos (lama)

      // Cek apakah sudah format baru (kolom H berisi angka, bukan JSON)
      var alreadyMigrated = colH !== '' && !colH.startsWith('[') && !colH.startsWith('{');
      if (alreadyMigrated) { skipped++; continue; }

      // Parse data lama dari kolom H
      var indValues = {};
      if (colH.startsWith('[') || colH.startsWith('{')) {
        try {
          indValues = extractIndicatorValues(JSON.parse(colH));
        } catch (e) {
          Logger.log('Row ' + row + ': gagal parse data - ' + e);
        }
      }

      // Parse foto lama dari kolom I → ambil URL saja, buang base64
      var photosStr = '';
      if (colI && colI !== '') {
        try {
          var parsedPhotos = JSON.parse(colI);
          var urlMap = {};
          var pKeys = Object.keys(parsedPhotos);
          for (var pk = 0; pk < pKeys.length; pk++) {
            var pid = pKeys[pk];
            var pList = parsedPhotos[pid];
            if (Array.isArray(pList)) {
              var urls = pList.filter(function(p) { return typeof p === 'string' && p.startsWith('http'); });
              if (urls.length > 0) urlMap[pid] = urls;
            }
          }
          if (Object.keys(urlMap).length > 0) photosStr = JSON.stringify(urlMap);
        } catch (e) { /* foto lama tidak bisa di-recover */ }
      }

      // Notes dari kolom lama (jika ada, bisa di index 9+)
      var notesStr = String(rowVals[9] || '');

      // Tulis format baru: kolom H-P = nilai indikator, Q = foto, R = notes
      var newRowPart = [
        indValues['sales']         != null ? indValues['sales']         : 0,
        indValues['trx']           != null ? indValues['trx']           : 0,
        indValues['basket']        != null ? indValues['basket']        : 0,
        indValues['wa_personal']   != null ? indValues['wa_personal']   : 0,
        indValues['no_baru']       != null ? indValues['no_baru']       : 0,
        indValues['after_sales']   != null ? indValues['after_sales']   : 0,
        indValues['proteksi']      != null ? indValues['proteksi']      : 0,
        indValues['google_review'] != null ? indValues['google_review'] : 0,
        indValues['mgb']           != null ? indValues['mgb']           : 0,
        photosStr,
        notesStr
      ];
      sheet.getRange(row, 8, 1, newRowPart.length).setValues([newRowPart]);

      migrated++;
      Logger.log('Row ' + row + ' ✓ — data ' + colH.length + ' chars → ' + JSON.stringify(indValues));

      if (row % 20 === 0) Utilities.sleep(300);

    } catch (e) {
      errors++;
      Logger.log('Row ' + row + ' ERROR: ' + e.toString());
    }
  }

  Logger.log('=== MIGRASI SELESAI ===');
  Logger.log('Berhasil : ' + migrated + ' baris');
  Logger.log('Dilewati : ' + skipped + ' baris (sudah format baru)');
  Logger.log('Error    : ' + errors + ' baris');
  Logger.log('Sekarang setiap cell jauh di bawah 50.000 karakter!');
}
