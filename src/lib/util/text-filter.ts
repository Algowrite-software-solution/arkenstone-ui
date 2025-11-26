/**
 * generate a fallback letter for avatar using the first 2 letters of each word. if only a single word exisits the first 2 letters or single letter
 * @param name 
 * @returns 
 */
export function AvatarFallbackLetter(name: string) {
    const words = name.split(" ");
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase() + words[0].charAt(1).toUpperCase();
    }
    return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();    
}
