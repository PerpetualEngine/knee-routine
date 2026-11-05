# Pre-renders every spoken phrase with a neural voice (edge-tts, en-US-AvaNeural).
# Run: node tools_phrases.js > phrases.json && python3 gen_audio.py
import asyncio, json, os, edge_tts
VOICE = "en-US-AvaNeural"
def h(s):
    x = 5381
    for c in s:
        x = ((x * 33) ^ ord(c)) & 0xFFFFFFFF
    return format(x, "x")
async def one(sem, t, out):
    f = f"audio/{h(t)}.mp3"
    if os.path.exists(f) and os.path.getsize(f) > 0: return
    short = len(t) < 20
    async with sem:
        for _ in range(3):
            try:
                await edge_tts.Communicate(t, VOICE, rate="+0%" if short else "-6%").save(f); return
            except Exception as e:
                err = e; await asyncio.sleep(2)
        print("FAILED", t[:40], err)
async def main():
    os.makedirs("audio", exist_ok=True)
    ph = json.load(open("phrases.json"))
    sem = asyncio.Semaphore(4)
    await asyncio.gather(*[one(sem, t, None) for t in ph])
    ok = [h(t) for t in ph if os.path.exists(f"audio/{h(t)}.mp3")]
    json.dump(ok, open("audio/manifest.json", "w"))
    import subprocess
    d = {}
    for k in ok:
        o = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"audio/{k}.mp3"], capture_output=True, text=True).stdout.strip()
        if o: d[k] = round(float(o), 2)
    json.dump(d, open("audio/durations.json", "w"))
    print(len(ok), "of", len(ph))
asyncio.run(main())
