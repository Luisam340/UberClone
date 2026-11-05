import { File } from 'expo-file-system';
import { fetch } from 'expo/fetch';

const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
const uploadImageUrl = process.env.EXPO_PUBLIC_UPLOAD_IMAGE;

export const uploadImage = async (imageUri) => {
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing.');
  }

  if (!imageUri) {
    throw new Error('Image URI is required.');
  }

  const file = new File(imageUri);

  if (!file.exists) {
    throw new Error('Selected image file does not exist.');
  }

  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `${baseUrl}/${cloudName}/${uploadImageUrl}`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok || !result.secure_url || !result.public_id) {
    throw new Error(result.error?.message || 'Image upload failed.');
  }
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};
