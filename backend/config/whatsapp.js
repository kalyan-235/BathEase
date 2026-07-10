// WhatsApp notification via Twilio
// When a user books, admin gets a WhatsApp message instantly.
//
// Setup steps:
// 1. Sign up at https://www.twilio.com (free trial available)
// 2. Get Account SID, Auth Token from Twilio Console
// 3. Enable WhatsApp Sandbox: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
// 4. Add these to your .env file:
//    TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//    TWILIO_AUTH_TOKEN=your_auth_token
//    TWILIO_WHATSAPP_FROM=whatsapp:+14155238886   (Twilio sandbox number)
//    ADMIN_WHATSAPP=whatsapp:+919XXXXXXXXX        (your WhatsApp number with country code)

const sendAdminWhatsApp = async (booking) => {
  // If Twilio credentials are not configured, skip silently
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, ADMIN_WHATSAPP } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !ADMIN_WHATSAPP) {
    console.warn('⚠️  WhatsApp notifications not configured — set Twilio env vars to enable.');
    return;
  }

  try {
    const twilio = require('twilio');
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    // Format the message
    const miniList = booking.miniServices?.length
      ? `\n➕ Add-ons: ${booking.miniServices.join(', ')}`
      : '';

    const message =
      `🛁 *New BathEase Booking!*\n\n` +
      `📋 ID: ${booking.bookingId}\n` +
      `👤 Customer: ${booking.userEmail}\n` +
      `📞 WhatsApp: ${booking.whatsapp}\n` +
      `🚿 Bathrooms: ${booking.bathroomCount}` +
      miniList + `\n` +
      `📅 Date: ${new Date(booking.date).toDateString()}\n` +
      `⏰ Slot: ${booking.slot}\n` +
      `📍 Address: ${booking.address}\n` +
      `💰 Total: ₹${booking.price?.total}\n` +
      `💳 Payment: ${booking.paymentMethod.toUpperCase()}\n\n` +
      `✅ Status: Confirmed`;

    await client.messages.create({
      body: message,
      from: TWILIO_WHATSAPP_FROM,
      to: ADMIN_WHATSAPP,
    });

    console.log(`✅ WhatsApp notification sent to admin for booking ${booking.bookingId}`);
  } catch (err) {
    // Don't fail the booking if WhatsApp fails
    console.error('❌ WhatsApp notification failed:', err.message);
  }
};

module.exports = { sendAdminWhatsApp };
