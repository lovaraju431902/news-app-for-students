import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import VideoNodeView from "./VideoNodeView";

export interface VideoOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customVideo: {
      setVideo: (options: {
        src: string;
        thumbnail?: string;
        videoType?: "long" | "shorts";
        width?: number;
        alignment?: "left" | "center" | "right";
      }) => ReturnType;
    };
  }
}

export function getEmbedUrl(url: string): { type: "embed" | "direct"; url: string } {
  if (!url) return { type: "direct", url: "" };

  // YouTube (standard, shorts, shared, embedded)
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/ ]{11})/i);
  if (ytMatch) {
    return { type: "embed", url: `https://www.youtube.com/embed/${ytMatch[1]}` };
  }

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch) {
    return { type: "embed", url: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  return { type: "direct", url: url };
}

export const CustomVideo = Node.create({
  name: "customVideo",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      thumbnail: {
        default: null,
      },
      videoType: {
        default: "long", // 'long' (16:9) | 'shorts' (9:16)
        parseHTML: (element) => element.getAttribute("data-video-type") || "long",
        renderHTML: (attributes) => ({
          "data-video-type": attributes.videoType,
        }),
      },
      width: {
        default: 80, // percentage width (30-100)
        parseHTML: (element) => {
          const w = element.getAttribute("data-width");
          return w ? parseInt(w, 10) : 80;
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
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-custom-video]",
        getAttrs: (element) => {
          if (typeof element === "string") return {};
          return {
            src: element.getAttribute("data-src"),
            thumbnail: element.getAttribute("data-thumbnail"),
            videoType: element.getAttribute("data-video-type") || "long",
            width: parseInt(element.getAttribute("data-width") || "80", 10),
            alignment: element.getAttribute("data-alignment") || "center",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const videoType = HTMLAttributes.videoType || "long";
    const alignment = HTMLAttributes.alignment || "center";
    const width = HTMLAttributes.width || 80;
    const src = HTMLAttributes.src || "";
    
    let containerClass = "my-6 overflow-hidden rounded-lg mx-auto";
    if (alignment === "left") {
      containerClass = "my-6 overflow-hidden rounded-lg float-left mr-6 mb-4";
    } else if (alignment === "right") {
      containerClass = "my-6 overflow-hidden rounded-lg float-right ml-6 mb-4";
    }

    const aspectClass = videoType === "shorts" 
      ? "w-full aspect-[9/16] max-w-[320px] mx-auto block object-cover bg-black" 
      : "w-full aspect-video block object-cover bg-black";

    const { type, url } = getEmbedUrl(src);

    if (type === "embed") {
      return [
        "div",
        mergeAttributes(HTMLAttributes, {
          "data-custom-video": "",
          "data-src": src,
          "data-thumbnail": HTMLAttributes.thumbnail || "",
          "data-video-type": videoType,
          "data-width": width,
          "data-alignment": alignment,
          class: containerClass,
          style: `width: ${width}%;`,
        }),
        [
          "iframe",
          {
            src: url,
            frameborder: "0",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowfullscreen: "",
            class: `${aspectClass} border-0 rounded-lg`,
          },
        ],
      ];
    }

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-custom-video": "",
        "data-src": src,
        "data-thumbnail": HTMLAttributes.thumbnail || "",
        "data-video-type": videoType,
        "data-width": width,
        "data-alignment": alignment,
        class: containerClass,
        style: `width: ${width}%;`,
      }),
      [
        "video",
        {
          src: src,
          poster: HTMLAttributes.thumbnail || "",
          controls: "",
          class: `${aspectClass} rounded-lg`,
        },
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView);
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
