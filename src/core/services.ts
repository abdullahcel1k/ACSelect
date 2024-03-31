import { Character } from "./models";

const getCharecters = async (name: string): Promise<Character[] | null> => {
  try {
    const response = await fetch(
      "https://rickandmortyapi.com/api/character/" +
        (name ? "?name=" + name : "")
    );
    if (!response.ok) {
      throw new Error("API'den veri alınamadı.");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Hata:", error);
    return null;
  }
};
export { getCharecters };
