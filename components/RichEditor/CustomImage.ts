import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageNodeView from "./ImageNodeView";

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: 100, // percentage (e.g. 50, 100)
        parseHTML: (element) => {
          const widthAttr = element.getAttribute("data-width");
          return widthAttr ? parseInt(widthAttr, 10) : 100;
        },
        renderHTML: (attributes) => ({
          "data-width": attributes.width,
          style: `width: ${attributes.width}%;`,
        }),
      },
      alignment: {
        default: "center", // 'left' | 'center' | 'right'
        parseHTML: (element) => element.getAttribute("data-alignment") || "center",
        renderHTML: (attributes) => ({
          "data-alignment": attributes.alignment,
        }),
      },
      loading: {
        default: "lazy",
        renderHTML: () => ({
          loading: "lazy",
          decoding: "async",
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
