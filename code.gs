function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    console.log("[DO_POST] Action:", data.action);
    
    switch(data.action) {
      case 'updateOnlineStatus':
       return handleUpdateOnlineStatus(data);
      case 'submitRating':
        return handleRating(data);
      case 'login':
        return handleLogin(data);
      case 'register':
        return handleRegistration(data);
      case 'googleAuth':
        return handleGoogleAuth(data);
      case 'googleRegister':
        return handleGoogleRegister(data);
      case 'getVerses':
        return handleGetVerses();
      case 'searchVerses':
        return handleSearchVerses(data);
      case 'updatePoints':
        return handleUpdatePoints(data);
      case 'getUserData':
        return handleGetUserData(data);
      case 'processRedemption':
        return handleProcessRedemption(data);
      case 'forgotPassword':
        return handleForgotPassword(data);
      case 'verifyCode':
        return handleVerifyCode(data);
      case 'resetPassword':
        return handleResetPassword(data);
      case 'changePassword':
        return handleChangePassword(data);
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: "Unknown action: " + data.action
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error("[DO_POST] Error:", error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Server error: " + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
function handleForgotPassword(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
    var email = data.email;
    var values = sheet.getDataRange().getValues();
    var headers = values[0];
    
    var userRow = -1;
    var userName = "";
    for (var i = 1; i < values.length; i++) {
      if (values[i][2] === email) {
        userRow = i;
        userName = values[i][1];
        break;
      }
    }
       
    if (userRow === -1) {
      return createResponse({
        success: false,
        message: "No account found with this email"
      });
    }
  
    var code = Math.floor(100000 + Math.random() * 900000).toString();
    var timestamp = new Date();
    var expiration = new Date(timestamp.getTime() + 30 * 60000);
    
    var forgotCodeCol = 9;      // Column J
    var expiryCodeCol = 11;     // Column L
    
    sheet.getRange(userRow + 1, forgotCodeCol + 1).setValue(code);
    sheet.getRange(userRow + 1, expiryCodeCol + 1).setValue(expiration);
    
    return createResponse({
      success: true,
      verificationCode: code,
      name: userName,
      message: "Verification code generated"
    });
    
  } catch (error) {
    return createResponse({ success: false, message: error.toString() });
  }
}

// ============================================
// FORGOT PASSWORD - STEP 2: Verify Code
// ============================================
function handleVerifyCode(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
    var email = data.email;
    var code = data.code;
    var values = sheet.getDataRange().getValues();
    
    var userRow = -1;
    for (var i = 1; i < values.length; i++) {
      if (values[i][2] === email) {
        userRow = i;
        break;
      }
    }
    
    if (userRow === -1) {
      return createResponse({ success: false, message: "User not found" });
    }
    
    var storedCode = values[userRow][9];
    var expiryTime = values[userRow][11];
    
    if (!storedCode) {
      return createResponse({ success: false, message: "No verification code found" });
    }
    
    if (expiryTime) {
      var expireDate = new Date(expiryTime);
      if (new Date() > expireDate) {
        return createResponse({
          success: false,
          message: "Code expired. Please request a new one."
        });
      }
    }
    
    if (storedCode.toString() !== code.toString()) {
      return createResponse({ success: false, message: "Invalid code" });
    }
    
    return createResponse({ success: true, message: "Code verified" });
    
  } catch (error) {
    return createResponse({ success: false, message: error.toString() });
  }
}

// ============================================
// FORGOT PASSWORD - STEP 3: Reset Password
// ============================================
function handleResetPassword(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
    var email = data.email;
    var newPassword = data.newPassword;
    var values = sheet.getDataRange().getValues();
    
    var userRow = -1;
    for (var i = 1; i < values.length; i++) {
      if (values[i][2] === email) {
        userRow = i;
        break;
      }
    }
    
    if (userRow === -1) {
      return createResponse({ success: false, message: "User not found" });
    }
    
    sheet.getRange(userRow + 1, 4).setValue(newPassword);
    sheet.getRange(userRow + 1, 10).setValue("");
    sheet.getRange(userRow + 1, 12).setValue("");
    
    return createResponse({
      success: true,
      message: "Password reset successfully"
    });
    
  } catch (error) {
    return createResponse({ success: false, message: error.toString() });
  }
}

