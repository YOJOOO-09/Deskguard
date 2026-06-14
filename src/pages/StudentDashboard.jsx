import { useEffect, useMemo, useState } from 'react';
import { Armchair, LayoutGrid, Search, SearchX, Users, UserX } from 'lucide-react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import StatCard from '../components/StatCard';
import DeskCell from '../components/DeskCell';
import DeskDetailsModal from '../components/DeskDetailsModal';
import QueueBanner from '../components/QueueBanner';
import DeskReadyModal from '../components/DeskReadyModal';
import GroupBookingPanel from '../components/GroupBookingPanel';
import QRScannerModal from '../components/QRScannerModal';
import { CURRENT_USER, FLOORS, SECTIONS } from '../data/mockData';
import { useDeskSocket } from '../hooks/useDeskSocket';
import {
  checkInDesk,
  claimDesk,
  fetchDesks,
  findCluster,
  joinQueue,
  leaveQueue,
  reserveCluster,
} from '../lib/api';

function parseDeskId(raw) {
  const trimmed = raw.trim();
  try {
    const obj = JSON.parse(trimmed);
    if (obj?.deskId) return String(obj.deskId).toUpperCase();
  } catch {
    // not JSON, fall through
  }
  const match = trimmed.match(/([A-Za-z]+\d+)\s*$/);
  return (match ? match[1] : trimmed).toUpperCase();
}

function getDeskStats(desks) {
  return {
    total: desks.length,
    available: desks.filter((d) => d.status === 'available').length,
    occupied: desks.filter((d) => d.status === 'occupied').length,
    away: desks.filter((d) => d.status === 'away').length,
    reserved: desks.filter((d) => d.status === 'reserved').length,
  };
}

