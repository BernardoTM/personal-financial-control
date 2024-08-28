import { useEffect, useState } from "react";
import {
  ArrowRightLeft,
  LayoutDashboard,
  Landmark,
  PanelLeftOpen,
  ClipboardList,
  SlidersHorizontal,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { subDays } from "date-fns";
import Cookies from "js-cookie";

const start = subDays(new Date(), 30).toISOString().split("T")[0];
const finish = new Date().toISOString().split("T")[0];
const month = String(new Date().getMonth());
const year = String(new Date().getFullYear());

const Navbar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("accessToken") == undefined) {
      navigate(`/`);
    }
  }, []);

  const menus = [
    {
      name: "Dashboard",
      path: `dashboard?month=${month}&year=${year}`,
      icon: <LayoutDashboard className="h-6 w-6" />,
    },
    {
      name: "Transações",
      path: `transaction?page=1&limit=10&start=${start}&finish=${finish}`,
      icon: <ArrowRightLeft className="h-6 w-6" />,
    },
    {
      name: "Contas",
      path: "account",
      icon: <Landmark className="h-6 w-6" />,
    },
    {
      name: "Categorias",
      path: "categorie",
      icon: <ClipboardList className="h-6 w-6" />,
    },
    {
      name: "Orçamentos",
      path: `budget`,
      icon: <SlidersHorizontal className="h-6 w-6" />,
    },
    // {
    //   name: "Investimentos",
    //   path: `investment?page=1&limit=10&start=${start}&finish=${finish}`,
    //   icon: <LineChart className="h-6 w-6" />,
    //   margin: true,
    // },
    // {
    //   name: "Metas",
    //   path: "goal",
    //   icon: <Goal className="h-6 w-6" />,
    // },
  ];
  const [open, setOpen] = useState<boolean>(true);

  return (
    <nav
      className={` bg-selection min-h-screen ${
        open ? "w-72" : "w-[71px]"
      } duration-500 text-foreground px-4`}
    >
      <div className={`${open ? "justify-end" : "justify-center"} py-3 flex`}>
        <span className="hover:bg-accent rounded-md p-[7px]">
          <PanelLeftOpen
            className="cursor-pointer h-6 w-6 "
            onClick={() => setOpen(!open)}
          />
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-4 relative">
        {menus?.map((menu, i) => (
          <Link
            to={menu?.path}
            key={i}
            className={`group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-accent rounded-md`}
          >
            {/* ${menu?.margin && "mt-5"}  */}
            <div className="h-6 w-6">{menu?.icon}</div>
            <h2
              style={{
                transitionDelay: `${i + 1}00ms`,
              }}
              className={`whitespace-pre duration-500 ${
                !open && "opacity-0 translate-x-28 overflow-hidden"
              }`}
            >
              {menu?.name}
            </h2>
            <h2
              className={`${
                open && "hidden"
              } absolute left-10 bg-white z-10 font-semibold whitespace-pre text-gray-900 
              rounded-md px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 
              group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
            >
              {menu?.name}
            </h2>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
