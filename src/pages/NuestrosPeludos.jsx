import { useState } from "react";
import PeludosFilters from "../components/nuestrosPeludos/PeludosFilters";
import PeludosHeader from "../components/nuestrosPeludos/PeludosHeader";
import CatGrid from "../components/nuestrosPeludos/CatGrid";

export default function NuestrosPeludos() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ ageRange: [0, 25], sexo: { macho: false, hembra: false } });
  const [sortValue, setSortValue] = useState(null);

  return (
    <>
      <PeludosHeader
        onFilter={() => setFiltersOpen(true)}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />
      <PeludosFilters
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={(f) => { setFilters(f); setFiltersOpen(false); }}
      />
      <CatGrid filters={filters} sortValue={sortValue} />
    </>
  );
}