export const otpEmail=(otp)=>`<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0; background:#f5f7fb;">
<head>
    <meta charset="UTF-8" />
    <title>OTP Verification</title>
</head>

<body style="margin:0; padding:0; font-family:Arial, sans-serif; background:#f5f7fb;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb; padding:40px 0;">
        <tr>
            <td align="center">

                <!-- Main Card -->
                <table width="550" cellpadding="0" cellspacing="0" 
                       style="background:#ffffff; border-radius:12px; padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

                    <!-- Illustration -->
                    <tr>
                        <td align="center">
                            <img src="https://cdn.templates.unlayer.com/assets/1701676201199-password.png" 
                                 width="130" style="margin-bottom:20px; " alt="secure">
                        </td>
                    </tr>

                    <!-- Title -->
                    <tr>
                        <td align="center" 
                            style="font-size:22px; font-weight:700; color:#222; padding-bottom:5px;">
                            Your One-Time Password (OTP)
                        </td>
                    </tr>

                    <!-- Subtitle -->
                    <tr>
                        <td align="center" 
                            style="font-size:14px; color:#555; padding-bottom:25px;">
                            Use the code below to verify your login.  
                        </td>
                    </tr>

                    <!-- OTP Box -->
                    <tr>
                        <td align="center">
                            <div style="
                                font-size:32px; 
                                letter-spacing:5px;
                                padding:14px 24px; 
                                background:#f0f4ff; 
                                color:#1a3cff;
                                font-weight:bold; 
                                border-radius:10px; 
                                display:inline-block;
                                border:1px solid #dbe3ff;">
                                ${otp}
                            </div>
                        </td>
                    </tr>

                    <!-- Info -->
                    <tr>
                        <td align="center" 
                            style="font-size:13px; color:#777; line-height:20px; padding-top:25px;">
                            This code is valid for <strong>20 minutes</strong>.<br>
                            Do not share it with anyone for security reasons.
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding-top:30px;">
                            <hr style="border:0; height:1px; background:#eee;">
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" 
                            style="font-size:12px; color:#999; padding-top:10px;">
                            If you didn’t request this, please ignore this email.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
`;