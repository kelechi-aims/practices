import { getCabins } from "@/app/_lib/data-service";
import CabinCard from "./CabinCard";
// import { connection } from "next/server";

async function CabinList({ filter }) {
  // await connection(); // also for revalidation but in component, choose this or the other
  const cabins = await getCabins();

  if (!cabins.length) return null;

  let displayedCabins;

  if (filter === "all") displayedCabins = cabins;

  if (filter === "small")
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);

  if (filter === "medium")
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7,
    );

  if (filter === "large")
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
