// assets.js
import logo from "./images/logo.png";  
import bg_img from "./images/bg.jpg";
import lg1 from "./images/lg1.webp";
import { 
  LayoutDashboard, 
  List, 
  Wallet, 
  Coins,
  FunnelPlus 
} from "lucide-react";  // Import all required icons

export const assets = {
    logo,
    bg_img,
    lg1,
};

export const SIDE_BAR_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Category",
        icon: List,
        path: "/category"
    },
    {
        id: "03",
        label: "Income",
        icon: Wallet,
        path: "/income",
    },
    {
        id: "04",
        label: "Expense",
        icon: Coins,
        path: "/expense",
    },
    {
        id: "05",
        label: "Filters",
        icon: FunnelPlus,
        path: "/filter",
    }
];