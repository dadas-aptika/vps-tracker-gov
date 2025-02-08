
import { Server, Database, AppWindow } from "lucide-react";
import { VPSData } from "@/types/vps";

interface StatsCardsProps {
  vpsData: VPSData[];
}

export const StatsCards = ({ vpsData }: StatsCardsProps) => {
  const totalVPS = vpsData.length;
  const activeVPS = vpsData.filter((vps) => vps.status === "active").length;
  const totalApps = vpsData.reduce(
    (sum, vps) => sum + vps.applications.length,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="stats-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total VPS</p>
            <p className="text-2xl font-semibold text-gray-900">{totalVPS}</p>
          </div>
          <Server className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="stats-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">VPS Aktif</p>
            <p className="text-2xl font-semibold text-gray-900">{activeVPS}</p>
          </div>
          <Database className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="stats-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Aplikasi</p>
            <p className="text-2xl font-semibold text-gray-900">{totalApps}</p>
          </div>
          <AppWindow className="h-8 w-8 text-primary" />
        </div>
      </div>
    </div>
  );
};