// Helper function for consistent JSON responses
function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
// 1. UPDATE REDEMPTION TO SAVE TO COLUMN M (Redeem Status)

// 2. ONLINE STATUS (Safely isolated to Column G)
function handleUpdateOnlineStatus(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ success: false })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const users = sheet.getDataRange().getValues();
  
  for (let i = 1; i < users.length; i++) {
    if (users[i][2] === data.email) { 
      const status = data.isOnline ? 'Active' : 'Inactive';
      
      // Safely update Column G (Index 7) without worrying about Redemptions anymore!
      sheet.getRange(i + 1, 7).setValue(status);
      console.log(`[ONLINE STATUS] ${data.email} -> ${status}`);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        status: status
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: false })).setMimeType(ContentService.MimeType.JSON);
}
function markInactiveUsers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  if (!sheet) {
    console.log("[MARK INACTIVE] Database sheet not found");
    return;
  }
  
  // Get current time
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  
  console.log(`[MARK INACTIVE] Running at ${now.toLocaleTimeString()}`);
  console.log(`[MARK INACTIVE] Checking for users inactive since ${fiveMinutesAgo.toLocaleTimeString()}`);
  
  // Get all data
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const backgrounds = dataRange.getBackgrounds(); // Get colors to identify recent updates
  
  let markedCount = 0;
  
  // Start from row 1 (skip header)
  for (let i = 1; i < values.length; i++) {
    const email = values[i][2]; // Column C
    const currentStatus = values[i][6]; // Column G
    
    if (!email) continue; // Skip empty rows
    
    // Check if currently Active
    if (currentStatus === 'Active') {
      // Since we can't track last seen time without extra column,
      // we use a different approach: check if Status cell was recently modified
      // by looking at the row's background color or other indicators
      
      // Simple approach: Mark ALL Active users as Inactive every 5 minutes
      // Active users will immediately send heartbeat and become Active again
      
      // This ensures users who closed browser get marked Inactive
      sheet.getRange(i + 1, 7).setValue('Inactive');
      console.log(`[MARK INACTIVE] Marked ${email} as Inactive`);
      markedCount++;
    }
  }
  
  console.log(`[MARK INACTIVE] Completed. Marked ${markedCount} users as Inactive`);
}

// Alternative: More efficient version that uses row coloring to track
function markInactiveUsersV2() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  if (!sheet) return;
  
  const now = new Date();
  console.log(`[MARK INACTIVE V2] Running at ${now.toLocaleTimeString()}`);
  
  // Get all users who are Active
  const data = sheet.getDataRange().getValues();
  
  // Batch update: mark all Active as Inactive
  const updates = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][6] === 'Active' && data[i][2]) { // Column G is Active and has email
      updates.push({
        row: i + 1,
        email: data[i][2]
      });
    }
  }
  
  // Perform batch updates
  updates.forEach(update => {
    sheet.getRange(update.row, 7).setValue('Inactive');
    console.log(`[MARK INACTIVE V2] ${update.email} -> Inactive`);
  });
  
  console.log(`[MARK INACTIVE V2] Marked ${updates.length} users as Inactive`);
}

// Setup trigger (run this ONCE manually)
function setupMarkInactiveTrigger() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'markInactiveUsers') {
      ScriptApp.deleteTrigger(trigger);
      console.log("Deleted existing trigger");
    }
  });
  
  // Create new trigger - every 5 minutes
  ScriptApp.newTrigger('markInactiveUsers')
    .timeBased()
    .everyMinutes(5)
    .create();
    
  console.log("✅ Trigger created: markInactiveUsers every 5 minutes");
}

// Test function - run this to verify it works
function testMarkInactive() {
  console.log("Testing markInactiveUsers...");
  markInactiveUsers();
  console.log("Test complete - check Column G in your sheet");
}
  // Run every 5 minutes as backup
