import { useState } from "react";
import PeludosFilters from "../components/nuestrosPeludos/PeludosFilters";
import PeludosHeader from "../components/nuestrosPeludos/PeludosHeader";
import CatGrid from "../components/nuestrosPeludos/CatGrid";

export default function NuestrosPeludos() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      <PeludosHeader onFilter={() => setFiltersOpen(true)} />
      <PeludosFilters
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={(f) => console.log(f)}
      />
      <CatGrid />
    </>
  );
}