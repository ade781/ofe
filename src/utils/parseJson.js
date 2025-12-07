export const parseJsonSafe = async (res) => {
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        return { raw: text };
    }
};
