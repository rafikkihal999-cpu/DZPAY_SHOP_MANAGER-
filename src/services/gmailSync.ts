/**
 * DZPAY SHOP - Gmail Cloud Data Sync & Backup Service
 * Performs cloud backups and data synchronization directly with Gmail API
 */

export interface ShopBackupPayload {
  shopName: string;
  branchName: string;
  managerEmail: string;
  wilaya: string;
  currency: string;
  timestamp: string;
  formattedDate: string;
  metrics: {
    totalProductsCount: number;
    totalStockUnits: number;
    inventoryValuationDZD: number;
    lowStockAlertsCount: number;
    todaySalesCount: number;
    todayRevenueDZD: number;
    customersCount: number;
  };
  inventorySample: Array<{
    name: string;
    brand?: string;
    stock: number;
    sellingPrice: number;
    barcode?: string;
  }>;
  customData?: Record<string, unknown>;
}

export interface GmailBackupMessage {
  id: string;
  threadId: string;
  subject: string;
  date: string;
  snippet: string;
}

/**
 * UTF-8 safe Base64URL encoder (RFC 4648 § 5)
 */
export function base64UrlEncode(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Base64 encoder for binary/attachment data
 */
export function base64EncodeUnicode(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary);
}

/**
 * Construct an RFC 2822 Multipart MIME email message with HTML body and JSON file attachment
 */
