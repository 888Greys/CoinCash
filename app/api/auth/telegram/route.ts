import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Verifies the cryptographic hash sent by the Telegram widget
function verifyTelegramWebAppData(data: any, botToken: string): boolean {
  if (!data || !data.hash) return false;
  
  const secret = crypto.createHash('sha256').update(botToken).digest();
  
  const array: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (key !== 'hash') {
      array.push(`${key}=${value}`);
    }
  }
  array.sort();
  const dataCheckString = array.join('\n');

  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
  return hmac === data.hash;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return NextResponse.json({ error: 'Server misconfiguration: missing bot token' }, { status: 500 });
    }

    if (!verifyTelegramWebAppData(payload, botToken)) {
      return NextResponse.json({ error: 'Invalid Telegram hash' }, { status: 403 });
    }

    // Hash is valid! 
    // We instantiate the Supabase Admin client to bypass normal auth restrictions
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Format a pseudo-email for the user based on their Telegram ID
    const generatedEmail = `${payload.id}@telegram.local`;
    
    // Check if user exists, if not, wait for generateLink to implicitly create it
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: generatedEmail,
      options: {
        data: {
          full_name: `${payload.first_name || ''} ${payload.last_name || ''}`.trim(),
          username: payload.username,
          avatar_url: payload.photo_url,
          telegram_id: payload.id
        }
      }
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error(linkError);
      return NextResponse.json({ error: 'Failed to generate session' }, { status: 500 });
    }

    // We return the magic action link back to the client
    // When the client visits this link, Supabase instantly establishes their secure session.
    return NextResponse.json({ url: linkData.properties.action_link });

  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
