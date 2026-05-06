import { Link } from "react-router-dom";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { MenuItem } from "../types";
import { SubMenuLink } from "./SubMenuLink";

const MenuItemMobile = ({ item }: { item: MenuItem }) => {
  if (item.items) {
    return (
      <AccordionItem value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link to={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

export { MenuItemMobile };
