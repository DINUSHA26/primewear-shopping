
export const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';

    // Check if it's already a full URL or data URI
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
        return imagePath;
    }

    // Get the base API URL from environment variable
    // Default to localhost for development
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    // Remove '/api' suffix if present because images are usually served from root or /uploads
    baseUrl = baseUrl.replace(/\/api\/?$/, '');

    // Ensure we don't end up with double slashes
    const cleanBase = baseUrl.replace(/\/$/, '');
    const cleanPath = imagePath.replace(/^\//, '');

    return `${cleanBase}/${cleanPath}`;
};
