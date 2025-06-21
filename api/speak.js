export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      return res.status(400).json({ error: "Missing text" });
    }

    const elevenlabsApiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = "EXAVITQu4vr4xnSDxMaL"; // You can replace this with your cloned voice ID

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": elevenlabsApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1", // or eleven_multilingual_v2
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error });
    }

    const audioBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "inline; filename=voice.mp3");
    res.status(200).send(Buffer.from(audioBuffer));
  } catch (error) {
    res.status(500).json({ error: "Failed to synthesize speech" });
  }
}
