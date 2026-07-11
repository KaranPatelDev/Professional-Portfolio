"use client";

import { useEffect, useState } from "react";
import { adminListAllBuildLogPosts } from "@/lib/api";
import type { BuildLogPost } from "@/lib/types";
import BuildLogForm from "./BuildLogForm";

export default function AdminBuildLogPage() {
  const [posts, setPosts] = useState<BuildLogPost[]>([]);
  const [showNew, setShowNew] = useState(false);

  function reload() {
    adminListAllBuildLogPosts().then(setPosts).catch(() => setPosts([]));
    setShowNew(false);
  }

  useEffect(reload, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl">Build Log</h1>
        <button onClick={() => setShowNew(true)} className="text-accent text-sm">
          + New post
        </button>
      </div>
      {showNew && <BuildLogForm onSaved={reload} />}
      {posts.map((post) => (
        <BuildLogForm key={post.id} post={post} onSaved={reload} />
      ))}
    </div>
  );
}