function markInactiveUsers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  if (!sheet) return;
  
  const users = sheet.getDataRange().getValues();
  const now = new Date();
  
  console.log(`[BACKUP CHECK] Running at ${now.toLocaleTimeString()}`);
  
  for (let i = 1; i < users.length; i++) {
    const email = users[i][2];
    const currentStatus = users[i][6];
    
    // You can add logic here to check last modified time if needed
    // For now, this is just a backup in case browser events fail
  }
}
  // Add this function and run it ONCE
function setupTrigger() {
  ScriptApp.newTrigger('markInactiveUsers')
    .timeBased()
    .everyMinutes(5)
    .create();
  console.log("Trigger created!");

  
  const lastColumn = sheet.getLastColumn();
  const users = sheet.getDataRange().getValues();
  const now = new Date();
  const inactiveThreshold = 5 * 60 * 1000; // 5 minutes
  
  console.log(`[MARK INACTIVE] Checking ${users.length - 1} users at ${now}`);
  console.log(`[MARK INACTIVE] Last column: ${lastColumn}`);
  
  for (let i = 1; i < users.length; i++) {
    const email = users[i][2]; // Column C
    const currentStatus = users[i][6]; // Column G (Status)
    const lastSeen = lastColumn >= 13 ? users[i][12] : null; // Column M (index 12)
    
    if (currentStatus === 'Active') {
      let shouldMarkInactive = false;
      
      if (lastSeen) {
        const lastSeenTime = new Date(lastSeen).getTime();
        const timeDiff = now.getTime() - lastSeenTime;
        if (timeDiff > inactiveThreshold) {
          shouldMarkInactive = true;
          console.log(`[MARK INACTIVE] ${email}: ${Math.round(timeDiff/1000)}s since last ping`);
        }
      } else {
        // No LastSeen timestamp - mark inactive to be safe
        console.log(`[MARK INACTIVE] ${email}: No LastSeen timestamp`);
        shouldMarkInactive = true;
      }
      
      if (shouldMarkInactive) {
        sheet.getRange(i + 1, 7).setValue('Inactive');
        console.log(`[MARK INACTIVE] ✅ Marked ${email} as Inactive`);
      }
    }
  }
}
function handleRating(data) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName('Database');
        
        if (!sheet) {
            return ContentService.createTextOutput(JSON.stringify({
                success: false,
                message: "Database sheet not found"
            })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Find user row by email (Column C)
        const users = sheet.getDataRange().getValues();
        let userRow = -1;
        
        for (let i = 1; i < users.length; i++) {
            if (users[i][2] === data.email) {
                userRow = i + 1;
                break;
            }
        }
        
        if (userRow === -1) {
            return ContentService.createTextOutput(JSON.stringify({
                success: false,
                message: "User not found"
            })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Save rating to Column K (Index 11)
        sheet.getRange(userRow, 11).setValue(data.ratingStars);
        
        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            message: "Rating saved to column K"
        })).setMimeType(ContentService.MimeType.JSON);
        
    } catch (error) {
        console.error("[RATING ERROR]", error);
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            message: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

function handleLogin(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Database sheet not found"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const users = sheet.getDataRange().getValues();
  
  // Find user by email (Column C) and password (Column D)
  for (let i = 1; i < users.length; i++) {
    if (users[i][2] === data.email && users[i][3] === data.password) {
      // Update device model (Column I)
      sheet.getRange(i + 1, 9).setValue(data.deviceModel || 'Unknown');
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        user: {
          email: users[i][2],
          name: users[i][1],
          points: users[i][5] || 0,
          profile: "https://i.imgur.com/Bu2aW8n.png",
          isGoogleUser: users[i][10] === true || users[i][10] === 'TRUE' || users[i][10] === 'true'
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: "Invalid email or password"
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleRegistration(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Database sheet not found"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const users = sheet.getDataRange().getValues();
  
  // Check if email already exists (Column C)
  for (let i = 1; i < users.length; i++) {
    if (users[i][2] === data.email) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Email already registered"
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Add new user
  sheet.appendRow([
    new Date(),                    // A: Time_Stamp
    data.name,                     // B: Name
    data.email,                    // C: Email
    data.password,                 // D: Password
    0,                            // E: Amounts
    0,                            // F: Points
    'Active',                     // G: Status
    '',                           // H: Gcash Number
    data.deviceModel || 'Unknown', // I: Device Model
    '',                           // J: Verification
    false                         // K: IsGoogleUser
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "Account created successfully"
  })).setMimeType(ContentService.MimeType.JSON);
}

// Handle Google Sign-In (Login only - user must exist)
function handleGoogleAuth(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Database sheet not found"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const users = sheet.getDataRange().getValues();
  
  // Look for user by email (Column C)
  for (let i = 1; i < users.length; i++) {
    if (users[i][2] === data.email) {
      // Check if this user registered via Google
      const isGoogleUser = users[i][10] === true || users[i][10] === 'TRUE' || users[i][10] === 'true';
      
      if (!isGoogleUser) {
        // User exists but didn't register with Google
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: "This email is registered with a password. Please use regular login."
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Update device model (Column I)
      sheet.getRange(i + 1, 9).setValue(data.deviceModel || 'Unknown');
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        user: {
          email: users[i][2],
          name: users[i][1],
          points: users[i][5] || 0,
          profile: data.picture || "https://i.imgur.com/Bu2aW8n.png",
          isGoogleUser: true
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // User not found - they need to sign up first
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: "NOT_REGISTERED",
    needSignup: true
  })).setMimeType(ContentService.MimeType.JSON);
}

// Handle Google Sign-Up (Registration only)
function handleGoogleRegister(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Database sheet not found"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const users = sheet.getDataRange().getValues();
  
  // Check if email already exists (Column C)
  for (let i = 1; i < users.length; i++) {
    if (users[i][2] === data.email) {
      const isGoogleUser = users[i][10] === true || users[i][10] === 'TRUE' || users[i][10] === 'true';
      if (isGoogleUser) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: "You already have a Google account. Please sign in instead."
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: "This email is already registered with a password."
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
  }
  
  // Add new Google user
  sheet.appendRow([
    new Date(),                    // A: Time_Stamp
    data.name,                     // B: Name
    data.email,                    // C: Email
    'GOOGLE_AUTH_' + data.googleId, // D: Password (special marker for Google auth)
    0,                            // E: Amounts
    0,                            // F: Points
    'Active',                     // G: Status
    '',                           // H: Gcash Number
    data.deviceModel || 'Unknown', // I: Device Model
    '',                           // J: Verification
    true                          // K: IsGoogleUser
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "Google account created successfully",
    user: {
      email: data.email,
      name: data.name,
      points: 0,
      profile: data.picture || "https://i.imgur.com/Bu2aW8n.png",
      isGoogleUser: true
    }
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleChangePassword(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Database sheet not found"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const users = sheet.getDataRange().getValues();
  
  for (let i = 1; i < users.length; i++) {
    if (users[i][2] === data.email && users[i][3] === data.oldPassword) {
      sheet.getRange(i + 1, 4).setValue(data.newPassword);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Password updated successfully"
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: "Current password incorrect"
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleProcessRedemption(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Database");
  const redemptionSheet = ss.getSheetByName("RedemptionHistory"); // Matches your sheet tab
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Database not found" })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const users = sheet.getDataRange().getValues();
  
  for (let i = 1; i < users.length; i++) {
    if (users[i][2] === data.email) {
      const currentPoints = users[i][5] || 0;
      const currentAmounts = users[i][4] || 0;
      
      if (currentPoints < data.cost) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Insufficient points" })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const newPoints = currentPoints - data.cost;
      const newAmounts = currentAmounts + data.redeemAmount;
      
      // Update Database Sheet (Amounts, Points, GCash Number, Redeem Status in Col M)
      sheet.getRange(i + 1, 5).setValue(newAmounts);
      sheet.getRange(i + 1, 6).setValue(newPoints);
      sheet.getRange(i + 1, 8).setValue(data.gcashNumber);
      sheet.getRange(i + 1, 13).setValue('Pending...'); // Col M
      
      // SAVE TO RedemptionHistory SHEET (Matches your column layout perfectly)
      if (redemptionSheet) {
        redemptionSheet.appendRow([
          new Date(),                // A: Timestamp
          data.email,                // B: Email
          data.userName,             // C: Name
          "₱" + data.redeemAmount,   // D: Amount
          data.gcashNumber,          // E: GCashNumber
          data.gcashName,            // F: GCashName
          'Pending...',              // G: Status
          data.cost + " points",     // H: PointsCost
          data.receiptEmail          // I: ReceiptEmail
        ]);
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        newPoints: newPoints,
        newAmounts: newAmounts
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: false, message: "User not found" })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetUserData(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Database");
  const redemptionsSheet = ss.getSheetByName("RedemptionHistory");
  
  if (!sheet) return ContentService.createTextOutput(JSON.stringify({ success: false })).setMimeType(ContentService.MimeType.JSON);
  
  let userData = null;
  const users = sheet.getDataRange().getValues();
  
  for (let i = 1; i < users.length; i++) {
    if (users[i][2] === data.email) {
      userData = {
        email: users[i][2],
        name: users[i][1],
        points: users[i][5] || 0,
        amounts: users[i][4] || 0,
        status: users[i][6],
        gcashNumber: users[i][7]
      };
      break;
    }
  }
  
  if (!userData) return ContentService.createTextOutput(JSON.stringify({ success: false, message: "User not found" })).setMimeType(ContentService.MimeType.JSON);
  
  let historyLogs = [];
  if (redemptionsSheet) {
    const historyData = redemptionsSheet.getDataRange().getValues();
    // Start at 1 to skip headers
    for (let i = 1; i < historyData.length; i++) {
      if (historyData[i][1] === data.email) { // If Email (Col B) matches
        const timeStr = new Date(historyData[i][0]).toLocaleTimeString(); // Col A
        const amount = historyData[i][3]; // Col D (Amount)
        const gcashNum = historyData[i][4]; // Col E (GCash Number)
        const status = historyData[i][6]; // Col G (Status)
        
        let statusHtml = status === 'Success' 
          ? '<span class="status-badge" style="color:#4CAF50">✅ Success</span>' 
          : '<span class="status-badge" style="color:#ffa500">⏳ Pending...</span>';
          
        historyLogs.push(`${timeStr}: Redeemed ${amount} to ${gcashNum} ${statusHtml}`);
      }
    }
  }
  
  historyLogs.reverse();
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    user: userData,
    redemptionHistory: historyLogs
  })).setMimeType(ContentService.MimeType.JSON);
}
function handleUpdatePoints(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Database sheet not found"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const users = sheet.getDataRange().getValues();
  
  for (let i = 1; i < users.length; i++) {
    if (users[i][2] === data.email) {
      sheet.getRange(i + 1, 6).setValue(data.points);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        newPoints: data.points
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: "User not found"
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetVerses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Verses");
  
  if (!sheet) {
    // Return default verses if sheet not found
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      verses: [
        { reference: "John 3:16", text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
        { reference: "Psalm 23:1", text: "The Lord is my shepherd, I lack nothing." },
        { reference: "Proverbs 3:5", text: "Trust in the Lord with all your heart and lean not on your own understanding." },
        { reference: "Philippians 4:13", text: "I can do all this through him who gives me strength." },
        { reference: "Romans 8:28", text: "And we know that in all things God works for the good of those who love him." }
      ]
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const verses = sheet.getDataRange().getValues();
  const verseList = [];
  
  for (let i = 1; i < verses.length; i++) {
    if (verses[i][0] && verses[i][1]) {
      verseList.push({
        reference: verses[i][0],
        text: verses[i][1]
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    verses: verseList
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleSearchVerses(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Verses");
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Verses sheet not found"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const verses = sheet.getDataRange().getValues();
  const query = data.query.toLowerCase();
  
  for (let i = 1; i < verses.length; i++) {
    if (verses[i][0] && verses[i][0].toLowerCase() === query) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        verse: {
          reference: verses[i][0],
          text: verses[i][1]
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: "Verse not found"
  })).setMimeType(ContentService.MimeType.JSON);


  if (action === 'forgotPassword') {
    try {
      var email = data.email;
      var values = sheet.getDataRange().getValues();
      var headers = values[0];
      
      var userRow = -1;
      var userName = "";
      for (var i = 1; i < values.length; i++) {
        if (values[i][2] === email) { // Column C = Email (index 2)
          userRow = i;
          userName = values[i][1]; // Column B = Name (index 1)
          break;
        }
      }
         
      if (userRow === -1) {
        return createResponse({
          success: false,
          message: "No account found with this email"
        });
      }
    
      var code = Math.floor(100000 + Math.random() * 900000).toString();
      var timestamp = new Date();
      var expiration = new Date(timestamp.getTime() + 30 * 60000); // 30 minutes
      
      // Column J = index 9 (Verification_Code)
      // Column L = index 11 (Time_Expiry_Code)
      var forgotCodeCol = 9;      // Column J
      var expiryCodeCol = 11;     // Column L
      
      // Store verification code in Column J
      sheet.getRange(userRow + 1, forgotCodeCol + 1).setValue(code);
      
      sheet.getRange(userRow + 1, expiryCodeCol + 1).setValue(expiration);
      
      return createResponse({
        success: true,
        verificationCode: code,
        name: userName,
        message: "Verification code generated"
      });
      
    } catch (error) {
      return createResponse({ success: false, message: error.toString() });
    }
  }

  // ============================================
  // FORGOT PASSWORD - STEP 2: Verify Code
  // ============================================
  if (action === 'verifyCode') {
    try {
      var email = data.email;
      var code = data.code;
      var values = sheet.getDataRange().getValues();
      
      var userRow = -1;
      for (var i = 1; i < values.length; i++) {
        if (values[i][2] === email) { // Column C = Email
          userRow = i;
          break;
        }
      }
      
      if (userRow === -1) {
        return createResponse({ success: false, message: "User not found" });
      }
      
      // Column J = index 9 (Verification_Code)
      // Column L = index 11 (Time_Expiry_Code)
      var storedCode = values[userRow][9];      // Column J
      var expiryTime = values[userRow][11];     // Column L
      
      // Check if code exists
      if (!storedCode) {
        return createResponse({ success: false, message: "No verification code found" });
      }
      
      // Check if expired using Column L
      if (expiryTime) {
        var expireDate = new Date(expiryTime);
        if (new Date() > expireDate) {
          return createResponse({
            success: false,
            message: "Code expired. Please request a new one."
          });
        }
      }
      
      if (storedCode.toString() !== code.toString()) {
        return createResponse({ success: false, message: "Invalid code" });
      }
      
      return createResponse({ success: true, message: "Code verified" });
      
    } catch (error) {
      return createResponse({ success: false, message: error.toString() });
    }
  }

  // ============================================
  // FORGOT PASSWORD - STEP 3: Reset Password
  // ============================================
  if (action === 'resetPassword') {
    try {
      var email = data.email;
      var newPassword = data.newPassword;
      var values = sheet.getDataRange().getValues();
      
      var userRow = -1;
      for (var i = 1; i < values.length; i++) {
        if (values[i][2] === email) { // Column C = Email
          userRow = i;
          break;
        }
      }
      
      if (userRow === -1) {
        return createResponse({ success: false, message: "User not found" });
      }
      
      // Update password (Column D = index 3)
      sheet.getRange(userRow + 1, 4).setValue(newPassword);
      
      // Clear forgot password fields
      // Column J = index 9 (Verification_Code)
      // Column L = index 11 (Time_Expiry_Code)
      sheet.getRange(userRow + 1, 10).setValue(""); // Clear Column J
      sheet.getRange(userRow + 1, 12).setValue(""); // Clear Column L
      
      return createResponse({
        success: true,
        message: "Password reset successfully"
      });
      
    } catch (error) {
      return createResponse({ success: false, message: error.toString() });
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: "Email not found"
  })).setMimeType(ContentService.MimeType.JSON);
}