/**
 * Google Apps Script - EXPANDED COLUMNS FORMAT
 * Setiap indikator = kolom terpisah
 * Foto-foto juga punya kolom sendiri
 *
 * DEPLOYMENT SETTINGS:
 * - Execute as: Me
 * - Who has access: Anyone (Siapa saja)
 */

const SPREADSHEET_ID = '1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0';

/**
 * Handle GET requests
 */
function doGet(e) {
  const output = JSON.stringify({
    status: 'ok',
    message: 'Crown Daily Indicators API - Expanded Format!',
    timestamp: new Date().toISOString(),
    format: 'columns-per-indicator'
  });

  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    Logger.log('POST Request received');

    let params;
    try {
      params = JSON.parse(e.postData.contents);
      Logger.log('Parsed params: ' + JSON.stringify(params));
    } catch (parseError) {
      throw new Error('Invalid JSON: ' + parseError.toString());
    }

    const action = params.action;

    if (!action) {
      throw new Error('Missing "action" field');
    }

    let result;
    switch(action) {
      case 'addSubmission':
        if (!params.data) {
          throw new Error('Missing "data" field');
        }
        result = addSubmissionExpanded(params.data);
        break;

      default:
        throw new Error('Invalid action: ' + action);
    }

    const output = JSON.stringify({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

    return ContentService
      .createTextOutput(output)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());

    const errorOutput = JSON.stringify({
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    });

    return ContentService
      .createTextOutput(errorOutput)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Add submission dengan EXPANDED COLUMNS
 */
function addSubmissionExpanded(submission) {
  try {
    Logger.log('addSubmissionExpanded called');

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('submissions');

    if (!sheet) {
      throw new Error('Sheet "submissions" not found!');
    }

    // Parse data JSON
    const data = submission.data || {};
    const photos = submission.photos || {};
    const notes = submission.notes || {};

    // 🔍 DEBUG: Log notes untuk cek apa yang diterima
    Logger.log('🔍 DEBUG - submission.notes: ' + JSON.stringify(submission.notes));
    Logger.log('🔍 DEBUG - notes object: ' + JSON.stringify(notes));
    Logger.log('🔍 DEBUG - notes.reason: ' + notes.reason);
    Logger.log('🔍 DEBUG - notes.approval: ' + notes.approval);
    Logger.log('🔍 DEBUG - notes.adminNik: ' + notes.adminNik);
    Logger.log('🔍 DEBUG - notes.adminNama: ' + notes.adminNama);

    // Extract values per indicator
    const sales = getIndicatorValue(data, 'sales');
    const trx = getIndicatorValue(data, 'trx') || getIndicatorValue(data, 'transaksi');
    const basket = getIndicatorValue(data, 'basket') || getIndicatorValue(data, 'basketSize');
    const waPersonal = getIndicatorValue(data, 'wa_personal');
    const noBaru = getIndicatorValue(data, 'no_baru') || getIndicatorValue(data, 'noBaru');
    const proteksi = getIndicatorValue(data, 'proteksi');
    const googleReview = getIndicatorValue(data, 'google_review');
    const mgb = getIndicatorValue(data, 'mgb');

    // Extract photo URLs (first 100 chars for preview)
    const waPersonalPhoto = getPhotoPreview(photos, 'wa_personal', 0);
    const afterSalesPhoto = getPhotoPreview(photos, 'after_sales', 0);
    const mgbPhoto1 = getPhotoPreview(photos, 'mgb', 0);
    const mgbPhoto2 = getPhotoPreview(photos, 'mgb', 1);
    const mgbPhoto3 = getPhotoPreview(photos, 'mgb', 2);

    // Format date and time
    const dateObj = new Date(submission.createdAt || new Date());
    const dateStr = Utilities.formatDate(dateObj, 'Asia/Jakarta', 'dd/MM/yyyy');
    const timeStr = Utilities.formatDate(dateObj, 'Asia/Jakarta', 'HH:mm');

    // Prepare row data - HYBRID FORMAT:
    // 1. Machine-readable columns (for app to read)
    // 2. Human-readable columns (for Google Sheets display)
    const rowData = [
      // === MACHINE-READABLE COLUMNS (A-I) ===
      submission.id || '',                  // A: id
      submission.branchId || '',            // B: branchId
      submission.user?.nik || '',           // C: userNik
      submission.user?.nama || '',          // D: userName
      submission.date || '',                // E: date (YYYY-MM-DD)
      submission.createdAt || new Date().toISOString(),  // F: createdAt (ISO)
      submission.totalScore || 0,           // G: totalScore
      JSON.stringify(submission.data || {}),   // H: data (JSON)
      JSON.stringify(submission.photos || {}), // I: photos (JSON)

      // === HUMAN-READABLE COLUMNS (J-AA) ===
      dateStr,                              // J: Tanggal
      timeStr,                              // K: Waktu
      sales || '',                          // L: Sales
      trx || '',                            // M: Trx
      basket || '',                         // N: Basket Size
      waPersonal || '',                     // O: WA Personal (number)
      waPersonalPhoto,                      // P: WA Personal Foto
      noBaru || '',                         // Q: No Baru Customer
      afterSalesPhoto,                      // R: After Sales Foto
      proteksi || '',                       // S: Proteksi
      googleReview || '',                   // T: Google Review
      mgb || '',                            // U: MGB (number)
      mgbPhoto1,                            // V: MGB Foto 1
      mgbPhoto2,                            // W: MGB Foto 2
      mgbPhoto3,                            // X: MGB Foto 3

      // === NOTES EXPANDED (Y-AB) ===
      // Check if value exists AND not empty string (empty string is falsy!)
      (notes && notes.reason && notes.reason.length > 0) ? notes.reason : '-',         // Y: Reason
      (notes && notes.approval && notes.approval.length > 0) ? notes.approval : '-',     // Z: Approval
      (notes && notes.adminNik && notes.adminNik.length > 0) ? notes.adminNik : '-',     // AA: Admin NIK
      (notes && notes.adminNama && notes.adminNama.length > 0) ? notes.adminNama : '-'    // AB: Admin Nama
    ];

    // Append to sheet
    sheet.appendRow(rowData);

    Logger.log('Row appended with expanded columns');

    return {
      id: submission.id,
      success: true,
      message: 'Submission added with expanded columns'
    };

  } catch (error) {
    Logger.log('Error in addSubmissionExpanded: ' + error.toString());
    throw error;
  }
}

/**
 * Helper: Get indicator value from data object
 */
function getIndicatorValue(data, indicatorId) {
  if (!data || !data[indicatorId]) {
    return null;
  }

  const indicator = data[indicatorId];

  // If it's an object with 'value' property
  if (typeof indicator === 'object' && indicator.value !== undefined) {
    return indicator.value;
  }

  // If it's a direct value
  return indicator;
}

/**
 * Helper: Get photo preview/link from photos object
 */
function getPhotoPreview(photos, indicatorId, photoIndex) {
  if (!photos || !photos[indicatorId]) {
    return '';
  }

  const indicatorPhotos = photos[indicatorId];

  if (!Array.isArray(indicatorPhotos) || photoIndex >= indicatorPhotos.length) {
    return '';
  }

  const photoData = indicatorPhotos[photoIndex];

  // If base64, return indicator that photo exists
  if (photoData && photoData.startsWith('data:image')) {
    // Option 1: Return "✓ Foto" indicator
    return '✓ Foto';

    // Option 2: Return first 50 chars (for verification)
    // return photoData.substring(0, 50) + '...';

    // Option 3: Could upload to Google Drive and return link
    // (more complex, requires Drive API)
  }

  return photoData || '';
}

/**
 * OPTIONAL: Setup sheet headers (run once manually)
 */
function setupSheetHeaders() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('submissions');

  if (!sheet) {
    Logger.log('Sheet not found!');
    return;
  }

  // Set headers - HYBRID FORMAT
  const headers = [
    // Machine-readable columns (for app)
    'id',
    'branchId',
    'userNik',
    'userName',
    'date',
    'createdAt',
    'totalScore',
    'data',
    'photos',
    // Human-readable columns (for display)
    'Tanggal',
    'Waktu',
    'Sales',
    'Trx',
    'Basket Size',
    'WA Personal',
    'WA Personal Foto',
    'No Baru Customer',
    'After Sales Foto',
    'Proteksi',
    'Google Review',
    'MGB',
    'MGB Foto 1',
    'MGB Foto 2',
    'MGB Foto 3',
    // Notes expanded columns
    'Reason',
    'Approval',
    'Admin NIK',
    'Admin Nama'
  ];

  // Clear existing content
  sheet.clear();

  // Set headers in row 1
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');

  // Freeze header row
  sheet.setFrozenRows(1);

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }

  Logger.log('Headers setup complete!');
}
