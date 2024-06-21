import { type NextRequest, NextResponse } from 'next/server'

const handler = (req: NextRequest): NextResponse => {
  return NextResponse.json({ test: req.nextUrl.pathname })
}

export { handler as GET, handler as POST }
