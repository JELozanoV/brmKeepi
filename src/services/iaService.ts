// src/services/iaService.ts
import axios from 'axios';

export interface IAResponse {
  response: string;
}

export async function askIA(text: string, sessionId: string): Promise<IAResponse> {
  try {
    const res = await axios.post('http://localhost:3000/api/ia', { sessionId, prompt: text });
    return res.data;
  } catch (error: any) {
    throw error;
  }
}
