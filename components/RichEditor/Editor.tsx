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
} from "lucide-react";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichEditor({ content, onChange }: EditorProps) {
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

  // Colors dropdowns
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive("bold")
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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive("italic")
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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive("underline")
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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive("strike")
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
            className={`p-1.5 rounded-md transition-colors font-medium text-xs flex items-center gap-0.5 ${
              editor.isActive("heading", { level: 1 })
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
            className={`p-1.5 rounded-md transition-colors font-medium text-xs flex items-center gap-0.5 ${
              editor.isActive("heading", { level: 2 })
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
            className={`p-1.5 rounded-md transition-colors font-medium text-xs flex items-center gap-0.5 ${
              editor.isActive("heading", { level: 3 })
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
            className={`px-2 py-1.5 rounded-md transition-colors text-xs font-semibold ${
              editor.isActive("paragraph") && !editor.isActive("heading")
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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive({ textAlign: "left" })
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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive({ textAlign: "center" })
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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive({ textAlign: "right" })
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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive({ textAlign: "justify" })
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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive("bulletList")
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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive("orderedList")
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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive("blockquote")
                ? "bg-blue-500 text-white"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"
            }`}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Code Blocks Group */}
        <div className="flex items-center bg-zinc-150/50 dark:bg-zinc-800/40 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
          <button
            type="button"
            onClick={toggleCode}
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive("code")
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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive("codeBlock")
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
            className={`p-1.5 rounded-md transition-colors ${
              editor.isActive("link")
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
          className={`p-1 rounded-full transition-colors ${
            editor.isActive("bold")
              ? "text-blue-500 bg-blue-50 dark:bg-blue-950/40"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={`p-1 rounded-full transition-colors ${
            editor.isActive("italic")
              ? "text-blue-500 bg-blue-50 dark:bg-blue-950/40"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={toggleUnderline}
          className={`p-1 rounded-full transition-colors ${
            editor.isActive("underline")
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
          className={`p-1 rounded-full transition-colors ${
            editor.isActive("link")
              ? "text-blue-500 bg-blue-50 dark:bg-blue-950/40"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </BubbleMenu>

      {/* EDITOR CONTENT AREA */}
      <div className="flex-1 p-6 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="h-full min-h-[500px] outline-none max-w-none
            [&_.ProseMirror]:min-h-[500px] 
            [&_.ProseMirror]:outline-none 
            [&_.ProseMirror_p]:leading-relaxed 
            [&_.ProseMirror_p]:mb-4
            [&_.ProseMirror_p]:text-zinc-700
            [&_.ProseMirror_p]:dark:text-zinc-300
            
            [&_.ProseMirror_h1]:text-3xl 
            [&_.ProseMirror_h1]:font-serif 
            [&_.ProseMirror_h1]:font-bold 
            [&_.ProseMirror_h1]:mt-6 
            [&_.ProseMirror_h1]:mb-3
            [&_.ProseMirror_h1]:text-zinc-900
            [&_.ProseMirror_h1]:dark:text-white
            
            [&_.ProseMirror_h2]:text-2xl 
            [&_.ProseMirror_h2]:font-serif 
            [&_.ProseMirror_h2]:font-bold 
            [&_.ProseMirror_h2]:mt-5 
            [&_.ProseMirror_h2]:mb-2.5
            [&_.ProseMirror_h2]:text-zinc-900
            [&_.ProseMirror_h2]:dark:text-zinc-100
            
            [&_.ProseMirror_h3]:text-xl 
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
            [&_.ProseMirror_ul]:dark:text-zinc-300
            
            [&_.ProseMirror_ol]:list-decimal 
            [&_.ProseMirror_ol]:pl-5 
            [&_.ProseMirror_ol]:mb-4
            [&_.ProseMirror_ol]:text-zinc-700
            [&_.ProseMirror_ol]:dark:text-zinc-300
            
            [&_.ProseMirror_li]:mb-1
            
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
                    className={`py-2 px-3 text-xs font-semibold border rounded-lg transition-all ${
                      videoType === "long"
                        ? "border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-950/45"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    }`}
                  >
                    Landscape (16:9 Video)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoType("shorts")}
                    className={`py-2 px-3 text-xs font-semibold border rounded-lg transition-all ${
                      videoType === "shorts"
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
    </div>
  );
}
