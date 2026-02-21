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
    const { email, fullName, verificationLink } = await req.json()

    if (!email || !verificationLink) {
      return new Response(
        JSON.stringify({ error: 'Missing email or verification link' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const brevoKey = Deno.env.get('BREVO_API_KEY')
    const fromEmail = Deno.env.get('BREVO_SENDER_EMAIL') || 'noreply@madverse.com'

    if (!brevoKey) {
      console.error('Missing BREVO_API_KEY')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const verificationHTML = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 0;">
          Hi ${fullName || 'there'},
        </p>
        
        <p style="color: #666; font-size: 14px; line-height: 1.8;">
          Welcome to Madverse! Please verify your email address to complete your registration.
        </p>

        <div style="margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #667eea; color: white; padding: 14px 32px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
            Verify Email Address
          </a>
        </div>

        <p style="color: #666; font-size: 13px; line-height: 1.6;">
          Or copy and paste this link in your browser:
        </p>
        <p style="color: #667eea; font-size: 12px; word-break: break-all; background: white; padding: 10px; border-radius: 4px; border-left: 3px solid #667eea;">
          ${verificationLink}
        </p>

        <p style="color: #666; font-size: 13px; line-height: 1.6; margin-top: 20px;">
          This link will expire in 24 hours. If you didn't create this account, please ignore this email.
        </p>

        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; margin-bottom: 0;">
          © Madverse Platform 2026
        </p>
      </div>
    </div>
    `

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
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
            email: email.trim(),
            name: fullName || 'User',
          },
        ],
        subject: 'Verify Your Email - Madverse',
        htmlContent: verificationHTML,
      }),
    })

    if (response.ok) {
      console.log('Verification email sent to:', email)
      return new Response(
        JSON.stringify({ success: true, message: 'Verification email sent' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    } else {
      const error = await response.text()
      console.error('Brevo email error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send verification email', details: error }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
