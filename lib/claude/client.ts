// @ts-nocheck
import Anthropic from "@anthropic-ai/sdk";
export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export const MODEL = "claude-sonnet-4-5-20250929";
export async function ask(prompt: string, maxTokens = 1000): Promise<string> {
  const res = await anthropic.messages.create({ model: MODEL, max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] });
  return res.content[0].type === "text" ? res.content[0].text : "";
}
