import { Button, Drawer, Select } from '@/components/ui';
import { ProductSortOption } from '@/types';

interface FilterDrawerProps {
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (isMobileFilterOpen: boolean) => void;
  category: string;
  setCategory: (category: string) => void;
  categories: { slug: string; name: string }[];
  sort: ProductSortOption;
  setSort: (sort: ProductSortOption) => void;
  handleResetFilters: () => void;
}

function FilterDrawer({
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  category,
  setCategory,
  categories,
  sort,
  setSort,
  handleResetFilters
}: FilterDrawerProps) {
  return (
    <Drawer
      isOpen={isMobileFilterOpen}
      onClose={() => setIsMobileFilterOpen(false)}
      title="Filter &amp; Urutkan"
    >
      <div className="space-y-5">
        <Select
          label="Kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[
            { value: "", label: "Semua Kategori" },
            ...categories.map((c) => ({ value: c.slug, label: c.name })),
          ]}
        />

        <Select
          label="Urutan (Sort)"
          value={sort}
          onChange={(e) => setSort(e.target.value as ProductSortOption)}
          options={[
            { value: "title_asc", label: "Nama (A - Z)" },
            { value: "title_desc", label: "Nama (Z - A)" },
            { value: "price_asc", label: "Harga: Termurah" },
            { value: "price_desc", label: "Harga: Termahal" },
            { value: "rating_desc", label: "Rating Tertinggi" },
          ]}
        />

        <div className="pt-4 flex gap-3">
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            Terapkan
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              handleResetFilters();
              setIsMobileFilterOpen(false);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default FilterDrawer