import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

// Define the types for the hierarchy data
interface ProductType {
  id: string;
  categoryId: string;
  code: string;
  name: string;
  description: string;
}

interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string;
  level: number;
  children?: Category[];
  productTypes?: ProductType[];
}

interface DynamicNavigationProps {
  data: Category[];
}

export default function DynamicNavigation({ data }: DynamicNavigationProps) {
  // Filter for top-level categories (level 0)
  const topLevelCategories = data.filter((cat) => cat.level === 0);

  return (
    <nav className="flex items-center justify-start w-full lg:w-fit overflow-x-auto py-2">
      {topLevelCategories.map((category) => (
        <DropdownMenu key={category.id}>
          <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-orange-600 px-2 sm:px-3 lg:px-4 py-2 rounded-md hover:bg-orange-50 outline-none w-fit justify-start">
            {category.name}
            <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground hidden lg:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-screen sm:w-auto sm:min-w-[600px] lg:w-screen p-0 shadow-xl border-0 bg-background rounded-none translate-y-2"
            align="end"
            sideOffset={0}
          >
            <div className="border-t border-border bg-background w-[100vw]">
              <div className="w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                {category.children && category.children.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-4 lg:gap-x-8 gap-y-3 lg:gap-y-4">
                    {/* Parent Category - Takes first column on desktop, full width on mobile */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1 mb-4 sm:mb-0">
                      <Link
                        href={`/services/${category.slug}?catId=${category.id}`}
                        className="group block p-3 rounded-lg hover:bg-orange-50 transition-all duration-200"
                      >
                        <div className="text-base font-semibold text-foreground group-hover:text-orange-600">
                          View All {category.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {category.description}
                        </div>
                      </Link>
                    </div>

                    {/* Children Categories - Responsive grid layout */}
                    {category.children.map((child) => (
                      <div key={child.id} className="col-span-1">
                        <Link
                          href={`/services/${child.slug}?catId=${child.id}`}
                          className="group block p-3 rounded-lg hover:bg-orange-50 transition-all duration-200"
                        >
                          <div className="text-sm font-medium text-foreground group-hover:text-orange-500">
                            {child.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {child.description}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Fallback: if a top-level category has no children - mobile responsive
                  <Link
                    href={`/services/${category.slug}?catId=${category.id}`}
                    className="block p-3 sm:p-4 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <div className="text-base font-medium text-foreground hover:text-orange-500">
                      {category.name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </nav>
  );
}
