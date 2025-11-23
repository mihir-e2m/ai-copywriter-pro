import { FormState } from '../types';

export async function generateBlogFromPrompt(promptText: string): Promise<string> {
    const GENERATE_BASE_URL = import.meta.env.VITE_GENERATE_BASE_URL;
    if (!GENERATE_BASE_URL) {
        throw new Error("VITE_GENERATE_BASE_URL is not defined in .env");
    }

    const payload = {
        type: 'chat',
        text: promptText
    };

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📤 GENERATE BLOG API REQUEST (type: chat)');
    console.log('URL:', GENERATE_BASE_URL);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        const response = await fetch(GENERATE_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(payload),
        });

        console.log('📥 GENERATE BLOG API RESPONSE');
        console.log('Status:', response.status, response.statusText);

        const responseText = await response.text();
        console.log('Raw Response:', responseText);
        console.log('Response Length:', responseText.length, 'characters');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (!response.ok) {
            throw new Error(`Generate Blog API failed: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
        }

        if (!responseText || responseText.trim() === '') {
            throw new Error('Generate Blog API returned empty response');
        }

        try {
            const data = JSON.parse(responseText);
            console.log('✅ Parsed Response:', data);
            return data.output || data.text || data.message || data.response || (typeof data === 'string' ? data : JSON.stringify(data));
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError);
            return responseText;
        }
    } catch (error) {
        console.error('❌ GENERATE BLOG API ERROR:', error);
        throw error;
    }
}

export async function sendChatMessage(text: string): Promise<string> {
    const CHAT_BASE_URL = import.meta.env.VITE_CHAT_BASE_URL;
    if (!CHAT_BASE_URL) {
        throw new Error("VITE_CHAT_BASE_URL is not defined in .env");
    }

    try {
        // Ensure text is a string to avoid object injection
        const safeText = typeof text === 'string' ? text : JSON.stringify(text);

        const payload = {
            type: 'chat',
            text: safeText
        };

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📤 CHAT API REQUEST');
        console.log('URL:', CHAT_BASE_URL);
        console.log('Payload:', JSON.stringify(payload, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const response = await fetch(CHAT_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(payload),
        });

        console.log('📥 CHAT API RESPONSE');
        console.log('Status:', response.status, response.statusText);

        const responseText = await response.text();
        console.log('Raw Response:', responseText);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (!response.ok) {
            throw new Error(`Chat API failed: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
        }

        try {
            const data = JSON.parse(responseText);
            console.log('Parsed Response:', data);
            return data.text || data.output || data.message || data.response || (typeof data === 'string' ? data : JSON.stringify(data));
        } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError);
            return responseText;
        }
    } catch (error) {
        console.error('❌ CHAT API ERROR:', error);
        throw error;
    }
}

export async function generateContentFromForm(formData: FormState): Promise<string> {
    const CHAT_BASE_URL = import.meta.env.VITE_CHAT_BASE_URL;
    if (!CHAT_BASE_URL) {
        throw new Error("VITE_CHAT_BASE_URL is not defined in .env");
    }

    const payload = {
        type: "form",
        topic: formData.topicSubject,
        tone: formData.tones.join(', '),
        audience: formData.audience.join(', '),
        examples: formData.keyPoints,
        length: formData.length.toString(),
        seoKeywords: formData.seoKeywords
    };

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📤 FORM GENERATE API REQUEST (via Chat API)');
    console.log('URL:', CHAT_BASE_URL);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        const response = await fetch(CHAT_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(payload),
        });

        console.log('📥 FORM GENERATE API RESPONSE');
        console.log('Status:', response.status, response.statusText);

        const responseText = await response.text();
        console.log('Raw Response:', responseText);
        console.log('Response Length:', responseText.length, 'characters');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (!response.ok) {
            throw new Error(`Form Generate API failed: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
        }

        if (!responseText || responseText.trim() === '') {
            throw new Error('Form Generate API returned empty response');
        }

        try {
            const data = JSON.parse(responseText);
            console.log('✅ Parsed Response:', data);

            // Handle array response: [{"output": "..."}]
            if (Array.isArray(data) && data.length > 0 && data[0].output) {
                const outputText = typeof data[0].output === 'string' ? data[0].output : JSON.stringify(data[0].output);
                console.log('✅ Extracted Output from array:', outputText.substring(0, 200) + '...');
                return outputText;
            } 
            // Handle direct object response: {"output": "..."}
            else if (data.output) {
                const outputText = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
                console.log('✅ Extracted Output:', outputText.substring(0, 200) + '...');
                return outputText;
            } else {
                console.error('❌ Response missing "output" field. Full response:', data);
                throw new Error("Form Generate API response missing 'output' field");
            }
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError);
            console.error('Failed to parse this text:', responseText);
            throw new Error(`Form Generate API returned invalid JSON: ${parseError.message}`);
        }

    } catch (error) {
        console.error('❌ FORM GENERATE API ERROR:', error);
        throw error;
    }
}
