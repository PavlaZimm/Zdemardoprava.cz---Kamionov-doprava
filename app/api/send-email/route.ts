import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()

  const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL
  if (!makeWebhookUrl) {
    return NextResponse.json({ error: 'Webhook URL není nastavena' }, { status: 500 })
  }

  try {
    const res = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Make webhook selhal: ' + res.status }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Webhook error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
