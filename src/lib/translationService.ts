const TRANSLATION_ENDPOINT = "https://api.mymemory.translated.net/get";
const MAX_SEGMENT_BYTES = 450;

interface MyMemoryResponse {
  responseData?: {
    translatedText?: string;
  };
  responseStatus?: number | string;
  responseDetails?: string;
}

const byteLength = (value: string) => new TextEncoder().encode(value).length;

const splitLongToken = (token: string) => {
  const chunks: string[] = [];
  let current = "";

  for (const character of token) {
    if (current && byteLength(current + character) > MAX_SEGMENT_BYTES) {
      chunks.push(current);
      current = character;
    } else {
      current += character;
    }
  }

  if (current) chunks.push(current);
  return chunks;
};

const splitIntoSegments = (text: string) => {
  const segments: string[] = [];
  let current = "";

  for (const token of text.split(/(\s+)/)) {
    if (!token) continue;
    if (byteLength(token) > MAX_SEGMENT_BYTES) {
      if (current.trim()) segments.push(current.trim());
      segments.push(...splitLongToken(token));
      current = "";
    } else if (current && byteLength(current + token) > MAX_SEGMENT_BYTES) {
      segments.push(current.trim());
      current = token.trimStart();
    } else {
      current += token;
    }
  }

  if (current.trim()) segments.push(current.trim());
  return segments;
};

const decodeHtmlEntities = (value: string) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

const translateSegment = async (segment: string) => {
  const params = new URLSearchParams({
    q: segment,
    langpair: "en|sq-AL",
    mt: "1",
  });
  const response = await fetch(`${TRANSLATION_ENDPOINT}?${params.toString()}`);
  const payload = (await response.json()) as MyMemoryResponse;

  if (!response.ok || String(payload.responseStatus ?? "200") !== "200") {
    throw new Error(payload.responseDetails || "The translation service could not translate this content.");
  }

  const translated = payload.responseData?.translatedText?.trim();
  if (!translated) throw new Error("The translation service returned an empty translation.");
  return decodeHtmlEntities(translated);
};

export const translateEnglishToAlbanian = async (text: string) => {
  const paragraphs = text.split(/\n{2,}/);
  const translatedParagraphs: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) continue;
    const segments = splitIntoSegments(paragraph);
    const translatedSegments: string[] = [];
    for (const segment of segments) translatedSegments.push(await translateSegment(segment));
    translatedParagraphs.push(translatedSegments.join(" "));
  }

  return translatedParagraphs.join("\n\n");
};

export const translateActivityCopyToAlbanian = async (copy: {
  label: string;
  heading: string;
  description: string;
}) => {
  const [label, heading, description] = await Promise.all([
    translateEnglishToAlbanian(copy.label),
    translateEnglishToAlbanian(copy.heading),
    translateEnglishToAlbanian(copy.description),
  ]);

  return { label, heading, description };
};
