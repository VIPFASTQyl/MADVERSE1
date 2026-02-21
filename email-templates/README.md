# Email Templates

This directory contains HTML email templates for Madverse authentication flows.

## Files

- **confirmation-email-en.html** - English email confirmation template
- **confirmation-email-sq.html** - Albanian email confirmation template

## How to Use

### Option 1: Supabase Built-in Email Service

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Email Templates**
3. Select **"Confirm signup"**
4. Click the **Edit** button (pencil icon)
5. Copy the HTML content from `confirmation-email-en.html`
6. Paste it into the editor
7. Click **Save**

### Option 2: Custom SMTP Provider

If using a custom email service (Brevo, SendGrid, etc.):

1. Use these templates as-is
2. Replace `{{ .ConfirmationURL }}` with your email service variable
3. Configure your backend to send these emails

## Template Variables

- `{{ .ConfirmationURL }}` - Supabase confirmation link (auto-filled)
- `{{ .Email }}` - User's email address (optional)

## Multilingual Support

The templates are organized by language:
- **-en** = English
- **-sq** = Albanian

To add more languages:
1. Create new template file: `confirmation-email-[lang-code].html`
2. Translate the content
3. Update email service to use language preference

## Customization

Feel free to modify:
- Colors (#667eea is the primary color)
- Company name/branding
- Text content
- Typography and spacing

## Notes

- Keep `{{ .ConfirmationURL }}` variable intact
- HTML is responsive and works on mobile/desktop
- Plain text versions stored as backup if needed
