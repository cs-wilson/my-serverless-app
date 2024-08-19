// const API_URL = 'https://your-api-gateway-url/items';  // 替换为实际API Gateway的URL

const API_URL = "https://ih1p3tv1e9.execute-api.ap-northeast-2.amazonaws.com/prod/items";

export async function uploadData(userId, textData, imageFile) {
  const reader = new FileReader();
  reader.readAsDataURL(imageFile);

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const imageBase64 = reader.result.split(',')[1];
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, textData, imageBase64 }),
        });
        const data = await response.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
  });
}