interface OllamaResponse {
  response: string;
  done: boolean;
}

export class OllamaClient {
  private baseUrl: string;
  private model: string;
  private timeout: number;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
    this.model = process.env.OLLAMA_MODEL || 'gemma2:2b'; // Using a smaller, faster model by default
    this.timeout = 60000; // 60 seconds timeout
  }

  async generateForm(prompt: string) {
    const systemPrompt = `You are a form generation AI. Create a JSON structure for a form based on the user's description. 

IMPORTANT: Return ONLY valid JSON, no additional text or formatting.

Required JSON structure:
{
  "title": "Form Title (max 100 chars)",
  "description": "Brief form description (max 200 chars)", 
  "fields": [
    {
      "id": "unique_field_id",
      "type": "field_type",
      "label": "Field Label",
      "required": true/false,
      "placeholder": "placeholder text (optional)",
      "options": ["option1", "option2"] // only for multipleChoice/dropdown
    }
  ]
}

Available field types:
- shortText: Single line text input
- longText: Multi-line text area
- email: Email address input
- website: Website URL input  
- phoneNumber: Phone number input
- multipleChoice: Radio buttons (include options array)
- dropdown: Select dropdown (include options array)
- yesNo: Yes/No question
- numberRating: Rating scale (1-5 stars)
- opinionScale: 1-10 opinion scale
- statement: Display text/instructions
- legal: Terms/agreement checkbox
- fileUpload: File upload field

Guidelines:
- Use appropriate field types for the content
- Keep labels clear and concise
- For choice fields, provide 3-5 relevant options
- Set required:true for essential fields
- Add helpful placeholder text for text inputs

User request: "${prompt}"

Generate the JSON now:`;

    try {
      console.log('Sending request to Ollama API...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: systemPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 2000,
            stop: ['\n\n\n', '```', 'Human:', 'Assistant:']
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ollama API error response:', errorText);
        throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: OllamaResponse = await response.json();
      console.log('Raw Ollama response:', data.response);
      
      if (!data.response) {
        throw new Error('Empty response from Ollama API');
      }

      // Clean up the response - remove any markdown formatting or extra text
      let cleanResponse = data.response.trim();
      
      // Remove markdown code blocks if present
      cleanResponse = cleanResponse.replace(/```json\s*/g, '');
      cleanResponse = cleanResponse.replace(/```\s*/g, '');
      cleanResponse = cleanResponse.replace(/^json\s*/g, '');
      
      // Find JSON content - look for the first { to the last }
      const firstBrace = cleanResponse.indexOf('{');
      const lastBrace = cleanResponse.lastIndexOf('}');
      
      if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
        console.error('No valid JSON structure found in response:', cleanResponse);
        throw new Error('No valid JSON found in AI response');
      }
      
      const jsonString = cleanResponse.substring(firstBrace, lastBrace + 1);
      console.log('Extracted JSON string:', jsonString);
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Attempted to parse:', jsonString);
        
        // Try to fix common JSON issues
        let fixedJson = jsonString
          .replace(/'/g, '"')  // Replace single quotes with double quotes
          .replace(/(\w+):/g, '"$1":')  // Quote unquoted keys
          .replace(/,\s*}/g, '}')  // Remove trailing commas
          .replace(/,\s*]/g, ']');  // Remove trailing commas in arrays
        
        try {
          parsedResponse = JSON.parse(fixedJson);
          console.log('Successfully parsed fixed JSON');
        } catch (secondParseError) {
          console.error('Even fixed JSON failed to parse:', secondParseError);
          throw new Error('Invalid JSON format in AI response');
        }
      }

      // Validate the response structure
      if (!parsedResponse || typeof parsedResponse !== 'object') {
        throw new Error('AI response is not a valid object');
      }

      // Ensure required fields exist
      if (!parsedResponse.title) {
        parsedResponse.title = 'AI Generated Form';
      }

      if (!parsedResponse.description) {
        parsedResponse.description = 'Form generated by AI';
      }

      if (!Array.isArray(parsedResponse.fields)) {
        console.warn('No fields array found, creating default fields');
        parsedResponse.fields = [
          {
            id: 'field_1',
            type: 'shortText',
            label: 'Your Response',
            required: false
          }
        ];
      }

      // Validate each field
      parsedResponse.fields = parsedResponse.fields.map((field: any, index: number) => {
        if (!field || typeof field !== 'object') {
          return {
            id: `field_${index + 1}`,
            type: 'shortText',
            label: `Question ${index + 1}`,
            required: false
          };
        }

        return {
          ...field,
          id: field.id || `field_${index + 1}`,
          type: field.type || 'shortText',
          label: field.label || `Question ${index + 1}`,
          required: Boolean(field.required)
        };
      });

      console.log('Successfully processed AI response:', {
        title: parsedResponse.title,
        fieldCount: parsedResponse.fields.length
      });

      return parsedResponse;

    } catch (error) {
      console.error('Error in Ollama generateForm:', error);
      
      if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'AbortError') {
        throw new Error('AI request timed out - please try again with a shorter prompt');
      }
      
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string' && (error as any).message.includes('fetch')) {
        throw new Error('Unable to connect to AI service - please check if Ollama is running');
      }
      
      throw error;
    }
  }

  // Health check method
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get available models
  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch {
      return [];
    }
  }
}

export const ollamaClient = new OllamaClient();