export async function sendToN8nWebhook(text: string): Promise<string> {
    try {
        const response = await fetch('https://n8n.sitepreviews.dev/webhook/97bdbcc2-2ed0-41f0-8a77-74c9efdf4358', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error(`Webhook call failed: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            // Handle common response fields or return stringified JSON
            return data.text || data.output || data.message || data.response || (typeof data === 'string' ? data : JSON.stringify(data));
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('Error sending to n8n webhook:', error);
        throw error;
    }
}
