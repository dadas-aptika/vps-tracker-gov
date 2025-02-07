
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { VPSData } from "@/pages/Index";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: "#10B981",
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 20,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    minHeight: 30,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#F9FAFB",
  },
  tableCell: {
    width: "20%",
    padding: 8,
    fontSize: 10,
  },
  specs: {
    fontSize: 10,
    color: "#6B7280",
  },
  badge: {
    padding: "4px 8px",
    borderRadius: 4,
    fontSize: 10,
    backgroundColor: "#E5E7EB",
    color: "#374151",
    textAlign: "center",
    width: "auto",
    marginBottom: 4,
  },
  activeBadge: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },
  appBadge: {
    backgroundColor: "#EEF2FF",
    color: "#4F46E5",
    marginRight: 4,
  },
  appsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

interface VPSReportProps {
  data: VPSData[];
}

const VPSReport = ({ data }: VPSReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Laporan Data VPS</Text>
        <Text style={styles.subtitle}>
          Total VPS: {data.length} | VPS Aktif:{" "}
          {data.filter((vps) => vps.status === "active").length}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Nama VPS</Text>
          <Text style={styles.tableCell}>Spesifikasi</Text>
          <Text style={styles.tableCell}>Aplikasi</Text>
          <Text style={styles.tableCell}>Unit/Instansi</Text>
          <Text style={styles.tableCell}>Status</Text>
        </View>

        {data.map((vps, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{vps.name}</Text>
            <View style={styles.tableCell}>
              <Text style={styles.specs}>CPU: {vps.cpu}</Text>
              <Text style={styles.specs}>RAM: {vps.ram}</Text>
              <Text style={styles.specs}>Storage: {vps.storage}</Text>
            </View>
            <View style={styles.tableCell}>
              {vps.applications.map((app, i) => (
                <Text key={i} style={[styles.badge, styles.appBadge]}>
                  {app}
                </Text>
              ))}
            </View>
            <Text style={styles.tableCell}>{vps.unit}</Text>
            <Text
              style={[
                styles.badge,
                vps.status === "active" && styles.activeBadge,
              ]}
            >
              {vps.status === "active" ? "Aktif" : "Non-aktif"}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default VPSReport;
