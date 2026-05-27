"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Project } from "@/db/schema";

const SPACE_TYPES = ["상업공간", "주거공간", "오피스", "숙박공간", "전시/팝업스토어", "기타"];

type EditingProject = Omit<Project, "id" | "createdAt" | "updatedAt"> & { id?: number };

const emptyProject = (): EditingProject => ({
  title: "",
  year: new Date().getFullYear().toString(),
  spaceType: "상업공간",
  location: "",
  description: "",
  coverImage: "",
  images: [],
  featured: false,
  displayOrder: 0,
  published: true,
});

export default function AdminClient() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/admin/login");
  };

  const handleAuthError = (status: number) => {
    if (status === 401) {
      showToast("로그인이 만료되었습니다. 다시 로그인해주세요.", "error");
      setTimeout(() => window.location.assign("/admin/login"), 1500);
      return true;
    }
    return false;
  };
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingProject | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragItem, setDragItem] = useState<number | null>(null);
  const [dragTarget, setDragTarget] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data: Project[] = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch {
      showToast("프로젝트를 불러오지 못했습니다", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { showToast("프로젝트 제목을 입력해주세요", "error"); return; }
    if (!editing.year.trim()) { showToast("연도를 입력해주세요", "error"); return; }
    setSaving(true);
    try {
      const method = editing.id ? "PUT" : "POST";
      const url = editing.id ? `/api/projects/${editing.id}` : "/api/projects";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) {
        if (handleAuthError(res.status)) return;
        throw new Error();
      }
      showToast(editing.id ? "프로젝트가 수정되었습니다" : "프로젝트가 생성되었습니다");
      setEditing(null);
      fetchProjects();
    } catch {
      showToast("저장에 실패했습니다", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("이 프로젝트를 삭제하시겠습니까?")) return;
    setDeleting(id);
    try {
      const delRes = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!delRes.ok) { handleAuthError(delRes.status); throw new Error(); }
      showToast("프로젝트가 삭제되었습니다");
      fetchProjects();
    } catch {
      showToast("삭제에 실패했습니다", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (p: Project) => {
    const res = await fetch(`/api/projects/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
    if (!res.ok) { handleAuthError(res.status); return; }
    fetchProjects();
  };

  const handleToggleFeatured = async (p: Project) => {
    const res = await fetch(`/api/projects/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !p.featured }),
    });
    if (!res.ok) { handleAuthError(res.status); return; }
    fetchProjects();
  };

  const uploadFile = async (file: File, onSuccess: (url: string) => void) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) onSuccess(data.url);
      else showToast(data.error || "업로드에 실패했습니다", "error");
    } catch {
      showToast("업로드에 실패했습니다", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file, (url) => setEditing((prev) => prev ? { ...prev, coverImage: url } : prev));
    }
  };

  const handleImagesUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      uploadFile(file, (url) => {
        setEditing((prev) =>
          prev ? { ...prev, images: [...(prev.images ?? []), url] } : prev
        );
      });
    });
  };

  // Drag-to-reorder
  const handleDragStart = (id: number) => setDragItem(id);
  const handleDragEnter = (id: number) => setDragTarget(id);
  const handleDragEnd = async () => {
    if (dragItem === null || dragTarget === null || dragItem === dragTarget) {
      setDragItem(null); setDragTarget(null); return;
    }
    const sorted = [...projects];
    const fromIndex = sorted.findIndex((p) => p.id === dragItem);
    const toIndex = sorted.findIndex((p) => p.id === dragTarget);
    const [item] = sorted.splice(fromIndex, 1);
    sorted.splice(toIndex, 0, item);
    setProjects(sorted);
    setDragItem(null);
    setDragTarget(null);
    await fetch("/api/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: sorted.map((p) => p.id) }),
    });
    showToast("순서가 저장되었습니다");
  };

  const inputClass = "w-full bg-transparent border-b border-[#E5DDD4] py-2.5 px-0 text-sm text-[#1A1814] placeholder-[#C8C0B0] outline-none focus:border-[#C8A96E] transition-colors duration-300";
  const labelClass = "text-[10px] tracking-[0.3em] uppercase text-[#6B6560] mb-1 block";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2EDE6", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b" style={{ backgroundColor: "#F8F5F0", borderColor: "#E5DDD4" }}>
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="flex flex-col leading-none">
              <span className="text-[9px] tracking-[0.4em] uppercase text-[#6B6560]">Design</span>
              <span className="text-base tracking-[0.2em] uppercase text-[#1A1814]" style={{ fontFamily: "'DM Sans', sans-serif" }}>NADEUL</span>
            </a>
            <div className="w-px h-6 bg-[#E5DDD4]" />
            <span className="text-xs tracking-[0.25em] uppercase text-[#6B6560]">관리자</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 bg-[#F2EDE6] rounded-full p-1">
              <button
                onClick={() => setTab("projects")}
                className="px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase rounded-full transition-all duration-300"
                style={{
                  backgroundColor: tab === "projects" ? "#F8F5F0" : "transparent",
                  color: tab === "projects" ? "#1A1814" : "#6B6560",
                  boxShadow: tab === "projects" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                프로젝트
              </button>

            </div>
            <a
              href="/"
              className="text-xs tracking-[0.2em] uppercase text-[#6B6560] hover:text-[#1A1814] transition-colors duration-300"
            >
              ← 사이트 보기
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase text-[#6B6560] border border-[#E5DDD4] hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M3.5 1.5h-2v7h2M6.5 3l2 2-2 2M3.5 5h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              로그아웃
            </button>
            {tab === "projects" && (
              <button
                onClick={() => setEditing(emptyProject())}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-[0.2em] uppercase text-white transition-all duration-300 hover:opacity-80"
                style={{ backgroundColor: "#1A1814" }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M1 5h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                새 프로젝트
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-20 right-6 z-50 px-5 py-3 rounded-lg text-sm text-white shadow-lg transition-all duration-300"
          style={{ backgroundColor: toast.type === "success" ? "#1A1814" : "#C0392B" }}
        >
          {toast.msg}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-light text-[#1A1814]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              프로젝트 관리
            </h1>
            <p className="text-xs text-[#6B6560] mt-0.5">행을 드래그하여 순서 변경 · 클릭하여 수정</p>
          </div>
          <span className="text-xs text-[#6B6560]">총 {projects.length}개 프로젝트</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: "#E5DDD4" }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[#6B6560] text-sm mb-4">아직 프로젝트가 없습니다.</p>
            <button
              onClick={() => setEditing(emptyProject())}
              className="text-xs tracking-widest uppercase text-[#C8A96E] border border-[#C8A96E] px-6 py-3 rounded-full hover:bg-[#C8A96E] hover:text-white transition-all duration-300"
            >
              첫 프로젝트 추가하기
            </button>
          </div>
        ) : (
          <>
            {/* Column Headers */}
            <div className="hidden md:grid grid-cols-[32px_1fr_80px_120px_90px_80px_80px_100px] gap-4 px-4 pb-2 mb-1">
              {["#", "프로젝트", "연도", "유형", "순서", "추천", "공개", "관리"].map((h) => (
                <span key={h} className="text-[10px] tracking-[0.25em] uppercase text-[#6B6560]">{h}</span>
              ))}
            </div>

            <div className="space-y-2">
              {projects.map((p, idx) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => handleDragStart(p.id)}
                  onDragEnter={() => handleDragEnter(p.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className="grid grid-cols-1 md:grid-cols-[32px_1fr_80px_120px_90px_80px_80px_100px] gap-4 items-center px-4 py-4 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200"
                  style={{
                    backgroundColor: dragTarget === p.id ? "#E5DDD4" : "#F8F5F0",
                    border: dragItem === p.id ? "1px dashed #C8A96E" : "1px solid transparent",
                    opacity: dragItem === p.id ? 0.5 : 1,
                  }}
                >
                  {/* Drag handle */}
                  <div className="hidden md:flex items-center text-[#C8C0B0]">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="4" cy="3" r="1" fill="currentColor" />
                      <circle cx="8" cy="3" r="1" fill="currentColor" />
                      <circle cx="4" cy="6" r="1" fill="currentColor" />
                      <circle cx="8" cy="6" r="1" fill="currentColor" />
                      <circle cx="4" cy="9" r="1" fill="currentColor" />
                      <circle cx="8" cy="9" r="1" fill="currentColor" />
                    </svg>
                  </div>

                  {/* Title + image */}
                  <div className="flex items-center gap-3">
                    <div
                      className="hidden md:block w-10 h-10 rounded flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: "#DDD5C8" }}
                    >
                      {p.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-[#1A1814] font-medium truncate max-w-[200px]">{p.title}</p>
                      {p.location && <p className="text-[10px] text-[#6B6560] truncate">{p.location}</p>}
                    </div>
                  </div>

                  {/* Year */}
                  <span className="text-xs text-[#6B6560]">{p.year}</span>

                  {/* Type */}
                  <span className="text-xs text-[#6B6560]">{p.spaceType}</span>

                  {/* Order */}
                  <span className="text-xs text-[#C8A96E]">#{idx + 1}</span>

                  {/* Featured */}
                  <button
                    onClick={() => handleToggleFeatured(p)}
                    className="flex items-center gap-1 text-xs transition-colors duration-200"
                    style={{ color: p.featured ? "#C8A96E" : "#C8C0B0" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill={p.featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2">
                      <path d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8 3.4 9.2l.5-3L1.7 4.1l3-.4z" />
                    </svg>
                    {p.featured ? "예" : "아니오"}
                  </button>

                  {/* Published */}
                  <button
                    onClick={() => handleTogglePublish(p)}
                    className="w-10 h-5 rounded-full relative transition-all duration-300"
                    style={{ backgroundColor: p.published ? "#C8A96E" : "#E5DDD4" }}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                      style={{ left: p.published ? "calc(100% - 18px)" : "2px" }}
                    />
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditing({ ...p, images: p.images ?? [] })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-[#E5DDD4]"
                      title="Edit"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M8 2l2 2-6 6H2V8l6-6z" stroke="#6B6560" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-red-50"
                      title="Delete"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 3h8M5 3V2h2v1M4 3v7h4V3" stroke={deleting === p.id ? "#C8A96E" : "#6B6560"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={() => setEditing(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative w-full md:w-[600px] h-full overflow-y-auto"
            style={{ backgroundColor: "#F8F5F0", animation: "slideInRight 0.4s cubic-bezier(0.23,1,0.32,1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b" style={{ backgroundColor: "#F8F5F0", borderColor: "#E5DDD4" }}>
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#C8A96E]">
                  {editing.id ? "수정" : "새 프로젝트"}
                </p>
                <h2 className="text-xl font-light text-[#1A1814] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {editing.title || "Untitled"}
                </h2>
              </div>
              <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-full border border-[#E5DDD4] flex items-center justify-center hover:border-[#C8A96E] transition-colors">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1L1 9" stroke="#6B6560" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="px-8 py-8 space-y-8">
              {/* Cover Image */}
              <div>
                <label className={labelClass}>커버 이미지</label>
                <div
                  className="relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
                  style={{
                    height: "200px",
                    borderColor: dragOver ? "#C8A96E" : "#E5DDD4",
                    backgroundColor: dragOver ? "rgba(200,169,110,0.04)" : "transparent",
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleCoverDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {editing.coverImage ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={editing.coverImage} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-xs tracking-widest">이미지 변경</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      {uploading ? (
                        <div className="w-8 h-8 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#C8C0B0]">
                            <path d="M4 16l4-4 4 4 4-6 4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                          <p className="text-xs text-[#C8C0B0]">드래그 앤 드롭 또는 클릭하여 업로드</p>
                          <p className="text-[9px] text-[#C8C0B0] mt-1">JPG / PNG / WebP / GIF · 최대 10MB</p>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadFile(file, (url) => setEditing((prev) => prev ? { ...prev, coverImage: url } : prev));
                    }}
                  />
                </div>
                {editing.coverImage && (
                  <button
                    className="mt-2 text-[10px] text-red-400 hover:text-red-500 tracking-widest uppercase"
                    onClick={() => setEditing((prev) => prev ? { ...prev, coverImage: "" } : prev)}
                  >
                    커버 삭제
                  </button>
                )}
              </div>

              {/* Title */}
              <div>
                <label className={labelClass}>프로젝트 제목 *</label>
                <input
                  className={inputClass}
                  value={editing.title}
                  placeholder="예: 한남동 레지던스"
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>

              {/* Year + Space Type */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>연도 *</label>
                  <input
                    className={inputClass}
                    value={editing.year}
                    placeholder="2024"
                    onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>공간 유형 *</label>
                  <select
                    className={inputClass}
                    value={editing.spaceType}
                    onChange={(e) => setEditing({ ...editing, spaceType: e.target.value })}
                  >
                    {SPACE_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className={labelClass}>위치</label>
                <input
                  className={inputClass}
                  value={editing.location ?? ""}
                  placeholder="예: 경기도 고양시"
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                />
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>설명</label>
                <textarea
                  className={inputClass + " resize-none"}
                  rows={4}
                  value={editing.description ?? ""}
                  placeholder="프로젝트 설명을 입력하세요..."
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>

              {/* Additional Images */}
              <div>
                <label className={labelClass}>추가 이미지</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {(editing.images ?? []).map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setEditing((prev) =>
                          prev ? { ...prev, images: (prev.images ?? []).filter((_, idx) => idx !== i) } : prev
                        )}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M1 1l10 10M11 1L1 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-[#E5DDD4] flex items-center justify-center hover:border-[#C8A96E] transition-colors"
                    onClick={() => imagesInputRef.current?.click()}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#C8C0B0]">
                      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <input
                  ref={imagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImagesUpload(e.target.files)}
                />
                <p className="text-[10px] text-[#C8C0B0]">+를 클릭하여 이미지 추가</p>
              </div>

              {/* Display Order */}
              <div>
                <label className={labelClass}>표시 순서</label>
                <input
                  type="number"
                  className={inputClass}
                  value={editing.displayOrder ?? 0}
                  onChange={(e) => setEditing({ ...editing, displayOrder: parseInt(e.target.value) || 0 })}
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-8">
                {[
                  { label: "추천", key: "featured" as const },
                  { label: "공개", key: "published" as const },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center gap-3">
                    <button
                      onClick={() => setEditing({ ...editing, [key]: !editing[key] })}
                      className="w-10 h-5 rounded-full relative transition-all duration-300"
                      style={{ backgroundColor: editing[key] ? "#C8A96E" : "#E5DDD4" }}
                    >
                      <span
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                        style={{ left: editing[key] ? "calc(100% - 18px)" : "2px" }}
                      />
                    </button>
                    <label className="text-xs text-[#6B6560]">{label}</label>
                  </div>
                ))}
              </div>

              {/* Save */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs tracking-[0.2em] uppercase text-white transition-all duration-300 hover:opacity-80 disabled:opacity-50"
                  style={{ backgroundColor: "#1A1814" }}
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 5l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      저장
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase text-[#6B6560] border border-[#E5DDD4] hover:border-[#1A1814] hover:text-[#1A1814] transition-all duration-300"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
