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
    const { name, email, subject, message } = await req.json()

    const brevoKey = Deno.env.get('BREVO_API_KEY')
    const adminEmail = Deno.env.get('ADMIN_EMAIL')
    const fromEmail = Deno.env.get('BREVO_SENDER_EMAIL') || 'noreply@madverse.com'

    if (!brevoKey || !adminEmail) {
      console.error('Missing BREVO_API_KEY or ADMIN_EMAIL')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Email to admin with user's message
    const adminEmailHTML = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Message</h1>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 0;">
          You have a new message from <strong>${name}</strong>
        </p>

        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
          <p style="margin: 8px 0; color: #333;"><strong>From:</strong> ${name}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></p>
          <p style="margin: 8px 0; color: #333;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Received:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background: #fff9f0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="color: #666; font-size: 14px; line-height: 1.8; margin: 0; white-space: pre-wrap; word-wrap: break-word;">
            ${message}
          </p>
        </div>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            <strong>Reply to:</strong> <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
          </p>
        </div>

        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px; margin-bottom: 0;">
          © Madverse Platform 2026
        </p>
      </div>
    </div>
    `

    // Email to user (confirmation)
    const userEmailHTML = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Message Received</h1>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 0;">
          Hi <strong>${name}</strong>,
        </p>
        
        <p style="color: #666; font-size: 14px; line-height: 1.8;">
          Thank you for reaching out to us! We've received your message and will get back to you as soon as possible.
        </p>

        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
          <p style="margin: 8px 0; color: #333;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Received:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin: 8px 0; color: #666; font-size: 13px;">We'll contact you at: <strong>${email}</strong></p>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          In the meantime, feel free to explore more about Madverse on our website. If you have any urgent questions, you can reply to this email.
        </p>

        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; margin-bottom: 0;">
          This is a confirmation email. Please do not reply to this message.<br>
          © Madverse Platform 2026
        </p>
      </div>
    </div>
    `

    // Send email to ADMIN
    try {
      const adminResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'Madverse Contact Form',
            email: fromEmail,
          },
          to: [
            {
              email: adminEmail,
              name: 'Madverse Admin',
            },
          ],
          subject: `[NEW MESSAGE] ${subject}`,
          htmlContent: adminEmailHTML,
          replyTo: {
            email: email,
            name: name,
          },
        }),
      })

      if (!adminResponse.ok) {
        const adminError = await adminResponse.text()
        console.error('Failed to send admin email:', adminError)
      }
    } catch (adminEmailError) {
      console.error('Error sending admin email:', adminEmailError)
      // Continue to send user email even if admin email fails
    }

    // Send email to USER (confirmation)
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
              email: email,
              name: name,
            },
          ],
          subject: 'We received your message - Madverse',
          htmlContent: userEmailHTML,
        }),
      })

      if (!userResponse.ok) {
        const userError = await userResponse.text()
        console.error('Failed to send user email:', userError)
      }
    } catch (userEmailError) {
      console.error('Error sending user email:', userEmailError)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Contact message received and emails sent' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
