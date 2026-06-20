"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { CustomImage } from "./CustomImage";
import { CustomVideo } from "./CustomVideo";
import { Node, mergeAttributes } from "@tiptap/core";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  FileCode,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Undo,
  Redo,
  Sparkles,
  Film,
  Baseline,
  Highlighter,
  ChevronDown,
  Palette,
  Table as TableIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";


const CustomTiptapTable = Table.configure({
  resizable: true,
}).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) {
            return {};
          }
          return { style: attributes.style };
        },
      },
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) {
            return {};
          }
          return { class: attributes.class };
        },
      },
    };
  },
});

const CustomTiptapTableRow = TableRow.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) {
            return {};
          }
          return { style: attributes.style };
        },
      },
    };
  },
});

const CustomTiptapTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) {
            return {};
          }
          return { style: attributes.style };
        },
      },
    };
  },
});

const CustomTiptapTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) {
            return {};
          }
          return { style: attributes.style };
        },
      },
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      toggleCallout: (attributes?: { color?: string }) => ReturnType;
    };
  }
}

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      color: {
        default: "green",
        parseHTML: (element) => element.getAttribute("data-color") || "green",
        renderHTML: (attributes) => ({
          "data-color": attributes.color,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.callout-box",
      },
      {
        tag: 'div[data-type="callout"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "callout",
        class: "callout-box",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      toggleCallout:
        (attributes) =>
          ({ commands }) => {
            return commands.toggleWrap(this.name, attributes);
          },
    };
  },
});

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
  fontSize?: number;
  lineHeight?: number;
}

