// @ts-nocheck
import Anthropic from "@anthropic-ai/sdk";
export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export const MODEL = "claude-sonnet-4-20250514";
export async function ask(prompt, maxTokens = 1000) {
  const res = await anthropic.messages.create({ model: MODEL, max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] });
  return res.content[0].type === "text" ? res.content[0].text : "";
}
