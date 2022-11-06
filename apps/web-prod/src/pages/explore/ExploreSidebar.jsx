import { IconNew, IconTop } from "@/components/ui/icons/Icons";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import SidebarItem from "@/components/ui/sidebar/SidebarItem";
import SidebarLabel from "@/components/ui/sidebar/SidebarLabel";
import { VectorLogo } from "@/components/ui/vectors";
import { ServerCategory } from "@/graphql/hooks";
import { getCategoryIcon } from "@/hooks/getCategoryIcon";
import { useStore } from "@/hooks/useStore";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function Category({ category }) {
  const { t } = useTranslation();
  const [exploreCategory, setExploreCategory] = useStore((s) => [
    s.exploreCategory,
    s.setExploreCategory,
  ]);

  const Icon = getCategoryIcon(category);
  return (
    <SidebarItem
      onClick={() => setExploreCategory(category)}
      active={exploreCategory === category}
    >
      <Icon className={`w-5 h-5 mr-3`} />
      {category ? t(`category.${category}`) : t("explore.all")}
    </SidebarItem>
  );
}

function Sort({ sort, label, icon }) {
  const [exploreSort, setExploreSort] = useStore((s) => [
    s.exploreSort,
    s.setExploreSort,
  ]);

  const Icon = icon;
  return (
    <SidebarItem
      onClick={() => setExploreSort(sort)}
      active={exploreSort === sort}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </SidebarItem>
  );
}

export default function ExploreSidebar() {
  const { t } = useTranslation();
  const categories = useMemo(() => {
    let c = Object.keys(ServerCategory);
    // Make 'Other' last
    const removed = c.splice(c.indexOf(ServerCategory.Other), 1);
    c.push(...removed);
    return c;
  }, []);

  return (
    <Sidebar>
      <div className="h-12 border-b dark:border-gray-850 shadow flex items-center px-5 text-base font-medium">
        <VectorLogo className="h-10" />
      </div>
      <div className="px-1.5">
        <SidebarLabel>{t("explore.sort.label")}</SidebarLabel>
        <div className="space-y-0.5">
          <Sort
            label={t("explore.sort.mostPopular")}
            sort="Top"
            icon={IconTop}
          />
          <Sort label={t("explore.sort.newest")} sort="New" icon={IconNew} />
        </div>

        <SidebarLabel>{t("explore.categories")}</SidebarLabel>

        <div className="space-y-0.5">
          <Category category="Featured" />
          <Category category={null} />
          {categories.map((category) => (
            <Category key={category} category={category} />
          ))}
        </div>
      </div>
    </Sidebar>
  );
}