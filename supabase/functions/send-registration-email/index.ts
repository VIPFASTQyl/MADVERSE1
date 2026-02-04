import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, authorization, x-client-info, apikey',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, activityId, userName, programName } = await req.json()

    const sendGridKey = Deno.env.get('SENDGRID_API_KEY')
    const adminEmail = Deno.env.get('ADMIN_EMAIL')

    if (!sendGridKey || !adminEmail) {
      console.log('Missing env vars:', { sendGridKey: !!sendGridKey, adminEmail: !!adminEmail })
      return new Response(
        JSON.stringify({ error: 'Missing SENDGRID_API_KEY or ADMIN_EMAIL' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const emailBody = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
      <h2 style="color: #007bff;">✅ New Program Registration</h2>
      <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
        <p><strong>User:</strong> ${userName}</p>
        <p><strong>Program:</strong> ${programName}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <hr style="border: 1px solid #ddd; margin: 20px 0;">
      <p style="text-align: center;">
        <a href="https://madverse-platform.vercel.app/admin" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View in Dashboard</a>
      </p>
    </div>
    `

    console.log('Sending email notification to admin:', adminEmail)

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: adminEmail }],
          },
        ],
        from: { email: 'noreply@madverse.com', name: 'Madverse' },
        subject: `🎯 New Registration: ${programName}`,
        html: emailBody,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('SendGrid error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: error }),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }

    console.log('Email sent successfully!')

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  }
})

