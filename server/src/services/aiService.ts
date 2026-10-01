import OpenAI from 'openai';
import dotenv from 'dotenv';
import { META_ADS_BRAIN_PROMPT } from '../prompts/metaAdsBrain';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateCampaignStrategy = async (campaignData: any) => {
  try {
    const userPrompt = `
      Please analyze the following business and campaign requirements, and generate a 22-step Meta Ads Strategy.
      
      Business Details Provided:
      - Campaign Type: ${campaignData.type}
      - Target Location: ${campaignData.target_location || 'Not specified'}
      - Target Age: ${campaignData.target_age || 'Not specified'}
      - Target Audience: ${campaignData.target_audience || 'Not specified'}
      - Campaign Goal: ${campaignData.goal}
      - Budget: $${campaignData.budget}
      - Website URL: ${campaignData.website_url || 'N/A'}
      - Post URL: ${campaignData.post_url || 'N/A'}
      - Engagement Type: ${campaignData.engagement_type || 'N/A'}
      - Call To Action: ${campaignData.call_to_action || 'N/A'}
      - Placements: ${campaignData.placements || 'Automatic'}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // using mini for speed and cost-effectiveness during dev
      messages: [
        { role: 'system', content: META_ADS_BRAIN_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI strategy:', error);
    throw new Error('Failed to generate AI strategy. Please check your API key.');
  }
};
