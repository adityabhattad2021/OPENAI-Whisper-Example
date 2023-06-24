import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.formData();
    const fileToSend: File | null = data.get("file") as File;
    const formData = new FormData();
    formData.append("file", fileToSend);
    formData.append("model", "whisper-1");
    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
      }
    );
    const body = await response.json();

    return NextResponse.json({ output: body, status: 200 });
  } catch (error) {
    return NextResponse.json({ output: error, status: 500 });
  }
}
