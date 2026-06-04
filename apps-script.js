// =====================================================
//  COLE ESTE CÓDIGO NO GOOGLE APPS SCRIPT DO SEU SHEET
//  Extensions > Apps Script > Cole aqui > Deploy > Web app
//  Execute as: Me | Who has access: Anyone
// =====================================================

const SPREADSHEET_ID = '1_M2OD1gqEN5NobiO0-qK91vmpH9ysxy0s_GesF4fq8c';
const HEADERS = ['Timestamp','Nome','Idade','Estado','Sim','Talvez','Não','Perfil','Votos_JSON'];

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName('Respostas');
  if (!sheet) {
    sheet = ss.insertSheet('Respostas');
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action !== 'save') throw new Error('Ação inválida');
    const sheet = getSheet();
    sheet.appendRow([
      data.ts,
      data.name,
      data.age,
      data.state,
      data.yes,
      data.maybe,
      data.no,
      data.perfil,
      JSON.stringify(data.votes)
    ]);
    return jsonResponse({ ok: true });
  } catch(err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function doGet(e) {
  try {
    if (e.parameter.action !== 'list') return jsonResponse({ ok: false });
    const sheet = getSheet();
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) return jsonResponse({ ok: true, data: [] });

    const data = rows.slice(1).map(row => ({
      ts:     row[0],
      name:   row[1],
      age:    row[2],
      state:  row[3],
      yes:    row[4],
      maybe:  row[5],
      no:     row[6],
      perfil: row[7],
      votes:  JSON.parse(row[8] || '{}')
    }));
    return jsonResponse({ ok: true, data });
  } catch(err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
