import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { sendLoginAlertEmail } from '@/lib/email-notifications'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/home'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        const forwardedFor = request.headers.get('x-forwarded-for')
        const ipAddress = forwardedFor?.split(',')[0]?.trim() ?? null
        await sendLoginAlertEmail({
          email: user.email,
          method: 'oauth',
          ipAddress,
        })
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
