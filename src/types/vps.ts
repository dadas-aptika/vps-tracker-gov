
export interface VPSData {
  id: string;
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  applications: string[];
  unit: string;
  status: "active" | "inactive";
}
