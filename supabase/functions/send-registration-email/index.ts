import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, authorization, x-client-info, apikey',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, activityId, userName, programName, userEmail } = await req.json()

    const brevoKey = Deno.env.get('BREVO_API_KEY')
    const adminEmail = Deno.env.get('ADMIN_EMAIL')
    const fromEmail = Deno.env.get('BREVO_SENDER_EMAIL') || 'noreply@madverse.com'

    if (!brevoKey) {
      console.error('Missing BREVO_API_KEY')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Send confirmation email to USER
    if (userEmail && userEmail.trim()) {
      const userEmailHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Registration Confirmed</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 0;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #666; font-size: 14px; line-height: 1.8;">
            You're all set! Your registration for <strong>${programName}</strong> is confirmed.
          </p>

          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
            <p style="margin: 8px 0; color: #333;"><strong>Program:</strong> ${programName}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            We're excited to have you! If you have any questions, don't hesitate to reach out to our support team.
          </p>

          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; margin-bottom: 0;">
            This is a confirmation email. Please do not reply to this message.<br>
            © Madverse Platform 2026.\n
          </p>
        </div>
      </div>
      `

      try {
        const userResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: {
              name: 'Madverse',
              email: fromEmail,
            },
            to: [
              {
                email: userEmail.trim(),
                name: userName,
              },
            ],
            subject: `Registration Confirmed: ${programName}`,
            htmlContent: userEmailHTML,
            replyTo: {
              email: adminEmail || 'support@madverse.com',
            },
          }),
        })

        if (userResponse.ok) {
          console.log('Confirmation email sent to user:', userEmail)
        } else {
          const error = await userResponse.text()
          console.error('Brevo user email error:', error)
        }
      } catch (e) {
        console.error('User email fetch error:', e)
      }
    }

    // Send notification to ADMIN
    if (adminEmail && adminEmail.trim() && adminEmail !== userEmail) {
      const adminEmailHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #667eea; margin-top: 0;">New Program Registration</h2>
          
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #eee;">
            <p style="margin: 8px 0;"><strong>User:</strong> ${userName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${userEmail || 'N/A'}</p>
            <p style="margin: 8px 0;"><strong>Program:</strong> ${programName}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="margin-top: 15px;">
            <a href="https://madverse-platform.vercel.app/admin" style="background-color: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View in Dashboard</a>
          </div>
        </div>
      </div>
      `

      try {
        const adminResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: {
              name: 'Madverse',
              email: fromEmail,
            },
            to: [
              {
                email: adminEmail.trim(),
                name: 'Admin',
              },
            ],
            subject: `New Registration: ${programName}`,
            htmlContent: adminEmailHTML,
          }),
        })

        if (adminResponse.ok) {
          console.log('Admin notification sent')
        } else {
          const error = await adminResponse.text()
          console.error('Brevo admin email error:', error)
        }
      } catch (e) {
        console.error('Admin email fetch error:', e)
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Emails queued for delivery' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})