export function buildMimeBackupMessage(
  toEmail: string,
  backupData: ShopBackupPayload
): string {
  const boundary = `====DZPAY_BOUNDARY_${Date.now()}====`;
  const subject = `📱 [DZPAY SHOP] نسخة احتياطية سحابية وموجز بيانات المحل - ${backupData.formattedDate}`;
  const jsonAttachment = JSON.stringify(backupData, null, 2);
  const jsonAttachmentBase64 = base64EncodeUnicode(jsonAttachment);
  const attachmentFilename = `dzpay-backup-${new Date().toISOString().slice(0, 10)}.json`;

  const htmlBody = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #0b1329; color: #f1f5f9; padding: 24px; margin: 0; }
    .card { background: #0f1a36; border: 1px solid #1e2f54; border-radius: 16px; padding: 24px; max-width: 600px; margin: 0 auto; }
    .header { border-bottom: 1px solid #1e2f54; padding-bottom: 16px; margin-bottom: 20px; }
    .title { color: #38bdf8; font-size: 20px; font-weight: bold; margin: 0 0 6px 0; }
    .subtitle { color: #94a3b8; font-size: 13px; margin: 0; }
    .badge { display: inline-block; padding: 4px 10px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid #0284c7; border-radius: 9999px; font-size: 12px; font-weight: bold; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
    .stat-box { background: #162447; border: 1px solid #1e305e; border-radius: 12px; padding: 14px; text-align: center; }
    .stat-val { font-size: 20px; font-weight: bold; color: #10b981; margin: 4px 0 0 0; }
    .stat-lbl { font-size: 11px; color: #94a3b8; text-transform: uppercase; }
    .table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
    .table th, .table td { padding: 8px 10px; text-align: right; border-bottom: 1px solid #1e2f54; }
    .table th { color: #94a3b8; background: #142042; }
    .footer { font-size: 11px; color: #64748b; margin-top: 24px; text-align: center; border-top: 1px solid #1e2f54; padding-top: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">☁️ مزامنة سحابية مؤكدة</span>
      <h1 class="title">${backupData.shopName}</h1>
      <p class="subtitle">${backupData.branchName} • ولاية ${backupData.wilaya} • التاريخ: ${backupData.formattedDate}</p>
    </div>

    <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
      تم إنشاء نسخة احتياطية سحابية كاملة لقاعدة بيانات المحل والمخزون بنجاح وحفظها في بريدك الإلكتروني Gmail. الملف المرفق أدناه (<code>${attachmentFilename}</code>) يحتوي على البيانات الكاملة بصيغة JSON.
    </p>

    <div class="grid">
      <div class="stat-box">
        <div class="stat-lbl">عدد أصناف المنتجات</div>
        <div class="stat-val" style="color: #38bdf8;">${backupData.metrics.totalProductsCount} صنف</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">إجمالي قطع المخزون</div>
        <div class="stat-val" style="color: #60a5fa;">${backupData.metrics.totalStockUnits} قطعة</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">القيمة التقديرية للمخزون</div>
        <div class="stat-val" style="color: #34d399;">${backupData.metrics.inventoryValuationDZD.toLocaleString()} د.ج</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">تنبيهات نواقص المخزون</div>
        <div class="stat-val" style="color: ${backupData.metrics.lowStockAlertsCount > 0 ? '#f43f5e' : '#10b981'};">
          ${backupData.metrics.lowStockAlertsCount} صنف
        </div>
      </div>
    </div>

    <div class="footer">
      تم إرسال هذا التقرير الاحتياطي التلقائي من نظام إدارة المحلات DZPAY SHOP • حساب المدير: ${backupData.managerEmail}
    </div>
  </div>
</body>
</html>
  `.trim();

  // Construct MIME
  const mimeMessage = [
    `To: ${toEmail}`,
    `Subject: =?UTF-8?B?${base64EncodeUnicode(subject)}?=`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: 8bit`,
    '',
    htmlBody,
    '',
    `--${boundary}`,
    `Content-Type: application/json; name="${attachmentFilename}"`,
    `Content-Disposition: attachment; filename="${attachmentFilename}"`,
    `Content-Transfer-Encoding: base64`,
    '',
    jsonAttachmentBase64,
    '',
    `--${boundary}--`,
  ].join('\r\n');

  return mimeMessage;
}

/**
 * Send backup email to user's Gmail using Gmail API
 */
export async function syncBackupToGmail(
  accessToken: string,
  backupData: ShopBackupPayload
): Promise<{ success: boolean; messageId: string }> {
  if (!accessToken) {
    throw new Error('رمز الدخول غير متوفر. يرجى تسجيل الدخول بحساب Google أولاً.');
  }

  const mimeString = buildMimeBackupMessage(backupData.managerEmail, backupData);
  const rawBase64Url = base64UrlEncode(mimeString);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: rawBase64Url,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Gmail API send error:', errText);
    throw new Error(`فشل إرسال النسخة الاحتياطية إلى Gmail: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    success: true,
    messageId: data.id,
  };
}

/**
 * List previous cloud backups stored in Gmail
 */
export async function listGmailBackups(
  accessToken: string
): Promise<GmailBackupMessage[]> {
  if (!accessToken) return [];

  try {
    const query = encodeURIComponent('subject:("DZPAY SHOP" "نسخة احتياطية")');
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.warn('Could not query Gmail messages:', response.status);
      return [];
    }

    const data = await response.json();
    const messages = data.messages || [];

    const backups: GmailBackupMessage[] = [];

    // Fetch details for up to 5 messages to avoid rate limits
    for (const msg of messages.slice(0, 5)) {
      try {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=Date`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (detailRes.ok) {
          const detail = await detailRes.json();
          const headers = detail.payload?.headers || [];
          const subjectHeader = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'subject');
          const dateHeader = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'date');

          backups.push({
            id: detail.id,
            threadId: detail.threadId,
            subject: subjectHeader?.value || 'نسخة احتياطية سحابية',
            date: dateHeader?.value ? new Date(dateHeader.value).toLocaleString('ar-DZ') : 'حديثاً',
            snippet: detail.snippet || '',
          });
        }
      } catch (innerErr) {
        console.warn('Error fetching message details:', innerErr);
      }
    }

    return backups;
  } catch (error) {
    console.error('Failed to list Gmail backups:', error);
    return [];
  }
}
