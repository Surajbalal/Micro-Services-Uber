const crypto = require("crypto");

const generateOtp = () => {
  return crypto.randomInt(0, 1000000).toString().padStart(6, '0');
};

const getOtpHtml = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>OTP Verification</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
    
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">
          
          <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; padding:20px; border-radius:8px;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h2 style="margin:0; color:#333;">🔐 OTP Verification</h2>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="color:#555; font-size:16px; text-align:center;">
                <p>Your One-Time Password (OTP) is:</p>
              </td>
            </tr>

            <!-- OTP Box -->
            <tr>
              <td align="center" style="padding:20px 0;">
                <div style="font-size:32px; font-weight:bold; letter-spacing:5px; color:#2d89ef;">
                  ${otp}
                </div>
              </td>
            </tr>

            <!-- Info -->
            <tr>
              <td style="color:#777; font-size:14px; text-align:center;">
                <p>This OTP is valid for <b>5 minutes</b>.</p>
                <p>Please do not share this code with anyone.</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding-top:20px; text-align:center; font-size:12px; color:#aaa;">
                <p>If you didn’t request this, you can safely ignore this email.</p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};

module.exports = {generateOtp, getOtpHtml}