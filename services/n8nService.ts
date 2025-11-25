import { FormState } from '../types';

// Generate UUID v4
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Store session ID for the current session
let sessionId: string | null = null;

function getSessionId(): string {
    if (!sessionId) {
        sessionId = generateUUID();
        console.log('🆔 Generated new session ID:', sessionId);
    }
    return sessionId;
}

// Reset session ID for new conversations
export function resetSessionId(): void {
    sessionId = null;
    console.log('🔄 Session ID reset');
}

// Get current session ID
export function getCurrentSessionId(): string {
    return getSessionId();
}

// Set session ID for existing conversation
export function setSessionId(newSessionId: string): void {
    sessionId = newSessionId;
    console.log('🆔 Session ID set to:', sessionId);
}

// Fetch conversation history from API
export async function fetchConversationHistory(agentType: 'copywriting' | 'social-media' | 'email'): Promise<any[]> {
    const HISTORY_BASE_URL = import.meta.env.VITE_HISTORY_BASE_URL;
    if (!HISTORY_BASE_URL) {
        throw new Error("VITE_HISTORY_BASE_URL is not defined in .env");
    }

    // Map agent types to table names
    const tableNameMap = {
        'copywriting': 'copyWriter',
        'social-media': 'socialMediaWriter',
        'email': 'emailWriter'
    };

    const tableName = tableNameMap[agentType];

    const payload = {
        tableName: tableName
    };

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📤 FETCH HISTORY API REQUEST');
    console.log('URL:', HISTORY_BASE_URL);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        const response = await fetch(HISTORY_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(payload),
        });

        console.log('📥 FETCH HISTORY API RESPONSE');
        console.log('Status:', response.status, response.statusText);

        const responseText = await response.text();
        console.log('Raw Response:', responseText);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (!response.ok) {
            throw new Error(`Fetch History API failed: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
        }

        try {
            const data = JSON.parse(responseText);
            console.log('✅ Parsed History Response:', data);
            return Array.isArray(data) ? data : [];
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError);
            return [];
        }
    } catch (error) {
        console.error('❌ FETCH HISTORY API ERROR:', error);
        return [];
    }
}

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

export async function sendChatMessage(text: string, tableName?: string, previousMessages?: Array<{user?: string, agent?: string}>): Promise<string> {
    const CHAT_BASE_URL = import.meta.env.VITE_CHAT_BASE_URL;
    if (!CHAT_BASE_URL) {
        throw new Error("VITE_CHAT_BASE_URL is not defined in .env");
    }

    try {
        console.log('🔍 sendChatMessage called with:', { text, tableName, previousMessages });
        
        // Ensure text is a string to avoid object injection
        const safeText = typeof text === 'string' ? text : JSON.stringify(text);

        const payload: any = {
            type: 'chat',
            text: safeText,
            sessionId: getSessionId()
        };

        // Add tableName if provided
        if (tableName) {
            payload.tableName = tableName;
        }

        // Add last 5 messages (always include, even if empty array)
        if (previousMessages) {
            const lastMessages = previousMessages.slice(-5);
            payload.lastMessages = lastMessages;
            console.log('✅ Added lastMessages to payload:', lastMessages);
        } else {
            console.log('⚠️ previousMessages is undefined or null');
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📤 CHAT API REQUEST');
        console.log('URL:', CHAT_BASE_URL);
        console.log('Table Name:', tableName);
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
            
            // Extract chat field from response (new API format)
            let chatContent = data.chat || data.text || data.output || data.message || data.response;
            
            // If chat is an array of objects like [{"user": "hi", "agent": "hello"}]
            if (Array.isArray(chatContent)) {
                // Get the last agent message from the array
                const lastMessage = chatContent[chatContent.length - 1];
                if (lastMessage && lastMessage.agent && lastMessage.agent.trim() !== '') {
                    return lastMessage.agent;
                }
            }
            
            // If it's already a string, return it
            if (typeof chatContent === 'string' && chatContent.trim() !== '') {
                return chatContent;
            }
            
            // Try to extract from top-level data fields
            if (data.agent) return data.agent;
            if (data.output) return data.output;
            if (data.message) return data.message;
            
            // Fallback
            return typeof data === 'string' ? data : JSON.stringify(data);
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
    const GENERATE_BASE_URL = import.meta.env.VITE_GENERATE_BASE_URL;
    if (!GENERATE_BASE_URL) {
        throw new Error("VITE_GENERATE_BASE_URL is not defined in .env");
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
    console.log('📤 GENERATE API REQUEST (Form to Prompt)');
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

        console.log('📥 GENERATE API RESPONSE');
        console.log('Status:', response.status, response.statusText);

        const responseText = await response.text();
        console.log('Raw Response:', responseText);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (!response.ok) {
            throw new Error(`Generate API failed: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
        }

        if (!responseText || responseText.trim() === '') {
            throw new Error('Generate API returned empty response');
        }

        try {
            const data = JSON.parse(responseText);
            console.log('✅ Parsed Response:', data);

            if (data.output) {
                const outputText = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
                console.log('✅ Extracted Output (Prompt):', outputText.substring(0, 200) + '...');
                return outputText;
            } else {
                console.error('❌ Response missing "output" field. Full response:', data);
                throw new Error("Generate API response missing 'output' field");
            }
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError);
            throw new Error(`Generate API returned invalid JSON: ${parseError.message}`);
        }

    } catch (error) {
        console.error('❌ GENERATE API ERROR:', error);
        throw error;
    }
}
