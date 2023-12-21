export const removeHTMLTags = (textWithHTML :any) => {
    return textWithHTML.replace(/<[^>]*>/g, '');
  };
  