export default function RichEditor({ content, onChange, fontSize = 16, lineHeight = 1.6 }: EditorProps) {
  // Modal states for premium URL insertion
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [videoType, setVideoType] = useState<"long" | "shorts">("long");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  // Table Builder states
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableLayout, setTableLayout] = useState<"bordered" | "striped" | "minimal">("bordered");
  const [tableTheme, setTableTheme] = useState<"blue" | "green" | "red" | "purple" | "charcoal">("blue");
  const [tableWidth, setTableWidth] = useState(100);
  const [tableAlign, setTableAlign] = useState<"left" | "center" | "right">("center");
  const [tableGridData, setTableGridData] = useState<string[][]>([
    ["Header 1", "Header 2", "Header 3"],
    ["Cell A1", "Cell A2", "Cell A3"],
    ["Cell B1", "Cell B2", "Cell B3"],
  ]);

  // Adjust table grid data dimensions dynamically
  const updateGridDimensions = (rows: number, cols: number) => {
    const newRows = Math.max(1, Math.min(20, rows));
    const newCols = Math.max(1, Math.min(10, cols));

    setTableRows(newRows);
    setTableCols(newCols);

    setTableGridData((prev) => {
      const nextGrid: string[][] = [];
      for (let r = 0; r < newRows; r++) {
        const rowData: string[] = [];
        for (let c = 0; c < newCols; c++) {
          rowData.push(prev[r]?.[c] || (r === 0 ? `Header ${c + 1}` : ""));
        }
        nextGrid.push(rowData);
      }
      return nextGrid;
    });
  };

  const openTableModal = () => {
    setTableRows(3);
    setTableCols(3);
    setTableLayout("bordered");
    setTableTheme("blue");
    setTableWidth(100);
    setTableAlign("center");
    setTableGridData([
      ["Header 1", "Header 2", "Header 3"],
      ["Cell A1", "Cell A2", "Cell A3"],
      ["Cell B1", "Cell B2", "Cell B3"],
    ]);
    setIsTableModalOpen(true);
  };

  const compileTableToHtml = (): string => {
    let headerBg = "#3b82f6";
    let headerText = "#ffffff";

    switch (tableTheme) {
      case "green":
        headerBg = "#10b981";
        break;
      case "red":
        headerBg = "#ef4444";
        break;
      case "purple":
        headerBg = "#8b5cf6";
        break;
      case "charcoal":
        headerBg = "#3f3f46";
        break;
    }

    const alignmentStyle = tableAlign === "center"
      ? "margin-left: auto; margin-right: auto;"
      : tableAlign === "right"
        ? "margin-left: auto; margin-right: 0;"
        : "margin-left: 0; margin-right: auto;";

    const borderStyle = tableLayout === "minimal"
      ? "border-bottom: 2px solid #e4e4e7;"
      : "border: 1px solid #e4e4e7;";

    let html = `<table class="w-full text-sm border-collapse my-6" style="width: ${tableWidth}%; ${alignmentStyle} background-color: transparent; border-spacing: 0; border-collapse: collapse; min-width: 400px; ${tableLayout !== 'minimal' ? 'border: 1px solid #e4e4e7;' : ''}">`;

    // Build Header Row
    html += `<thead>`;
    html += `<tr style="background-color: ${headerBg}; color: ${headerText};">`;
    for (let c = 0; c < tableCols; c++) {
      const val = tableGridData[0]?.[c] || "";
      html += `<th style="padding: 12px 16px; font-weight: bold; text-align: left; ${borderStyle}">${val}</th>`;
    }
    html += `</tr>`;
    html += `</thead>`;

    // Build Body Rows
    html += `<tbody>`;
    for (let r = 1; r < tableRows; r++) {
      let bg = "#ffffff";
      if (tableLayout === "striped" && r % 2 === 0) {
        bg = "#f8fafc";
      }
      html += `<tr style="background-color: ${bg}; transition: background-color 0.15s;">`;
      for (let c = 0; c < tableCols; c++) {
        const val = tableGridData[r]?.[c] || "";
        const cellBorder = tableLayout === "minimal"
          ? "border-bottom: 1px solid #f4f4f5;"
          : "border: 1px solid #e4e4e7;";
        html += `<td style="padding: 12px 16px; text-align: left; color: #374151; ${cellBorder}">${val}</td>`;
      }
      html += `</tr>`;
    }
    html += `</tbody>`;
    html += `</table>`;

    return html;
  };

  // Colors dropdowns
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showColorBoxPicker, setShowColorBoxPicker] = useState(false);

  const TEXT_COLORS = [
    { name: "Default", value: "" },
    { name: "Charcoal", value: "#27272a" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Yellow", value: "#eab308" },
    { name: "Green", value: "#22c55e" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
  ];

  const HIGHLIGHT_COLORS = [
    { name: "Clear", value: "" },
    { name: "Yellow", value: "#fef08a" },
    { name: "Red", value: "#fecaca" },
    { name: "Green", value: "#bbf7d0" },
    { name: "Blue", value: "#bfdbfe" },
    { name: "Purple", value: "#e9d5ff" },
    { name: "Pink", value: "#fbcfe8" },
    { name: "Orange", value: "#ffedd5" },
  ];

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:text-blue-600 underline transition-colors cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Write a compelling story. Type text, add headings, and links...",
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      CustomImage,
      CustomVideo,
      Callout,
      CustomTiptapTable,
      CustomTiptapTableRow,
      CustomTiptapTableHeader,
      CustomTiptapTableCell,
    ],
    immediatelyRender: false,
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[300px] border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/30">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-zinc-500">Loading editor...</span>
        </div>
      </div>
    );
  }

  // Formatting operations
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();

  const setHeading = (level: 1 | 2 | 3) =>
    editor.chain().focus().toggleHeading({ level }).run();
  const setParagraph = () => editor.chain().focus().setParagraph().run();

  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();

  const handleAlign = (alignment: "left" | "center" | "right" | "justify") =>
    editor.chain().focus().setTextAlign(alignment).run();

  // Link dialog execution
  const openLinkModal = () => {
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setIsLinkModalOpen(true);
  };

  const saveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setIsLinkModalOpen(false);
    setLinkUrl("");
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  // Image dialog execution
  const openImageModal = () => {
    setImageUrl("");
    setImageAlt("");
    setIsImageModalOpen(true);
  };

  const saveImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl, alt: imageAlt })
        .run();
    }
    setIsImageModalOpen(false);
    setImageUrl("");
    setImageAlt("");
  };

  return (
    <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm relative min-h-[600px]">

      {/* TOOLBAR CONTROLS */}
      <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 backdrop-blur sticky top-0 z-20">

        {/* History Group */}
        <div className="flex items-center bg-zinc-150/50 dark:bg-zinc-800/40 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700/60 transition-colors disabled:opacity-40 disabled:hover:bg-transparent text-zinc-700 dark:text-zinc-300"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700/60 transition-colors disabled:opacity-40 disabled:hover:bg-transparent text-zinc-700 dark:text-zinc-300"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Text Formats Group */}
        <div className="flex items-center bg-zinc-150/50 dark:bg-zinc-800/40 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
          <button
            type="button"
            onClick={toggleBold}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive("bold")
                ? "bg-blue-500 text-white font-bold"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleItalic}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive("italic")
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleUnderline}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive("underline")
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleStrike}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive("strike")
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Colors Group */}
        <div className="flex items-center bg-zinc-150/50 dark:bg-zinc-800/40 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 relative gap-1">
          {/* Text Color Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowTextColorPicker(!showTextColorPicker);
                setShowBgColorPicker(false);
              }}
              className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700/60 transition-colors text-zinc-700 dark:text-zinc-300 flex items-center gap-0.5"
              title="Text Color"
            >
              <Baseline className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showTextColorPicker && (
              <div className="absolute top-9 left-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl shadow-2xl z-50 min-w-[150px] grid grid-cols-5 gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => {
                      if (color.value === "") {
                        editor.chain().focus().unsetColor().run();
                      } else {
                        editor.chain().focus().setColor(color.value).run();
                      }
                      setShowTextColorPicker(false);
                    }}
                    style={{ backgroundColor: color.value || "#d1d5db" }}
                    className="w-6 h-6 rounded-md border border-zinc-200 dark:border-zinc-700 hover:scale-110 active:scale-95 transition-transform"
                    title={color.name}
                  />
                ))}
                {/* Custom Color Picker input */}
                <label className="w-6 h-6 rounded-md border border-zinc-200 dark:border-zinc-700 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold">
                  CP
                  <input
                    type="color"
                    onChange={(e) => {
                      editor.chain().focus().setColor(e.target.value).run();
                      setShowTextColorPicker(false);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    title="Custom Color"
                  />
                </label>
                {/* Hex Color Input */}
                <div className="col-span-5 border-t border-zinc-100 dark:border-zinc-800/80 mt-1 pt-1.5">
                  <input
                    type="text"
                    placeholder="Hex code (e.g. #3b82f6)"
                    className="w-full text-[10px] font-mono px-1.5 py-1 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 rounded outline-none text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        let hex = e.currentTarget.value.trim();
                        if (hex) {
                          if (!hex.startsWith("#")) hex = "#" + hex;
                          if (/^#[0-9A-Fa-f]{3,8}$/.test(hex)) {
                            editor.chain().focus().setColor(hex).run();
                            setShowTextColorPicker(false);
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Text Background (Highlight) Color Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowBgColorPicker(!showBgColorPicker);
                setShowTextColorPicker(false);
              }}
              className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700/60 transition-colors text-zinc-700 dark:text-zinc-300 flex items-center gap-0.5"
              title="Text Highlight Color"
            >
              <Highlighter className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showBgColorPicker && (
              <div className="absolute top-9 left-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl shadow-2xl z-50 min-w-[150px] grid grid-cols-5 gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => {
                      if (color.value === "") {
                        editor.chain().focus().unsetHighlight().run();
                      } else {
                        editor.chain().focus().toggleHighlight({ color: color.value }).run();
                      }
                      setShowBgColorPicker(false);
                    }}
                    style={{ backgroundColor: color.value || "#d1d5db" }}
                    className="w-6 h-6 rounded-md border border-zinc-200 dark:border-zinc-700 hover:scale-110 active:scale-95 transition-transform"
                    title={color.name}
                  />
                ))}
                {/* Custom Color Picker input */}
                <label className="w-6 h-6 rounded-md border border-zinc-200 dark:border-zinc-700 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold">
                  CP
                  <input
                    type="color"
                    onChange={(e) => {
                      editor.chain().focus().setHighlight({ color: e.target.value }).run();
                      setShowBgColorPicker(false);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    title="Custom Highlight"
                  />
                </label>
                {/* Hex Highlight Input */}
                <div className="col-span-5 border-t border-zinc-100 dark:border-zinc-800/80 mt-1 pt-1.5">
                  <input
                    type="text"
                    placeholder="Hex code (e.g. #fecaca)"
                    className="w-full text-[10px] font-mono px-1.5 py-1 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 rounded outline-none text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        let hex = e.currentTarget.value.trim();
                        if (hex) {
                          if (!hex.startsWith("#")) hex = "#" + hex;
                          if (/^#[0-9A-Fa-f]{3,8}$/.test(hex)) {
                            editor.chain().focus().setHighlight({ color: hex }).run();
                            setShowBgColorPicker(false);
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Headings / Block types Group */}
        <div className="flex items-center bg-zinc-150/50 dark:bg-zinc-800/40 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
          <button
            type="button"
            onClick={() => setHeading(1)}
            className={`p-1.5 rounded-md transition-colors font-medium text-xs flex items-center gap-0.5 ${editor.isActive("heading", { level: 1 })
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setHeading(2)}
            className={`p-1.5 rounded-md transition-colors font-medium text-xs flex items-center gap-0.5 ${editor.isActive("heading", { level: 2 })
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setHeading(3)}
            className={`p-1.5 rounded-md transition-colors font-medium text-xs flex items-center gap-0.5 ${editor.isActive("heading", { level: 3 })
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={setParagraph}
            className={`px-2 py-1.5 rounded-md transition-colors text-xs font-semibold ${editor.isActive("paragraph") && !editor.isActive("heading")
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Paragraph Text"
          >
            P
          </button>
        </div>

        {/* Alignment Group */}
        <div className="flex items-center bg-zinc-150/50 dark:bg-zinc-800/40 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
          <button
            type="button"
            onClick={() => handleAlign("left")}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: "left" })
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleAlign("center")}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: "center" })
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleAlign("right")}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: "right" })
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleAlign("justify")}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: "justify" })
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Justify Text"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Quotes Group */}
        <div className="flex items-center bg-zinc-150/50 dark:bg-zinc-800/40 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
          <button
            type="button"
            onClick={toggleBulletList}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive("bulletList")
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleOrderedList}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive("orderedList")
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleBlockquote}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive("blockquote")
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Blockquote (Italic Quote Box)"
          >
            <Quote className="w-4 h-4" />
          </button>

          {/* Highlight Box / Color Box Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorBoxPicker(!showColorBoxPicker);
                setShowTextColorPicker(false);
                setShowBgColorPicker(false);
              }}
              className={`p-1.5 rounded-md transition-colors flex items-center gap-0.5 ${editor.isActive("callout")
                  ? "bg-blue-500 text-white"
                  : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
                }`}
              title="Insert Highlight Box (Color Box)"
            >
              <Palette className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showColorBoxPicker && (
              <div className="absolute top-9 left-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl shadow-2xl z-50 min-w-[150px] flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 px-1 font-sans">Choose Box Color</span>
                <div className="grid grid-cols-4 gap-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleCallout({ color: "green" }).run();
                      setShowColorBoxPicker(false);
                    }}
                    className="w-6 h-6 rounded-md border border-emerald-500 bg-[#f0fdf4] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    title="Green Box"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleCallout({ color: "blue" }).run();
                      setShowColorBoxPicker(false);
                    }}
                    className="w-6 h-6 rounded-md border border-sky-500 bg-[#f0f9ff] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    title="Blue Box"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleCallout({ color: "yellow" }).run();
                      setShowColorBoxPicker(false);
                    }}
                    className="w-6 h-6 rounded-md border border-amber-500 bg-[#fffbeb] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    title="Yellow Box"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleCallout({ color: "red" }).run();
                      setShowColorBoxPicker(false);
                    }}
                    className="w-6 h-6 rounded-md border border-red-500 bg-[#fef2f2] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    title="Red Box"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleCallout({ color: "purple" }).run();
                      setShowColorBoxPicker(false);
                    }}
                    className="w-6 h-6 rounded-md border border-purple-500 bg-[#faf5ff] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    title="Purple Box"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleCallout({ color: "pink" }).run();
                      setShowColorBoxPicker(false);
                    }}
                    className="w-6 h-6 rounded-md border border-pink-500 bg-[#fdf2f8] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    title="Pink Box"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleCallout({ color: "orange" }).run();
                      setShowColorBoxPicker(false);
                    }}
                    className="w-6 h-6 rounded-md border border-orange-500 bg-[#fff7ed] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    title="Orange Box"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleCallout({ color: "black" }).run();
                      setShowColorBoxPicker(false);
                    }}
                    className="w-6 h-6 rounded-md border border-zinc-800 dark:border-zinc-400 bg-[#f8fafc] dark:bg-zinc-800 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    title="Black/Grey Box"
                  />
                </div>
                {editor.isActive("callout") && (
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleCallout().run();
                      setShowColorBoxPicker(false);
                    }}
                    className="text-left text-[10px] font-bold uppercase tracking-wider px-1 py-1 hover:text-red-600 text-red-500 border-t border-zinc-150 dark:border-zinc-800/80 pt-1.5 transition-colors cursor-pointer"
                  >
                    Remove Box
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Code Blocks Group */}
        <div className="flex items-center bg-zinc-150/50 dark:bg-zinc-800/40 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
          <button
            type="button"
            onClick={toggleCode}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive("code")
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleCodeBlock}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive("codeBlock")
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Code Block"
          >
            <FileCode className="w-4 h-4" />
          </button>
        </div>

        {/* Media & Links Group */}
        <div className="flex items-center bg-zinc-150/50 dark:bg-zinc-800/40 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
          <button
            type="button"
            onClick={openLinkModal}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive("link")
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
              }`}
            title="Insert/Edit Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          {editor.isActive("link") && (
            <button
              type="button"
              onClick={removeLink}
              className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 transition-colors text-zinc-700 dark:text-zinc-300"
              title="Remove Link"
            >
              <Unlink className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={openImageModal}
            className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700/60 transition-colors text-zinc-700 dark:text-zinc-300"
            title="Insert Image Link"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setVideoUrl("");
              setVideoThumbnail("");
              setVideoType("long");
              setIsVideoModalOpen(true);
            }}
            className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700/60 transition-colors text-zinc-700 dark:text-zinc-300"
            title="Insert Video Link"
          >
            <Film className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={openTableModal}
            className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700/60 transition-colors text-zinc-700 dark:text-zinc-300"
            title="Insert Custom Table"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BUBBLE MENU FOR QUICK ACCESS ON TEXT SELECTION */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl px-1.5 py-1 rounded-full overflow-hidden"
      >
        <button
          type="button"
          onClick={toggleBold}
          className={`p-1 rounded-full transition-colors ${editor.isActive("bold")
              ? "text-blue-500 bg-blue-50 dark:bg-blue-950/40"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={`p-1 rounded-full transition-colors ${editor.isActive("italic")
              ? "text-blue-500 bg-blue-50 dark:bg-blue-950/40"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={toggleUnderline}
          className={`p-1 rounded-full transition-colors ${editor.isActive("underline")
              ? "text-blue-500 bg-blue-50 dark:bg-blue-950/40"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-3 bg-zinc-200 dark:bg-zinc-800" />
        <button
          type="button"
          onClick={openLinkModal}
          className={`p-1 rounded-full transition-colors ${editor.isActive("link")
              ? "text-blue-500 bg-blue-50 dark:bg-blue-950/40"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </BubbleMenu>

      {/* EDITOR CONTENT AREA */}
      <div
        className="flex-1 p-6 overflow-y-auto"
        style={{
          "--editor-line-height": lineHeight,
          "--editor-font-size": `${fontSize}px`,
        } as React.CSSProperties}
      >
        <EditorContent
          editor={editor}
          className="h-full min-h-[500px] outline-none max-w-none
            [&_.ProseMirror]:min-h-[500px] 
            [&_.ProseMirror]:outline-none 
            [&_.ProseMirror_p]:[line-height:var(--editor-line-height,1.6)]
            [&_.ProseMirror_p]:[font-size:var(--responsive-font-size,16px)]
            [&_.ProseMirror_p]:mb-4
            [&_.ProseMirror_p]:text-zinc-700
            [&_.ProseMirror_p]:dark:text-zinc-300
            
            [&_.ProseMirror_h1]:[font-size:calc(var(--responsive-font-size,16px)*1.875)]
            [&_.ProseMirror_h1]:font-serif 
            [&_.ProseMirror_h1]:font-bold 
            [&_.ProseMirror_h1]:mt-6 
            [&_.ProseMirror_h1]:mb-3
            [&_.ProseMirror_h1]:text-zinc-900
            [&_.ProseMirror_h1]:dark:text-white
            
            [&_.ProseMirror_h2]:[font-size:calc(var(--responsive-font-size,16px)*1.5)]
            [&_.ProseMirror_h2]:font-serif 
            [&_.ProseMirror_h2]:font-bold 
            [&_.ProseMirror_h2]:mt-5 
            [&_.ProseMirror_h2]:mb-2.5
            [&_.ProseMirror_h2]:text-zinc-900
            [&_.ProseMirror_h2]:dark:text-zinc-100
            
            [&_.ProseMirror_h3]:[font-size:calc(var(--responsive-font-size,16px)*1.25)]
            [&_.ProseMirror_h3]:font-serif 
            [&_.ProseMirror_h3]:font-semibold 
            [&_.ProseMirror_h3]:mt-4 
            [&_.ProseMirror_h3]:mb-2
            [&_.ProseMirror_h3]:text-zinc-800
            [&_.ProseMirror_h3]:dark:text-zinc-200
            
            [&_.ProseMirror_ul]:list-disc 
            [&_.ProseMirror_ul]:pl-5 
            [&_.ProseMirror_ul]:mb-4
            [&_.ProseMirror_ul]:text-zinc-700
            [&_.ProseMirror_ul]:dark:text-zinc-350
            
            [&_.ProseMirror_ol]:list-decimal 
            [&_.ProseMirror_ol]:pl-5 
            [&_.ProseMirror_ol]:mb-4
            [&_.ProseMirror_ol]:text-zinc-700
            [&_.ProseMirror_ol]:dark:text-zinc-300
            
            [&_.ProseMirror_li]:[line-height:var(--editor-line-height,1.6)]
            [&_.ProseMirror_li]:[font-size:var(--responsive-font-size,16px)]
            [&_.ProseMirror_li]:mb-1
            
            [&_.ProseMirror_blockquote]:[line-height:var(--editor-line-height,1.6)]
            [&_.ProseMirror_blockquote]:[font-size:calc(var(--responsive-font-size,16px)*1.125)]
            [&_.ProseMirror_blockquote]:border-l-4 
            [&_.ProseMirror_blockquote]:border-blue-500
            [&_.ProseMirror_blockquote]:py-3.5
            [&_.ProseMirror_blockquote]:px-5
            [&_.ProseMirror_blockquote]:rounded-r-xl
            [&_.ProseMirror_blockquote]:bg-blue-50/50
            [&_.ProseMirror_blockquote]:dark:bg-blue-950/20
            [&_.ProseMirror_blockquote]:italic 
            [&_.ProseMirror_blockquote]:my-5
            [&_.ProseMirror_blockquote]:text-zinc-650
            [&_.ProseMirror_blockquote]:dark:text-zinc-350
 
            [&_.ProseMirror_.callout-box]:[line-height:var(--editor-line-height,1.6)]
            [&_.ProseMirror_.callout-box]:[font-size:var(--responsive-font-size,16px)]
            
            [&_.ProseMirror_pre]:bg-zinc-950
            [&_.ProseMirror_pre]:text-zinc-100
            [&_.ProseMirror_pre]:p-5 
            [&_.ProseMirror_pre]:rounded-xl
            [&_.ProseMirror_pre]:font-mono 
            [&_.ProseMirror_pre]:text-sm 
            [&_.ProseMirror_pre]:overflow-x-auto 
            [&_.ProseMirror_pre]:my-4
            [&_.ProseMirror_pre]:border
            [&_.ProseMirror_pre]:border-zinc-800
            
            [&_.ProseMirror_code]:bg-zinc-100
            [&_.ProseMirror_code]:dark:bg-zinc-900
            [&_.ProseMirror_code]:text-red-500
            [&_.ProseMirror_code]:dark:text-red-400
            [&_.ProseMirror_code]:px-1.5
            [&_.ProseMirror_code]:py-0.5
            [&_.ProseMirror_code]:rounded
            [&_.ProseMirror_code]:font-mono
            [&_.ProseMirror_code]:text-sm
            
            [&_.ProseMirror_a]:text-blue-500
            [&_.ProseMirror_a]:underline
            
            [&_.ProseMirror_.is-editor-empty]:before:text-zinc-400
            [&_.ProseMirror_.is-editor-empty]:before:content-[attr(data-placeholder)]
            [&_.ProseMirror_.is-editor-empty]:before:float-left
            [&_.ProseMirror_.is-editor-empty]:before:height-0
            [&_.ProseMirror_.is-editor-empty]:before:pointer-events-none"
        />
      </div>

      {/* PREMIUM LINK DIALOG OVERLAY */}
      {isLinkModalOpen && (
        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <form
            onSubmit={saveLink}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-2 mb-4 text-blue-500">
              <LinkIcon className="w-5 h-5" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Add Hyperlink
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Enter the destination web URL to hyper-link the selected text.
            </p>
            <input
              type="url"
              required
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 mb-5 text-sm"
              autoFocus
            />
            <div className="flex justify-end gap-2 text-sm">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
              >
                Insert Link
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PREMIUM IMAGE DIALOG OVERLAY */}
      {isImageModalOpen && (
        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <form
            onSubmit={saveImage}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-2 mb-4 text-blue-500">
              <ImageIcon className="w-5 h-5" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Insert Image by Link
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              TipTap only loads remote image links for this editor. Paste your image source link below.
            </p>
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Image Source URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Alternative Text (Alt text)
                </label>
                <input
                  type="text"
                  placeholder="Describe the image..."
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 text-sm">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
              >
                Insert Image
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PREMIUM VIDEO DIALOG OVERLAY */}
      {isVideoModalOpen && (
        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (videoUrl) {
                editor.commands.setVideo({
                  src: videoUrl,
                  thumbnail: videoThumbnail || undefined,
                  videoType: videoType,
                });
              }
              setIsVideoModalOpen(false);
              setVideoUrl("");
              setVideoThumbnail("");
            }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-2 mb-4 text-blue-500">
              <Film className="w-5 h-5" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Insert Video Clip
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Embed video streams (MP4/WebM files) with customizable dimensions and custom cover thumbnails.
            </p>
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Video Stream URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/movie.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Cover Thumbnail URL (Poster)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/poster.jpg"
                  value={videoThumbnail}
                  onChange={(e) => setVideoThumbnail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Video Player Layout Ratio
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setVideoType("long")}
                    className={`py-2 px-3 text-xs font-semibold border rounded-lg transition-all ${videoType === "long"
                        ? "border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-950/45"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                  >
                    Landscape (16:9 Video)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoType("shorts")}
                    className={`py-2 px-3 text-xs font-semibold border rounded-lg transition-all ${videoType === "shorts"
                        ? "border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-950/45"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                  >
                    Portrait (9:16 Shorts)
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-sm">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
              >
                Insert Video
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PREMIUM TABLE DIALOG OVERLAY */}
      {isTableModalOpen && (
        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-2 mb-4 text-blue-500 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <TableIcon className="w-5 h-5" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Spreadsheet-Style Table Builder
              </h3>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto mb-5 min-h-0 pr-1">

              {/* LEFT CONFIGURATION PANEL */}
              <div className="md:col-span-1 space-y-4 pr-1">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 dark:text-zinc-500 block font-sans">Configure Layout</span>

                {/* Rows & Cols Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1 font-sans">
                      Rows (max 20)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={tableRows}
                      onChange={(e) => updateGridDimensions(Number(e.target.value), tableCols)}
                      className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1 font-sans">
                      Columns (max 10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={tableCols}
                      onChange={(e) => updateGridDimensions(tableRows, Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    />
                  </div>
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1 font-sans">
                    Theme Color
                  </label>
                  <select
                    value={tableTheme}
                    onChange={(e) => setTableTheme(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  >
                    <option value="blue">Primary Blue</option>
                    <option value="green">Emerald Green</option>
                    <option value="red">Crimson Red</option>
                    <option value="purple">Royal Purple</option>
                    <option value="charcoal">Charcoal Grey</option>
                  </select>
                </div>

                {/* Layout Selector */}
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1 font-sans">
                    Layout Style
                  </label>
                  <select
                    value={tableLayout}
                    onChange={(e) => setTableLayout(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 text-xs font-sans"
                  >
                    <option value="bordered">Grid Bordered</option>
                    <option value="striped">Zebra Striped</option>
                    <option value="minimal">Clean Editorial</option>
                  </select>
                </div>

                {/* Table Width Slider */}
                <div>
                  <div className="flex justify-between text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1 font-sans">
                    <span>Table Width</span>
                    <span>{tableWidth}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="5"
                    value={tableWidth}
                    onChange={(e) => setTableWidth(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-155 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Alignment */}
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1 font-sans">
                    Alignment
                  </label>
                  <div className="grid grid-cols-3 gap-1 mt-1 font-sans">
                    {["left", "center", "right"].map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => setTableAlign(align as any)}
                        className={cn(
                          "py-1.5 text-[9px] font-bold border rounded-lg uppercase tracking-wider transition-all cursor-pointer",
                          tableAlign === align
                            ? "border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-950/40"
                            : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                        )}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT DATA ENTRY PANEL */}
              <div className="md:col-span-2 flex flex-col min-h-0 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-900/40">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 dark:text-zinc-500 block mb-3 font-sans">Input Cell Data</span>
                <div className="flex-1 overflow-auto border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 bg-white dark:bg-zinc-950">
                  <div
                    className="grid gap-1.5 min-w-[500px] p-1.5"
                    style={{ gridTemplateColumns: `repeat(${tableCols}, minmax(120px, 1fr))` }}
                  >
                    {tableGridData.map((row, rIdx) => (
                      row.map((cell, cIdx) => (
                        <input
                          key={`${rIdx}-${cIdx}`}
                          type="text"
                          value={cell}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTableGridData(prev => {
                              const copy = prev.map(r => [...r]);
                              if (copy[rIdx]) {
                                copy[rIdx][cIdx] = val;
                              }
                              return copy;
                            });
                          }}
                          placeholder={rIdx === 0 ? `Header ${cIdx + 1}` : `Cell R${rIdx} C${cIdx + 1}`}
                          className={cn(
                            "px-2.5 py-1.5 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 transition-colors w-full font-sans",
                            rIdx === 0
                              ? "font-bold bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                              : "bg-white dark:bg-zinc-950 border-zinc-150 dark:border-zinc-850 text-zinc-700 dark:text-zinc-300"
                          )}
                        />
                      ))
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 text-sm border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors font-semibold font-sans"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const html = compileTableToHtml();
                  editor.chain().focus().insertContent(html).run();
                  setIsTableModalOpen(false);
                }}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-bold shadow-md shadow-blue-500/10 cursor-pointer font-sans"
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
