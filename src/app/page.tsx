"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Select,
  Skeleton,
  EmptyState,
  Pagination,
  Drawer,
  Modal,
} from "@/components/ui";

export default function ComponentShowcasePage() {
  // State for interactive components
  const [btnLoading, setBtnLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("electronics");
  const [currentPage, setCurrentPage] = useState(2);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<"sm" | "md" | "lg">("md");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              UI Components &amp; Variants Showcase
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Katalog seluruh komponen reusable murni di <code>src/components/ui</code>.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            Buka Halaman /products &rarr;
          </Link>
        </header>

        {/* 1. BUTTONS */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div>
              <h2 className="text-lg font-semibold">1. Button</h2>
              <p className="text-xs text-zinc-500">Semua varian, ukuran, dan status loading/disabled.</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBtnLoading(!btnLoading)}
            >
              Toggle Loading ({btnLoading ? "ON" : "OFF"})
            </Button>
          </div>

          {/* Variants */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Variants</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" isLoading={btnLoading}>Primary</Button>
              <Button variant="secondary" isLoading={btnLoading}>Secondary</Button>
              <Button variant="outline" isLoading={btnLoading}>Outline</Button>
              <Button variant="danger" isLoading={btnLoading}>Danger</Button>
              <Button variant="ghost" isLoading={btnLoading}>Ghost</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" variant="primary">Small (sm)</Button>
              <Button size="md" variant="primary">Medium (md)</Button>
              <Button size="lg" variant="primary">Large (lg)</Button>
            </div>
          </div>

          {/* With Icons */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">With Icons</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Tambah Produk
              </Button>
              <Button
                variant="outline"
                rightIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
              >
                Selanjutnya
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                }
              >
                Hapus
              </Button>
            </div>
          </div>
        </section>

        {/* 2. INPUT */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold">2. Input</h2>
            <p className="text-xs text-zinc-500">Normal, dengan ikon, helper text, error message, dan status disabled.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Standard Input"
              placeholder="Ketik sesuatu..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <Input
              label="Dengan Left Icon (Pencarian)"
              placeholder="Cari produk atau SKU..."
              leftIcon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />

            <Input
              label="Dengan Helper Text"
              placeholder="99.99"
              helperText="Harga dalam USD, tidak termasuk pajak pengiriman."
            />

            <Input
              label="Dengan Error State"
              defaultValue="SKU-INVALID-1"
              error="Format SKU tidak valid. Harus sesuai ^SKU-[A-Z]{3}-[0-9]{4}$"
            />

            <Input
              label="Disabled Input"
              value="Nilai yang dikunci"
              disabled
              helperText="Input ini dinonaktifkan."
            />
          </div>
        </section>

        {/* 3. SELECT */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold">3. Select</h2>
            <p className="text-xs text-zinc-500">Dropdown native modern dengan variasi status.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Kategori Produk"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={[
                { value: "smartphones", label: "Smartphones" },
                { value: "laptops", label: "Laptops" },
                { value: "fragrances", label: "Fragrances" },
                { value: "groceries", label: "Groceries" },
              ]}
            />

            <Select
              label="Urutkan (Sort By)"
              defaultValue="price_desc"
              helperText="Mengatur urutan di daftar tabel."
              options={[
                { value: "title_asc", label: "Nama (A - Z)" },
                { value: "title_desc", label: "Nama (Z - A)" },
                { value: "price_asc", label: "Harga (Termurah)" },
                { value: "price_desc", label: "Harga (Termahal)" },
                { value: "rating_desc", label: "Rating Tertinggi" },
              ]}
            />

            <Select
              label="Pilihan Gagal (Error)"
              error="Kategori ini sedang tidak tersedia."
              options={[{ value: "", label: "Pilih salah satu..." }]}
            />
          </div>
        </section>

        {/* 4. SKELETON */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold">4. Skeleton</h2>
            <p className="text-xs text-zinc-500">Placeholder animasi pulsa untuk varian text, circular, dan rectangular.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400">Variant: Text</span>
              <Skeleton variant="text" className="w-3/4 h-5" />
              <Skeleton variant="text" className="w-full h-4" />
              <Skeleton variant="text" className="w-5/6 h-4" />
            </div>

            <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400">Variant: Circular (Avatar)</span>
              <div className="flex gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={56} height={56} />
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400">Card Skeleton Composition</span>
              <div className="flex gap-3 items-center">
                <Skeleton variant="circular" width={36} height={36} />
                <div className="flex-1 space-y-1.5">
                  <Skeleton variant="text" className="w-1/2 h-3" />
                  <Skeleton variant="text" className="w-3/4 h-3" />
                </div>
              </div>
              <Skeleton variant="rectangular" height={60} />
            </div>
          </div>
        </section>

        {/* 5. EMPTY STATE */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold">5. EmptyState</h2>
            <p className="text-xs text-zinc-500">Tampilan saat data kosong atau hasil pencarian tidak ditemukan.</p>
          </div>

          <EmptyState
            title="Tidak Ada Produk Ditemukan"
            description="Tidak ada produk yang cocok dengan kata kunci atau filter yang Anda terapkan. Coba ubah atau reset filter Anda."
            actionText="Reset Filter"
            onAction={() => alert("Tombol Reset Filter diklik!")}
          />
        </section>

        {/* 6. PAGINATION */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold">6. Pagination</h2>
            <p className="text-xs text-zinc-500">Kontrol navigasi halaman interaktif dengan info total item.</p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              totalItems={95}
              itemsPerPage={10}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        </section>

        {/* 7. DRAWER & MODAL (INTERACTIVE OVERLAYS) */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold">7. Overlays (Drawer &amp; Modal)</h2>
            <p className="text-xs text-zinc-500">Komponen dialog dan slide-over dengan backdrop, lock scroll, dan shortcut Escape.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" onClick={() => setIsDrawerOpen(true)}>
              Buka Slide-Over Drawer
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setModalSize("md");
                setIsModalOpen(true);
              }}
            >
              Buka Modal (Medium)
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setModalSize("sm");
                setIsModalOpen(true);
              }}
            >
              Buka Modal Konfirmasi (Small)
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setModalSize("lg");
                setIsModalOpen(true);
              }}
            >
              Buka Modal Lebar (Large)
            </Button>
          </div>
        </section>

        {/* DRAWER INSTANCE */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Filter Produk (Mobile Drawer)"
        >
          <div className="space-y-5">
            <p className="text-sm text-zinc-500">
              Panel ini akan muncul di layar mobile untuk memudahkan user mengatur pencarian, kategori, dan sort.
            </p>

            <Input
              label="Cari Berdasarkan Kata Kunci"
              placeholder="Contoh: iphone, laptop..."
            />

            <Select
              label="Pilih Kategori"
              options={[
                { value: "all", label: "Semua Kategori" },
                { value: "beauty", label: "Beauty" },
                { value: "fragrances", label: "Fragrances" },
                { value: "groceries", label: "Groceries" },
              ]}
            />

            <div className="pt-4 flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => setIsDrawerOpen(false)}
              >
                Terapkan Filter
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </Drawer>

        {/* MODAL INSTANCE */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Ubah Produk (Contoh Modal)"
          description="Contoh dialog pop-up dengan ukuran dinamis dan footer aksi."
          maxWidth={modalSize}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert("Disimpan!");
                  setIsModalOpen(false);
                }}
              >
                Simpan Perubahan
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input label="Nama Produk" defaultValue="Essence Mascara Lash Princess" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Harga ($)" type="number" defaultValue="9.99" />
              <Input label="Stok" type="number" defaultValue="99" />
            </div>
            <p className="text-xs text-zinc-500">
              Ukuran saat ini: <code className="font-semibold text-zinc-800 dark:text-zinc-200">{modalSize}</code>. Coba tekan tombol <code>Esc</code> pada keyboard atau klik di luar untuk menutup.
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
}
