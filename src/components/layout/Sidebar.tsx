"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, X, LayoutDashboard, LayoutGrid, CreditCard, Shield, Users, BarChart3, HeadphonesIcon, FolderOpen, FileText, UploadCloud, Edit2, TrendingUp, Mail, Package, Lock, Layers, PenTool, Share2, Video, Briefcase, Radio, CheckCircle2, MessageSquare, Moon, Activity, Zap, Calendar, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const { language } = useLanguage();
  const pathname = usePathname();

  const [logo, setLogo] = useState<string | null>(null);
  const [appName, setAppName] = useState("AdminSmart 369");
  const [slogan, setSlogan] = useState("Your Portal");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedLogo = localStorage.getItem("custom_logo");
    const savedName = localStorage.getItem("custom_appName");
    const savedSlogan = localStorage.getItem("custom_slogan");
    if (savedLogo) setLogo(savedLogo);
    if (savedName) setAppName(savedName);
    if (savedSlogan) setSlogan(savedSlogan);

    // Fetch user role for admin link
    const fetchRole = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
          if (data) setIsAdmin(data.role === 'admin');
        }
      } catch (e) {}
    };
    fetchRole();
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxSize = 128;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL("image/webp", 0.9);
        setLogo(dataUrl);
        localStorage.setItem("custom_logo", dataUrl);
      };
      if (ev.target?.result) img.src = ev.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppName(e.target.value);
    localStorage.setItem("custom_appName", e.target.value);
  };

  const handleSloganChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlogan(e.target.value);
    localStorage.setItem("custom_slogan", e.target.value);
  };

  const links: any[] = [
    {
      name: language === "en" ? "Dashboard" : "Panel Principal",
      href: "/dashboard",
      icon: LayoutDashboard,
      activeStart: "/dashboard",
    },
    {
      name: "AdminSmart 369",
      href: "/apps",
      icon: LayoutGrid,
      activeStart: "/apps",
    },
    {
      name: language === "en" ? "Plans" : "Planes",
      href: "/plans",
      icon: CreditCard,
      activeStart: "/plans",
    },
    {
      name: language === "en" ? "CRM (Customers)" : "CRM (Clientes)",
      href: "/apps/crm",
      icon: Users,
    },
    {
      name: language === "en" ? "Analytics" : "Analíticas",
      href: "/apps/analytics",
      icon: BarChart3,
    },
    {
      name: language === "en" ? "Growth (MRR)" : "Crecimiento",
      href: "/apps/growth",
      icon: TrendingUp,
    },
    {
      name: language === "en" ? "HelpDesk" : "Soporte (HelpDesk)",
      href: "/apps/helpdesk",
      icon: HeadphonesIcon,
    },
    {
      name: language === "en" ? "Documents" : "Documentos",
      href: "/apps/documents",
      icon: FolderOpen,
    },
    {
      name: language === "en" ? "Payroll" : "Nóminas",
      href: "/apps/payroll",
      icon: FileText,
    },
    {
      name: "FichaFit (Gym)",
      href: "/apps/fichafit",
      icon: CheckCircle2,
    },
    {
      name: "GymBot FAQ",
      href: "/apps/gymbot",
      icon: MessageSquare,
    },
    {
      name: "NightLead Gym",
      href: "/apps/nightlead",
      icon: Moon,
    },
    {
      name: "PulsoGym (Reporte)",
      href: "/apps/pulsogym",
      icon: Activity,
    },
    {
      name: "ContratoFit",
      href: "/apps/contratofit",
      icon: PenTool,
    },
    {
      name: "InscripciónTotal ⚡",
      href: "/apps/inscripcion",
      icon: Zap,
    },
    {
      name: "ContentFlow AI 📅",
      href: "/apps/contentflow",
      icon: Calendar,
    },
    {
      name: "CopyAds AI 📢",
      href: "/apps/copyads",
      icon: Megaphone,
    },
  ];

  if (isAdmin) {
    links.push({
      name: "Admin",
      href: "/admin",
      icon: Shield,
      activeStart: undefined,
    });
    links.push({
      name: "Webhooks",
      href: "/admin/webhooks",
      icon: Radio,
      activeStart: "/admin/webhooks",
      isChild: true,
    });
    links.push({
      name: "Email",
      href: "/admin/email",
      icon: Mail,
      activeStart: "/admin/email",
      isChild: true,
    });
  }

  const content = (
    <div className="flex flex-col h-full bg-[#0A0520]/80 backdrop-blur-2xl border-r border-white/10 text-white transition-all duration-300">
      {/* Top Section */}
      <div className={`flex items-start justify-between shrink-0 p-4 border-b border-white/10 relative group ${!collapsed && isEditing ? "bg-white/5" : ""}`}>
        
        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleLogoUpload} />

        <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'w-0 opacity-0 lg:w-auto lg:opacity-100 flex-col justify-center' : 'w-full opacity-100'}`}>
          {/* Logo Container */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-pink)] shrink-0 flex items-center justify-center font-bold shadow-lg cursor-pointer relative overflow-hidden group/logo"
            title="Cambiar Logo"
          >
            {logo ? (
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">{appName.charAt(0).toUpperCase()}</span>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity">
              <UploadCloud size={16} className="text-white" />
            </div>
          </div>
          
          {/* Text Container */}
          <div className={`transition-opacity duration-300 flex-1 min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
            {isEditing ? (
              <div className="flex flex-col gap-1 w-full animate-in fade-in">
                <input 
                  type="text" 
                  value={appName} 
                  onChange={handleNameChange}
                  className="bg-black/40 border border-[var(--color-primary)]/50 rounded px-2 py-1 text-sm font-bold text-white w-full focus:outline-none"
                  placeholder="Nombre de la App"
                />
                <input 
                  type="text" 
                  value={slogan} 
                  onChange={handleSloganChange}
                  className="bg-black/40 border border-white/10 rounded px-2 py-0.5 text-[10px] text-white/60 w-full focus:outline-none focus:border-white/30"
                  placeholder="Slogan / Lema"
                />
              </div>
            ) : (
              <div className="flex flex-col min-w-0 cursor-pointer" onClick={() => !collapsed && setIsEditing(true)}>
                <span className="font-bold text-lg leading-tight whitespace-nowrap tracking-tight truncate group-hover:text-[var(--color-primary)] transition-colors">
                  {appName}
                </span>
                <span className="text-[10px] leading-tight text-white/40 uppercase tracking-widest truncate mt-0.5">
                  {slogan}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {!collapsed && (
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className={`hidden lg:block absolute right-2 top-4 p-1.5 rounded-md transition-colors ${isEditing ? "bg-[var(--color-primary)] text-white" : "opacity-0 group-hover:opacity-100 text-white/40 hover:text-white hover:bg-white/10"}`}
            title={isEditing ? "Guardar" : "Editar Nombre/Logo"}
          >
            {isEditing ? <X size={14} /> : <Edit2 size={14} />}
          </button>
        )}

        {/* Mobile close button */}
        <button onClick={onCloseMobile} className="lg:hidden p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg shrink-0">
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => {
          // If activeStart is defined, use startsWith logic (perfect for /apps and /admin subpages)
          // Otherwise, exact match for backwards compatibility
          const isActive = link.activeStart 
            ? pathname.startsWith(link.activeStart) && (link.activeStart !== '/apps' || pathname === '/apps' || !pathname.includes('/', 6))
            : pathname === link.href;
            
          const Icon = link.icon;
          const isChild = (link as any).isChild;
          
          let itemClass = `flex items-center gap-3 rounded-xl transition-all duration-200 group `;
          itemClass += isChild 
            ? `ml-4 pl-4 py-2 text-xs border-l ${isActive ? 'border-[var(--color-primary)]/50' : 'border-white/10'}` 
            : `px-3 py-2.5`;
            
          if (collapsed && isChild) {
            itemClass += ` justify-center px-2 ml-0 pl-2 border-l-0`;
          }

          if (isActive) {
            itemClass += ` bg-[var(--color-primary)]/20 text-[var(--color-primary)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-[var(--color-primary)]/30`;
          } else {
            itemClass += ` text-white/60 hover:text-white hover:bg-white/5`;
          }

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => onCloseMobile()}
              className={itemClass}
              title={collapsed ? link.name : undefined}
            >
              <Icon size={isChild ? 16 : 20} className={`shrink-0 ${isActive ? "text-[var(--color-primary)]" : "text-white/40 group-hover:text-white/80"}`} />
              <span className={`whitespace-nowrap font-medium ${isChild ? 'text-xs' : 'text-sm'} transition-opacity duration-300 ${collapsed ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : ""}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Section (Desktop Collapse) */}
      <div className="hidden lg:flex items-center justify-center p-4 border-t border-white/10 shrink-0">
        <button
          onClick={onToggleCollapse}
          className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 h-dvh z-40 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {content}
      </aside>
    </>
  );
}
