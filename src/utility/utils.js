import toast from "react-hot-toast";
import { DELETE_ITEM_URL } from "./delete_item";

// === delete one item
export const HANDLE_DELETE = async (id, token) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/delete/${id}`;
  const response = await DELETE_ITEM_URL(url, token);

  if (response.success) toast.success(response.message);
  return response;
};

// COPY TEXT
export const COPY_TEXT = async (serviceName, text) => {
  const license = `❇️ আপনার ${serviceName} এক্টিভেশন:
🔗 Login URL: https://elementsdownload.com/login
🔐 Licence Key: ${text}


━━━━  ✧  ━━━━
👉 লাইসেন্স একটিভ এবং ডাউনলোড প্রসেস জানতে ভিডিওটি দেখুন: https://www.youtube.com/watch?v=1XWKWy21ius&t=36s

`;

  try {
    await navigator.clipboard.writeText(license);
    toast.success("License is copied");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};