export default function StudentDashboard({ onNavigate, onActiveDesk }) {
  const [search, setSearch] = useState('');
  const [floor, setFloor] = useState('All');
  const [section, setSection] = useState('All');
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [deskReady, setDeskReady] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [queueLoading, setQueueLoading] = useState(false);

  // QR scanning
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanTargetId, setScanTargetId] = useState(null);
  const [scanMessage, setScanMessage] = useState(null);

  // Group booking state
  const [cluster, setCluster] = useState(null);
  const [clusterReserved, setClusterReserved] = useState(null);
  const [clusterError, setClusterError] = useState(null);
  const [clusterLoading, setClusterLoading] = useState(false);

  const { desks, queue, setDesks } = useDeskSocket(CURRENT_USER.studentId, (notification) => {
    setDeskReady(notification);
  });

  // Initial fetch in case the WebSocket connection is still negotiating
  useEffect(() => {
    fetchDesks().then((data) => setDesks(data.desks)).catch(() => {});
  }, [setDesks]);

  useEffect(() => {
    if (!scanMessage) return undefined;
    const t = setTimeout(() => setScanMessage(null), 4000);
    return () => clearTimeout(t);
  }, [scanMessage]);

  const stats = useMemo(() => getDeskStats(desks), [desks]);
  const myPosition = useMemo(() => {
    const idx = queue.findIndex((q) => q.studentId === CURRENT_USER.studentId);
    return idx === -1 ? null : idx + 1;
  }, [queue]);

  const highlightedIds = useMemo(
    () => new Set(cluster?.deskIds ?? clusterReserved?.deskIds ?? []),
    [cluster, clusterReserved],
  );

  const filteredDesks = useMemo(() => {
    return desks.filter((desk) => {
      if (floor !== 'All' && desk.floor !== floor) return false;
      if (section !== 'All' && desk.section !== section) return false;
      if (search && !desk.id.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [desks, search, floor, section]);

  const grouped = useMemo(() => {
    const groups = new Map();
    filteredDesks.forEach((desk) => {
      const key = `${desk.floor}|${desk.section}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(desk);
    });
    return Array.from(groups.entries());
  }, [filteredDesks]);

  async function handleCheckIn(desk) {
    try {
      await checkInDesk(desk.id, CURRENT_USER.studentId, CURRENT_USER.name);
      setSelectedDesk(null);
      onActiveDesk?.(desk);
      onNavigate?.('session');
    } catch (err) {
      console.error(err);
    }
  }

  async function handleClaim(desk) {
    setClaiming(true);
    try {
      await claimDesk(desk.id, CURRENT_USER.studentId, CURRENT_USER.name);
      setSelectedDesk(null);
      setDeskReady(null);
      onActiveDesk?.(desk);
      onNavigate?.('session');
    } catch (err) {
      console.error(err);
    } finally {
      setClaiming(false);
    }
  }

  async function handleScanResult(raw) {
    const deskId = parseDeskId(raw);
    const target = scanTargetId;
    setScannerOpen(false);
    setScanTargetId(null);

    const desk = desks.find((d) => d.id === deskId);
    if (!desk) {
      setScanMessage(`No desk found for code "${deskId}".`);
      return;
    }

    if (target && target !== deskId) {
      setScanMessage(`Scanned ${deskId}, but you were viewing ${target}.`);
      setSelectedDesk(desk);
      return;
    }

    if (desk.status === 'available') {
      await handleCheckIn(desk);
    } else if (desk.status === 'reserved' && desk.reservedFor?.studentId === CURRENT_USER.studentId) {
      await handleClaim(desk);
    } else {
      setSelectedDesk(desk);
    }
  }

  async function handleDeskReadyClaim() {
    if (!deskReady) return;
    setClaiming(true);
    try {
      await claimDesk(deskReady.deskId, CURRENT_USER.studentId, CURRENT_USER.name);
      onActiveDesk?.({ id: deskReady.deskId, floor: deskReady.floor, section: deskReady.section });
      setDeskReady(null);
      onNavigate?.('session');
    } catch (err) {
      console.error(err);
      setDeskReady(null);
    } finally {
      setClaiming(false);
    }
  }

  async function handleJoinQueue() {
    setQueueLoading(true);
    try {
      await joinQueue(CURRENT_USER.studentId, CURRENT_USER.name);
    } catch (err) {
      console.error(err);
    } finally {
      setQueueLoading(false);
    }
  }

  async function handleLeaveQueue() {
    setQueueLoading(true);
    try {
      await leaveQueue(CURRENT_USER.studentId);
    } catch (err) {
      console.error(err);
    } finally {
      setQueueLoading(false);
    }
  }

  async function handleFindCluster(count, floorIndex) {
    setClusterLoading(true);
    setClusterError(null);
    setClusterReserved(null);
    try {
      const result = await findCluster(count, floorIndex);
      setCluster(result);
      // Reset filters so the highlighted cluster is visible regardless of current view
      setFloor('All');
      setSection('All');
      setSearch('');
    } catch (err) {
      setCluster(null);
      setClusterError(err.message);
    } finally {
      setClusterLoading(false);
    }
  }

  async function handleReserveCluster() {
    if (!cluster) return;
    try {
      await reserveCluster(cluster.deskIds, [{ studentId: CURRENT_USER.studentId, name: CURRENT_USER.name }]);
      setClusterReserved(cluster);
      setCluster(null);
    } catch (err) {
      setClusterError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-0">
      <Navbar onNavigate={onNavigate} active="dashboard" />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-ink">Library Map</h1>
          <p className="mt-1 text-sm text-body">
            Real-time desk availability across all floors — live via WebSocket.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={LayoutGrid} label="Total Desks" value={stats.total} accent="bg-primary-50 text-primary" trend="Across 3 floors" />
          <StatCard icon={Armchair} label="Available" value={stats.available} accent="bg-success-50 text-green-400" trend="Ready to book" />
          <StatCard icon={Users} label="Occupied" value={stats.occupied} accent="bg-occupied-50 text-red-400" trend="Currently in use" />
          <StatCard icon={UserX} label="Away" value={stats.away} accent="bg-away-50 text-yellow-400" trend="Pending auto-release" />
        </div>

        {/* Virtual queue banner */}
        <QueueBanner
          stats={stats}
          position={myPosition}
          queueLength={queue.length}
          onJoin={handleJoinQueue}
          onLeave={handleLeaveQueue}
          loading={queueLoading}
        />

        {/* Group booking */}
        <GroupBookingPanel
          floors={FLOORS}
          cluster={cluster}
          reserved={clusterReserved}
          onFind={handleFindCluster}
          onReserve={handleReserveCluster}
          onClear={() => setCluster(null)}
          loading={clusterLoading}
          error={clusterError}
        />

        {/* Search + filters */}
        <div className="mt-6 flex flex-col gap-3 rounded-none border border-hairline bg-surface-card p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search desk number, e.g. D14"
              className="w-full rounded-none border border-hairline bg-surface-soft py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="flex-1 rounded-none border border-hairline bg-surface-soft px-3 py-2.5 text-sm font-medium text-body transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:flex-none"
            >
              <option value="All">All Floors</option>
              {FLOORS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="flex-1 rounded-none border border-hairline bg-surface-soft px-3 py-2.5 text-sm font-medium text-body transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:flex-none"
            >
              <option value="All">All Sections</option>
              {SECTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-body">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-success" /> Available</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-occupied" /> Occupied</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-away" /> Away</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Reserved</span>
        </div>

        {/* Desk groups */}
        <div className="mt-4 space-y-6">
          {grouped.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-hairline bg-surface-card py-16 text-center">
              <SearchX size={36} className="text-muted" />
              <p className="mt-3 text-sm font-semibold text-body-strong">No desks match your search</p>
              <p className="mt-1 text-sm text-muted">Try a different desk number, floor, or section.</p>
            </div>
          )}

          {grouped.map(([key, sectionDesks]) => {
            const [f, s] = key.split('|');
            return (
              <div key={key} className="rounded-none border border-hairline bg-surface-card p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase text-ink">
                    {f} <span className="text-muted">·</span> {s}
                  </h3>
                  <span className="text-xs font-medium text-muted">{sectionDesks.length} desks</span>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                  {sectionDesks.map((desk) => (
                    <DeskCell
                      key={desk.id}
                      desk={desk}
                      onClick={setSelectedDesk}
                      highlighted={highlightedIds.has(desk.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav
        active="dashboard"
        onNavigate={onNavigate}
        onScan={() => {
          setScanTargetId(null);
          setScannerOpen(true);
        }}
      />

      {selectedDesk && (
        <DeskDetailsModal
          desk={desks.find((d) => d.id === selectedDesk.id) ?? selectedDesk}
          onClose={() => setSelectedDesk(null)}
          onScan={() => {
            setScanTargetId(selectedDesk.id);
            setScannerOpen(true);
          }}
          onCheckIn={() => handleCheckIn(selectedDesk)}
          onClaim={() => handleClaim(selectedDesk)}
          currentStudentId={CURRENT_USER.studentId}
        />
      )}

      {scannerOpen && (
        <QRScannerModal onClose={() => { setScannerOpen(false); setScanTargetId(null); }} onResult={handleScanResult} />
      )}

      {scanMessage && (
        <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-6">
          <div className="rounded-none border border-hairline bg-surface-card px-4 py-3 text-sm text-body shadow-2xl">
            {scanMessage}
          </div>
        </div>
      )}

      {deskReady && (
        <DeskReadyModal
          notification={deskReady}
          onClaim={handleDeskReadyClaim}
          onDismiss={() => setDeskReady(null)}
          claiming={claiming}
        />
      )}
    </div>
  );
}
