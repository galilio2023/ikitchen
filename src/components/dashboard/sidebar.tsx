import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Box, Ruler, Settings, Database } from "lucide-react"
import Link from "next/link"

export function Sidebar() {
    return (
        <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col h-screen sticky top-0">
            <div className="p-8">
                <h2 className="text-xl font-black tracking-tighter text-white">
                    KITCHEN<span className="text-slate-500">MAN</span>
                </h2>
                <p className="text-[10px] font-mono text-blue-500 mt-1 uppercase tracking-widest">
                    Engine_v0.1
                </p>
            </div>

            <ScrollArea className="flex-1 px-4">
                <nav className="space-y-6">
                    <section>
                        <p className="px-4 text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold mb-4">Core_Control</p>
                        <div className="space-y-1">
                            <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" active />
                            <NavItem href="/projects" icon={<Box size={18} />} label="3D_Models" />
                            <NavItem href="/measurements" icon={<Ruler size={18} />} label="Calculations" />
                        </div>
                    </section>

                    <section>
                        <p className="px-4 text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold mb-4">System</p>
                        <div className="space-y-1">
                            <NavItem href="/inventory" icon={<Database size={18} />} label="Material_DB" />
                            <NavItem href="/settings" icon={<Settings size={18} />} label="Settings" />
                        </div>
                    </section>
                </nav>
            </ScrollArea>

            <div className="p-4 mt-auto border-t border-slate-800">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-xs font-bold">IG</div>
                        <div className="text-xs">
                            <p className="text-white font-medium">I. Galal</p>
                            <p className="text-slate-500 font-mono text-[9px]">Operator_Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
    return (
        <Link href={href} className={`
      flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200
      ${active
            ? 'bg-slate-100 text-slate-900 font-bold'
            : 'text-slate-400 hover:text-white hover:bg-slate-900'}
    `}>
            {icon}
            <span className="font-mono tracking-tight">{label}</span>
        </Link>
    )
}