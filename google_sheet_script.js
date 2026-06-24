/**
 * Google Apps Script for Pang Sida Butterfly Hub
 * 
 * Instructions:
 * 1. Open a Google Sheet.
 * 2. Click Extensions > Apps Script.
 * 3. Delete any code in the editor and paste this code.
 * 4. Click Save (disk icon).
 * 5. Click Deploy > New deployment.
 * 6. Select type: "Web app".
 * 7. Change "Who has access" to: "Anyone".
 * 8. Click Deploy. Authorize access if prompted.
 * 9. Copy the Web App URL and paste it into the Settings panel in the website.
 */

function doPost(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Species Name (Common)", "Scientific Name", "Family", "Reporter Name", "AI Confidence", "Location/Notes", "Image Link/Indicator"]);
      // Format headers bold
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#1B4332").setFontColor("#FFFFFF");
    }
    
    var timestamp = new Date();
    sheet.appendRow([
      timestamp,
      data.commonName || "Unknown",
      data.scientificName || "N/A",
      data.family || "Unknown",
      data.reporter || "Anonymous",
      data.confidence ? (data.confidence + "%") : "Manual entry",
      data.notes || "",
      data.hasImage ? "Image Uploaded" : "No Image"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data successfully recorded in Google Sheets!",
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON)
       .setHeaders(headers);
       
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON)
       .setHeaders(headers);
  }
}

// Handle CORS preflight options request
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}

function doGet(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Google Sheets Web App connection is online!"
  })).setMimeType(ContentService.MimeType.JSON)
     .setHeaders(headers);
}
