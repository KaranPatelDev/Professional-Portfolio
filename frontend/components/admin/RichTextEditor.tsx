"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { adminUploadMedia } from "@/lib/api";
import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Heading2, ImageIcon } from "lucide-react";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Image],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose-content min-h-[160px] px-3 py-2 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  async function handleImageUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      const { url } = await adminUploadMedia(file);
      editor.chain().focus().setImage({ src: url }).run();
    };
    input.click();
  }

  function toolbarBtn(active: boolean) {
    return `p-1.5 rounded ${active ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"}`;
  }

  return (
    <div className="border border-border rounded-[var(--radius-card)] bg-surface">
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
        <button type="button" className={toolbarBtn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </button>
        <button type="button" className={toolbarBtn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </button>
        <button type="button" className={toolbarBtn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading2 size={16} />
        </button>
        <button type="button" className={toolbarBtn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </button>
        <button type="button" className={toolbarBtn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          className={toolbarBtn(editor.isActive("link"))}
          onClick={() => {
            const url = window.prompt("URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <LinkIcon size={16} />
        </button>
        <button type="button" className={toolbarBtn(false)} onClick={handleImageUpload}>
          <ImageIcon size={16} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
