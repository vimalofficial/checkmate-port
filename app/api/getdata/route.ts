import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      latitude,
      longitude,
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      speed,
      timestamp,
      screenWidth,
      screenHeight,
      colorDepth,
      pixelRatio,
      timezone,
      language,
      languages,
      platform,
      userAgent,
      referrer,
      currentUrl,
      event
    } = body;

    // --------------------------------------------------
    // SERVER-SIDE REQUEST INFORMATION
    // --------------------------------------------------

    const forwardedFor = req.headers.get("x-forwarded-for");

    const realIp =
      forwardedFor?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "Unavailable";

    const requestUserAgent =
      req.headers.get("user-agent") || userAgent || "Unavailable";

    const referer =
      req.headers.get("referer") ||
      referrer ||
      "Unavailable";

    const acceptLanguage =
      req.headers.get("accept-language") ||
      "Unavailable";

    const host =
      req.headers.get("host") ||
      "Unavailable";

    const forwardedHost =
      req.headers.get("x-forwarded-host") ||
      "Unavailable";

    const forwardedProto =
      req.headers.get("x-forwarded-proto") ||
      "Unavailable";

    // --------------------------------------------------
    // TRANSPORTER
    // --------------------------------------------------

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // --------------------------------------------------
    // LOCATION
    // --------------------------------------------------

    const hasLocation =
      typeof latitude === "number" &&
      typeof longitude === "number";

    const locationSection = hasLocation
      ? `
        <h3>📍 Exact Browser Location</h3>

        <table cellpadding="8" cellspacing="0" border="1">
          <tr>
            <td><strong>Latitude</strong></td>
            <td>${latitude}</td>
          </tr>

          <tr>
            <td><strong>Longitude</strong></td>
            <td>${longitude}</td>
          </tr>

          <tr>
            <td><strong>Accuracy</strong></td>
            <td>${accuracy ?? "Unavailable"} meters</td>
          </tr>

          <tr>
            <td><strong>Altitude</strong></td>
            <td>${altitude ?? "Unavailable"}</td>
          </tr>

          <tr>
            <td><strong>Altitude Accuracy</strong></td>
            <td>${altitudeAccuracy ?? "Unavailable"}</td>
          </tr>

          <tr>
            <td><strong>Heading</strong></td>
            <td>${heading ?? "Unavailable"}</td>
          </tr>

          <tr>
            <td><strong>Speed</strong></td>
            <td>${speed ?? "Unavailable"}</td>
          </tr>

          <tr>
            <td><strong>Location Timestamp</strong></td>
            <td>${timestamp ?? "Unavailable"}</td>
          </tr>
        </table>
      `
      : `
        <h3>📍 Location</h3>

        <p>
          <strong>Exact GPS location was not provided.</strong>
        </p>

        <p>
          The visitor may have denied browser location permission
          or the browser may not support geolocation.
        </p>
      `;

    // --------------------------------------------------
    // SEND EMAIL TO ADMIN
    // --------------------------------------------------

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,

      subject: `🔔 Portfolio Activity - ${
        event || "Visitor"
      }`,

      html: `
        <!DOCTYPE html>

        <html>

        <body>

          <h2>🔔 Portfolio Visitor Activity</h2>

          <hr />

          <h3>👤 Visitor</h3>

          <table cellpadding="8" cellspacing="0" border="1">

            <tr>
              <td><strong>Email</strong></td>
              <td>${email || "Not provided"}</td>
            </tr>

            <tr>
              <td><strong>Event</strong></td>
              <td>${event || "Unknown"}</td>
            </tr>

            <tr>
              <td><strong>Time</strong></td>
              <td>${new Date().toISOString()}</td>
            </tr>

          </table>

          <br />

          ${locationSection}

          <br />

          <h3>🌐 Network Information</h3>

          <table cellpadding="8" cellspacing="0" border="1">

            <tr>
              <td><strong>IP Address</strong></td>
              <td>${realIp}</td>
            </tr>

            <tr>
              <td><strong>Host</strong></td>
              <td>${host}</td>
            </tr>

            <tr>
              <td><strong>Forwarded Host</strong></td>
              <td>${forwardedHost}</td>
            </tr>

            <tr>
              <td><strong>Protocol</strong></td>
              <td>${forwardedProto}</td>
            </tr>

            <tr>
              <td><strong>Referer</strong></td>
              <td>${referer}</td>
            </tr>

            <tr>
              <td><strong>Accept Language</strong></td>
              <td>${acceptLanguage}</td>
            </tr>

          </table>

          <br />

          <h3>💻 Device Information</h3>

          <table cellpadding="8" cellspacing="0" border="1">

            <tr>
              <td><strong>User Agent</strong></td>
              <td>${requestUserAgent}</td>
            </tr>

            <tr>
              <td><strong>Platform</strong></td>
              <td>${platform || "Unavailable"}</td>
            </tr>

            <tr>
              <td><strong>Language</strong></td>
              <td>${language || "Unavailable"}</td>
            </tr>

            <tr>
              <td><strong>Languages</strong></td>
              <td>${languages || "Unavailable"}</td>
            </tr>

            <tr>
              <td><strong>Screen</strong></td>
              <td>
                ${
                  screenWidth && screenHeight
                    ? `${screenWidth} × ${screenHeight}`
                    : "Unavailable"
                }
              </td>
            </tr>

            <tr>
              <td><strong>Color Depth</strong></td>
              <td>${colorDepth || "Unavailable"}</td>
            </tr>

            <tr>
              <td><strong>Pixel Ratio</strong></td>
              <td>${pixelRatio || "Unavailable"}</td>
            </tr>

            <tr>
              <td><strong>Timezone</strong></td>
              <td>${timezone || "Unavailable"}</td>
            </tr>

          </table>

          <br />

          <h3>🔗 Page Information</h3>

          <table cellpadding="8" cellspacing="0" border="1">

            <tr>
              <td><strong>Current URL</strong></td>
              <td>${currentUrl || "Unavailable"}</td>
            </tr>

            <tr>
              <td><strong>Referrer</strong></td>
              <td>${referrer || "Unavailable"}</td>
            </tr>

          </table>

          <br />

          <hr />

          <p>
            <strong>Portfolio Notification System</strong>
          </p>

        </body>

        </html>
      `
    });

    return NextResponse.json({
      success: true,
      message: "Visitor information received"
    });

  } catch (error) {

    console.error("GETDATA ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to collect visitor information"
      },
      {
        status: 500
      }
    );
  }
}