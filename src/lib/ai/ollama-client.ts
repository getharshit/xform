interface OllamaResponse {
    response: string;
    done: boolean;
  }
  
  export class OllamaClient {
    private baseUrl: string;
    private model: string;
  
    constructor() {
      this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
      this.model = process.env.OLLAMA_MODEL|| 'gemma3:12b';
    }
  
    async generateForm(prompt: string) {
      const systemPrompt = `You are a form generation AI. Given a user prompt, generate a JSON response with form structure.
  
  Response format (JSON only):
  {
    "title": "Form Title",
    "description": "Form Description",
    "fields": [
      {
        "id": "field1",
        "type": "text|multipleChoice|dropdown|rating|date",
        "label": "Field Label",
        "required": true,
        "options": ["option1", "option2"] // only for multipleChoice/dropdown
      }
    ]
  }
  
  User prompt: ${prompt}`;
  
      try {
        console.log("Generating Form.....");
        const response = await fetch(`${this.baseUrl}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.model,
            prompt: systemPrompt,
            stream: false,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.statusText}`);
        }
  
        const data: OllamaResponse = await response.json();
        
        // Parse the JSON from the response
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No valid JSON found in response');
        }
  
        return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.error('Error generating form:', error);
        throw error;
      }
    }
  }
  
  export const ollamaClient = new OllamaClient();