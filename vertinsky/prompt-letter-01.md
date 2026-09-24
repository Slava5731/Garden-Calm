# Письмо №1 — промпт для Gemini 3.8 Flash TTS

Модель: `gemini-3.8-flash-tts` (Google AI Studio → Generate speech).
Голос: создаётся по описанию (Voice design), см. блок AUDIO PROFILE.
Запасной вариант из библиотеки голосов: зрелый, мягкий мужской (например, Gacrux или Enceladus, если они есть в списке).

Текст письма вставляется после строки `#### TRANSCRIPT`.

```
# AUDIO PROFILE: Alexander, 67 years old
A Russian stage singer and poet of the old school, born in Kyiv in 1889, speaking in 1956.
Light, slightly nasal lyric baritone with a thin, silvery upper edge; a little worn and tired with age, but still elegant.
Pronounced French-style rolled "r" (grasseyement, "картавит") on every Russian "р".
Old pre-revolutionary Petersburg pronunciation: soft, rounded vowels, "што" instead of "что", "конешно", slightly drawn-out stressed vowels.
Refined, theatrical, a bit mannered, never loud.

## THE SCENE
Late evening, 1956. A cold hotel room in a provincial Soviet town during a long concert tour.
He sits at a small desk under a lamp and reads aloud the letter he has just written to his young wife Lidia and their two little daughters in Moscow.
He misses them terribly; he is tired, a little sad, but tender and full of gentle humour.

### DIRECTOR'S NOTES
Style: intimate and confessional, as if speaking to one person sitting very close. Warm, tender, slightly melancholic, with a light ironic smile on the affectionate nicknames. Theatrical phrasing like his songs, but quiet — no declamation, no radio-announcer tone.
Pace: slow and unhurried. Long pauses between sentences, a short pause before every term of endearment. Let the ends of phrases fade out softly.
Accent: Russian, native, old Petersburg stage speech with a rolled French "r".
Breathing: audible soft breaths before long sentences; an occasional quiet sigh.

#### TRANSCRIPT
[ВСТАВЬТЕ СЮДА ТЕКСТ ПИСЬМА]
```

## Разметка текста письма

Внутри текста можно ставить теги, но только редко, 3–5 на всё письмо:

- `[sigh]` — вздох перед грустной фразой;
- `[short pause]` — пауза перед обращением или в конце абзаца;
- `[softly]` / `[whispers]` — для последней строки и подписи;
- `[gentle laugh]` — на шутливых прозвищах.

Если модель начнёт произносить теги вслух, уберите их и оставьте только DIRECTOR'S NOTES.
